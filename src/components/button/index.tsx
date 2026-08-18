import styles from "./styles.module.scss";
import { ButtonProps } from "./props";

export const Button = ({
  variant = "primary",
  loading,
  disabled,
  onClick,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${loading ? styles.loading : ""} ${className ?? ""}`}
      disabled={disabled}
      aria-busy={loading}
      onClick={!loading ? onClick : undefined}
      {...props}
    >
      {loading ? (
        <>
          <span className={styles.srOnly}>Cargando</span>
          <span className={styles.dots}>
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
