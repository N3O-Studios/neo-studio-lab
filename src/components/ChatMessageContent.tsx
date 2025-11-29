import { useMemo } from "react";

interface ChatMessageContentProps {
  content: string;
}

// Musical symbols mapping
const MUSICAL_SYMBOLS: Record<string, string> = {
  // Notes
  "whole note": "𝅝",
  "half note": "𝅗𝅥",
  "quarter note": "♩",
  "eighth note": "♪",
  "beamed eighth": "♫",
  "beamed sixteenth": "♬",
  // Clefs & notation
  "treble clef": "𝄞",
  "bass clef": "𝄢",
  "alto clef": "𝄡",
  "flat": "♭",
  "sharp": "♯",
  "natural": "♮",
  "fermata": "𝄐",
  // Dynamics
  "forte": "𝆑",
  "piano": "𝆏",
  // Rests
  "quarter rest": "𝄽",
  "eighth rest": "𝄾",
  // Time signatures
  "common time": "𝄴",
  "cut time": "𝄵",
  // Repeats
  "repeat": "𝄎",
  "coda": "𝄌",
  "segno": "𝄋",
};

// Wave patterns (ASCII art style)
const WAVE_PATTERNS = {
  sine: "∿∿∿∿∿∿∿∿",
  square: "⌐⌐⌐⌐⌐⌐⌐⌐",
  sawtooth: "⋰⋱⋰⋱⋰⋱⋰⋱",
  triangle: "△▽△▽△▽△▽",
};

// Simple envelope visualization
const ENVELOPE_PATTERN = "╱▔▔▔╲____";

export const ChatMessageContent = ({ content }: ChatMessageContentProps) => {
  const renderedContent = useMemo(() => {
    let processed = content;

    // Replace musical symbol keywords with actual symbols
    Object.entries(MUSICAL_SYMBOLS).forEach(([keyword, symbol]) => {
      const regex = new RegExp(`\\[${keyword}\\]`, "gi");
      processed = processed.replace(regex, symbol);
    });

    // Replace wave pattern keywords
    Object.entries(WAVE_PATTERNS).forEach(([keyword, pattern]) => {
      const regex = new RegExp(`\\[${keyword} wave\\]`, "gi");
      processed = processed.replace(regex, pattern);
    });

    // Replace envelope keyword
    processed = processed.replace(/\[envelope\]/gi, ENVELOPE_PATTERN);

    // Split by code blocks first to avoid processing inside them
    const parts = processed.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      // Code blocks
      if (part.startsWith("```") && part.endsWith("```")) {
        const codeContent = part.slice(3, -3);
        const firstNewline = codeContent.indexOf("\n");
        const language = firstNewline > -1 ? codeContent.slice(0, firstNewline).trim() : "";
        const code = firstNewline > -1 ? codeContent.slice(firstNewline + 1) : codeContent;

        return (
          <pre
            key={index}
            className="my-3 p-4 rounded-lg bg-background/80 border border-primary/20 overflow-x-auto"
          >
            {language && (
              <div className="text-xs text-primary/60 mb-2 font-mono">{language}</div>
            )}
            <code className="text-sm font-mono text-foreground">{code}</code>
          </pre>
        );
      }

      // Process inline formatting
      return <FormattedText key={index} text={part} />;
    });
  }, [content]);

  return <div className="space-y-1">{renderedContent}</div>;
};

