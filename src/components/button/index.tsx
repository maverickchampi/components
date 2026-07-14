import styles from "./styles.module.scss";
import { ButtonProps } from "./props";

export const Button = ({
  variant = "primary",
  loading,
  disabled,
  ariaLabel,
  onClick,
  className,
  children
}: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${loading ? styles.loading : ""} ${className ?? ""}`}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-busy={loading}
      onClick={!loading ? onClick : undefined}
    >
      {loading ? (
        <span className={styles.dots}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
