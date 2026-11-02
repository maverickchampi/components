import React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
}
