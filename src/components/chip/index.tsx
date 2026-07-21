import { ChipProps } from "./props";
import styles from "./styles.module.scss";

export const Chip = ({
  ariaLabel,
  className,
  children,
  disabled,
  onClick,
  readonly = true,
  variant = "primary"
}: ChipProps) => {
  return (
    <button
      className={`${styles.chip} ${styles[variant]} ${className ?? ""}`}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-readonly={readonly}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
};
