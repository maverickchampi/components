export interface TextareaProps {
  label: string;
  labelCharacters?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  maxCharacters?: number;
  className?: string;
}
