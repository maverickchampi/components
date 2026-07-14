export interface CheckboxProps {
  label: string | React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
  error?: string;
}
