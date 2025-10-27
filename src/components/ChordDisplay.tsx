import { Card } from "@/components/ui/card";

interface Chord {
  name: string;
  timestamp?: string;
}

interface ChordDisplayProps {
  chords: Chord[];
}

export const ChordDisplay = ({ chords }: ChordDisplayProps) => {
  const formatChordName = (chord: string) => {
    // Replace flat symbol
    chord = chord.replace(/b(?![a-z])/gi, '♭');
    // Replace sharp symbol
    chord = chord.replace(/#/g, '♯');
    
    return chord;
  };

  const getChordStyle = (chord: string) => {
    const lowerChord = chord.toLowerCase();
    
    if (lowerChord.includes('dim')) {
      return 'bg-red-500/20 border-red-500/50 text-red-200';
    } else if (lowerChord.includes('aug')) {
      return 'bg-orange-500/20 border-orange-500/50 text-orange-200';
    } else if (lowerChord.includes('sus')) {
      return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200';
    } else if (lowerChord.includes('m') || lowerChord.includes('minor')) {
      return 'bg-blue-500/20 border-blue-500/50 text-blue-200';
    } else {
      return 'bg-green-500/20 border-green-500/50 text-green-200';
    }
  };

  if (chords.length === 0) return null;

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold">Detected Chords</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {chords.map((chord, idx) => (
          <Card
            key={idx}
            className={`p-4 border-2 transition-all hover:scale-105 ${getChordStyle(chord.name)}`}
          >
            <div className="text-center">
              <div className="text-2xl font-bold font-serif mb-1">
                {formatChordName(chord.name)}
              </div>
              {chord.timestamp && (
                <div className="text-xs opacity-70">
                  {chord.timestamp}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