const FormattedText = ({ text }: { text: string }) => {
  const elements = useMemo(() => {
    const result: React.ReactNode[] = [];
    let remaining = text;
    let keyCounter = 0;

    const patterns = [
      // Bold: **text** or __text__
      { regex: /\*\*(.+?)\*\*|__(.+?)__/g, render: (m: string) => <strong key={keyCounter++} className="font-bold text-primary">{m}</strong> },
      // Italic: *text* or _text_
      { regex: /(?<!\*)\*([^*]+)\*(?!\*)|(?<!_)_([^_]+)_(?!_)/g, render: (m: string) => <em key={keyCounter++} className="italic text-secondary">{m}</em> },
      // Superscript: ^text^
      { regex: /\^([^^]+)\^/g, render: (m: string) => <sup key={keyCounter++} className="text-primary/80">{m}</sup> },
      // Subscript: ~text~
      { regex: /~([^~]+)~/g, render: (m: string) => <sub key={keyCounter++} className="text-primary/80">{m}</sub> },
      // Inline code: `code`
      { regex: /`([^`]+)`/g, render: (m: string) => <code key={keyCounter++} className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-sm">{m}</code> },
      // Musical notation inline: {{note}}
      { regex: /\{\{(.+?)\}\}/g, render: (m: string) => <span key={keyCounter++} className="text-2xl text-primary mx-1 align-middle">{m}</span> },
      // Wave visualization: ~~wave~~
      { regex: /~~(.+?)~~/g, render: (m: string) => <span key={keyCounter++} className="font-mono text-primary tracking-wider">{m}</span> },
    ];

    // Process line by line for proper paragraph handling
    const lines = remaining.split("\n");
    
    lines.forEach((line, lineIndex) => {
      if (lineIndex > 0) {
        result.push(<br key={`br-${lineIndex}`} />);
      }

      // Check for headers
      const h3Match = line.match(/^### (.+)$/);
      const h2Match = line.match(/^## (.+)$/);
      const h1Match = line.match(/^# (.+)$/);
      
      if (h1Match) {
        result.push(<h1 key={`h1-${lineIndex}`} className="text-2xl font-bold text-primary mt-4 mb-2">{h1Match[1]}</h1>);
        return;
      }
      if (h2Match) {
        result.push(<h2 key={`h2-${lineIndex}`} className="text-xl font-bold text-primary mt-3 mb-2">{h2Match[1]}</h2>);
        return;
      }
      if (h3Match) {
        result.push(<h3 key={`h3-${lineIndex}`} className="text-lg font-semibold text-primary mt-2 mb-1">{h3Match[1]}</h3>);
        return;
      }

      // Check for bullet points
      const bulletMatch = line.match(/^[-*•] (.+)$/);
      if (bulletMatch) {
        result.push(
          <div key={`bullet-${lineIndex}`} className="flex gap-2 ml-2">
            <span className="text-primary">•</span>
            <span>{processInlineFormatting(bulletMatch[1], patterns, keyCounter++)}</span>
          </div>
        );
        return;
      }

      // Check for numbered lists
      const numberedMatch = line.match(/^(\d+)\. (.+)$/);
      if (numberedMatch) {
        result.push(
          <div key={`num-${lineIndex}`} className="flex gap-2 ml-2">
            <span className="text-primary font-semibold">{numberedMatch[1]}.</span>
            <span>{processInlineFormatting(numberedMatch[2], patterns, keyCounter++)}</span>
          </div>
        );
        return;
      }

      // Regular text with inline formatting
      result.push(
        <span key={`text-${lineIndex}`}>
          {processInlineFormatting(line, patterns, keyCounter++)}
        </span>
      );
    });

    return result;
  }, [text]);

  return <>{elements}</>;
};

const processInlineFormatting = (
  text: string,
  patterns: Array<{ regex: RegExp; render: (m: string) => React.ReactNode }>,
  baseKey: number
): React.ReactNode => {
  let segments: Array<{ type: "text" | "formatted"; content: string | React.ReactNode }> = [
    { type: "text", content: text },
  ];

  patterns.forEach(({ regex, render }) => {
    const newSegments: typeof segments = [];
    
    segments.forEach((segment) => {
      if (segment.type !== "text" || typeof segment.content !== "string") {
        newSegments.push(segment);
        return;
      }

      const str = segment.content;
      const parts: typeof segments = [];
      let lastIndex = 0;
      let match;

      // Reset regex
      regex.lastIndex = 0;

      while ((match = regex.exec(str)) !== null) {
        if (match.index > lastIndex) {
          parts.push({ type: "text", content: str.slice(lastIndex, match.index) });
        }
        // Get the captured group (first non-undefined capture)
        const captured = match.slice(1).find((g) => g !== undefined) || match[0];
        parts.push({ type: "formatted", content: render(captured) });
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < str.length) {
        parts.push({ type: "text", content: str.slice(lastIndex) });
      }

      newSegments.push(...(parts.length > 0 ? parts : [segment]));
    });

    segments = newSegments;
  });

  return (
    <>
      {segments.map((s, i) => (
        <span key={`${baseKey}-${i}`}>{s.content}</span>
      ))}
    </>
  );
};
