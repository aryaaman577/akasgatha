"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Respect prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("pointerdown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isOpen]);

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

  const getSelectedTopicTitle = (): string => {
    if (!selectedTopicId) return "Explore Topics";
    const topic = topics.find(t => t.id === selectedTopicId);
    return topic ? getTopicTitle(topic) : "Explore Topics";
  };

  const handleTopicSelect = (topic: SpaceTopic) => {
    onTopicSelect(topic);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="rotating-topics"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <div className="rotating-topics__header">
        <button
          type="button"
          className="rotating-topics__dropdown-button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-label="Select topic"
        >
          <span>{getSelectedTopicTitle()}</span>
          <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", marginLeft: "0.5rem" }}>▼</span>
        </button>
        
        <button
          type="button"
          className="rotating-topics__refresh"
          onClick={rotateTopic}
          disabled={disabled}
          aria-label="Show new topics"
        >
          ↻
        </button>
      </div>

      {isOpen && !disabled && (
        <div className="rotating-topics__dropdown">
          {topics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              className={`rotating-topics__dropdown-item ${
                selectedTopicId === topic.id ? "rotating-topics__dropdown-item--selected" : ""
              }`}
              onClick={() => handleTopicSelect(topic)}
            >
              {getTopicTitle(topic)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
