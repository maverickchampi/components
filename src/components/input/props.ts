import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: "text" | "email" | "password" | "number" | "date";
  label: string;
  error?: string;
  className?: string;
}
