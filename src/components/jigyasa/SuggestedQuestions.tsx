"use client";

import React from "react";
import type { SpaceTopic } from "@/config/space-topics";
import { useLanguage } from "@/config/language";
import "./SuggestedQuestions.css";

type SuggestedQuestionsProps = {
  topic: SpaceTopic | null;
  onQuestionSelect: (question: string) => void;
  disabled?: boolean;
};

export function SuggestedQuestions({
  topic,
  onQuestionSelect,
  disabled = false,
}: SuggestedQuestionsProps) {
  const { language } = useLanguage();

  if (!topic) {
    return null;
  }

  const getQuestions = (): [string, string, string] => {
    switch (language) {
      case "hi":
        return topic.questions.hi;
      case "hinglish":
        return topic.questions.hinglish;
      case "hi-en":
      case "en":
      default:
        return topic.questions.en;
    }
  };

  const questions = getQuestions();

  return (
    <div className="suggested-questions">
      <span className="suggested-questions__label">Suggested questions:</span>
      <div className="suggested-questions__list">
        {questions.map((question, index) => (
          <button
            key={index}
            type="button"
            className="suggested-questions__item"
            onClick={() => onQuestionSelect(question)}
            disabled={disabled}
          >
            <span className="suggested-questions__icon">?</span>
            <span className="suggested-questions__text">{question}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
