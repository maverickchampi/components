export interface InputProps {
  type?: "text" | "email";
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}
