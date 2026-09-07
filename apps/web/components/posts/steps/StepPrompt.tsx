"use client";

import { useState } from "react";
import { TextareaField } from "@/components/ui/TextareaField";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";

const SUGGESTED_STYLES = [
  "Company logo",
  "Modern design",
  "Blue theme",
  "Coding background",
  "Team illustration",
];

export function StepPrompt({
  prompt,
  onPromptChange,
  imageStyles,
  onImageStylesChange,
}: {
  prompt: string;
  onPromptChange: (value: string) => void;
  imageStyles: string[];
  onImageStylesChange: (styles: string[]) => void;
}) {
  const [customStyle, setCustomStyle] = useState("");

  function toggleStyle(style: string) {
    onImageStylesChange(
      imageStyles.includes(style) ? imageStyles.filter((s) => s !== style) : [...imageStyles, style]
    );
  }

  function addCustomStyle() {
    const trimmed = customStyle.trim();
    if (trimmed && !imageStyles.includes(trimmed)) {
      onImageStylesChange([...imageStyles, trimmed]);
    }
    setCustomStyle("");
  }

  return (
    <div className="space-y-6">
      <TextareaField
        label="Enter prompt / details"
        id="wizard-prompt"
        rows={8}
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        hint="This is what the AI writes the post from — edit it freely before generating."
      />

      <FormField label="What do you want in the image?" htmlFor="wizard-style-custom" hint="Optional — style tags shape the generated image.">
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_STYLES.map((style) => {
            const active = imageStyles.includes(style);
            return (
              <button
                key={style}
                type="button"
                onClick={() => toggleStyle(style)}
                aria-pressed={active}
                className={`h-7 rounded-full px-3 text-[12px] font-medium transition-colors ${
                  active
                    ? "bg-primary text-on-primary"
                    : "bg-transparent text-on-surface-variant ring-1 ring-inset ring-outline-variant hover:text-on-surface"
                }`}
              >
                {style}
              </button>
            );
          })}
          {imageStyles
            .filter((s) => !SUGGESTED_STYLES.includes(s))
            .map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => toggleStyle(style)}
                className="h-7 rounded-full bg-primary px-3 text-[12px] font-medium text-on-primary"
              >
                {style}
              </button>
            ))}
        </div>
        <div className="mt-2 flex gap-1.5">
          <Input
            id="wizard-style-custom"
            value={customStyle}
            onChange={(e) => setCustomStyle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomStyle();
              }
            }}
            placeholder="Add a custom style and press Enter"
            className="flex-1"
          />
        </div>
      </FormField>
    </div>
  );
}
