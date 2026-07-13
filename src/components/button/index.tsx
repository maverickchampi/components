import styles from "./styles.module.scss";
import { ButtonProps } from "./props";

export const Button = ({
  variant = "primary",
  loading,
  disabled,
  ariaLabel,
  onChange,
  className,
  children,
}: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className ?? ""}`}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      onClick={onChange}
    >
      {loading ? (
        <span className={styles.spinner}></span>
      ) : (
        children
      )}
    </button>
  );
};
