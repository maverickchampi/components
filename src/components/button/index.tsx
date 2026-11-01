import styles from "./styles.module.scss";
import { ButtonProps } from "./props";

export const Button = ({
  variant = "primary",
  loading,
  disabled,
  onClick,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      type={type}
      className={`${styles.button} ${styles[variant]} ${loading ? styles.loading : ""} ${className ?? ""}`}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={loading ? undefined : onClick}
    >
      {loading ? (
        <>
          <span className={styles.srOnly}>{children}</span>
          <span className={styles.dots} aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
