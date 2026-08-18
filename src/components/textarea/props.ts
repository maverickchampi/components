import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  disabled?: boolean;
  label: string;
  labelCharacters?: string;
  error?: string;
  maxCharacters?: number;
  value?: string
}
