import { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "outline";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
  children?: string | React.ReactNode;
}
