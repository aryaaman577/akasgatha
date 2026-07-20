"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getRandomTopics, type SpaceTopic } from "@/config/space-topics";
import { useLanguage } from "@/config/language";
import "./RotatingTopics.css";

type RotatingTopicsProps = {
  onTopicSelect: (topic: SpaceTopic) => void;
  selectedTopicId?: string | null;
  disabled?: boolean;
  autoRotate?: boolean;
  rotationInterval?: number; // milliseconds
};

export function RotatingTopics({
  onTopicSelect,
  selectedTopicId,
  disabled = false,
  autoRotate = true,
  rotationInterval = 15000, // 15 seconds
}: RotatingTopicsProps) {
  const { language } = useLanguage();
  const [topics, setTopics] = useState<SpaceTopic[]>(() => getRandomTopics(5));
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Respect prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Rotate topics
  const rotateTopic = useCallback(() => {
    setTopics(getRandomTopics(5));
  }, []);

  // Auto-rotation logic
  useEffect(() => {
    if (
      !autoRotate ||
      disabled ||
      isHovered ||
      isFocused ||
      prefersReducedMotion
    ) {
      return;
    }

    const timer = setInterval(rotateTopic, rotationInterval);
    return () => clearInterval(timer);
  }, [
    autoRotate,
    disabled,
    isHovered,
    isFocused,
    prefersReducedMotion,
    rotationInterval,
    rotateTopic,
  ]);

  const getTopicTitle = (topic: SpaceTopic): string => {
    switch (language) {
      case "hi":
        return topic.titleHi;
      case "hinglish":
        return topic.titleHinglish;
      case "hi-en":
        return `${topic.titleHi} — ${topic.titleEn}`;
      default:
        return topic.titleEn;
    }
  };

  return (
    <div
      className="rotating-topics"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <div className="rotating-topics__header">
        <span className="rotating-topics__label">Explore Topics:</span>
        <button
          type="button"
          className="rotating-topics__refresh"
          onClick={rotateTopic}
          disabled={disabled}
          aria-label="Show new topics"
        >
          Show New Topics
        </button>
      </div>

      <div className="rotating-topics__list">
        {topics.map((topic) => (
          <button
            key={topic.id}
            type="button"
            className={`rotating-topics__item ${
              selectedTopicId === topic.id ? "rotating-topics__item--selected" : ""
            }`}
            onClick={() => onTopicSelect(topic)}
            disabled={disabled}
          >
            {getTopicTitle(topic)}
          </button>
        ))}
      </div>
    </div>
  );
}
