import { useState, useEffect, useCallback } from "react";

const STORAGE_KEYS = {
  CHAT_MESSAGES: "n3o_chat_messages",
  IMAGE_GENERATIONS: "n3o_image_generations",
  TIP_JAR_DISMISSED: "n3o_tip_jar_dismissed",
};

const THRESHOLDS = {
  MESSAGES: 7,
  GENERATIONS: 2,
};

interface TipJarTrigger {
  shouldShowTipJar: boolean;
  incrementMessages: () => void;
  incrementGenerations: () => void;
  dismiss: () => void;
  messageCount: number;
  generationCount: number;
}

export const useTipJarTrigger = (): TipJarTrigger => {
  const [messageCount, setMessageCount] = useState(0);
  const [generationCount, setGenerationCount] = useState(0);
  const [isDismissed, setIsDismissed] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const messages = parseInt(localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES) || "0", 10);
    const generations = parseInt(localStorage.getItem(STORAGE_KEYS.IMAGE_GENERATIONS) || "0", 10);
    const dismissed = localStorage.getItem(STORAGE_KEYS.TIP_JAR_DISMISSED) === "true";

    setMessageCount(messages);
    setGenerationCount(generations);
    setIsDismissed(dismissed);
  }, []);

  const incrementMessages = useCallback(() => {
    setMessageCount((prev) => {
      const newCount = prev + 1;
      localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, newCount.toString());
      return newCount;
    });
  }, []);

  const incrementGenerations = useCallback(() => {
    setGenerationCount((prev) => {
      const newCount = prev + 1;
      localStorage.setItem(STORAGE_KEYS.IMAGE_GENERATIONS, newCount.toString());
      return newCount;
    });
  }, []);

  const dismiss = useCallback(() => {
    setIsDismissed(true);
    localStorage.setItem(STORAGE_KEYS.TIP_JAR_DISMISSED, "true");
  }, []);

  const shouldShowTipJar =
    !isDismissed &&
    (messageCount >= THRESHOLDS.MESSAGES || generationCount >= THRESHOLDS.GENERATIONS);

  return {
    shouldShowTipJar,
    incrementMessages,
    incrementGenerations,
    dismiss,
    messageCount,
    generationCount,
  };
};
