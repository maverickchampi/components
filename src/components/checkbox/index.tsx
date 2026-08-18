import { useId } from "react";
import { CheckboxProps } from "./props";
import styles from "./styles.module.scss";

export const Checkbox = ({
  label,
  disabled,
  error,
  ...props
}: CheckboxProps) => {
  const id = useId();

  return (
    <div className={styles.checkboxComponent}>
      <div className={`${styles.checkboxElement} ${disabled ? styles.disabled : ""}`}>
        <input
          {...props}
          id={id}
          type="checkbox"
          disabled={disabled}
          aria-invalid={!!error }
        />

        <label htmlFor={id}>{label}</label>
      </div>

      {error && (
        <span className={styles.error}>{error}</span>
      )}
    </div>
  );
};
