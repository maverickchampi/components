import { useId } from "react";
import { CheckboxProps } from "./props";
import styles from "./styles.module.scss";

export const Checkbox = ({
  label,
  disabled,
  error,
  checked,
  ...props
}: CheckboxProps) => {
  const id = useId();
  const showError = error && !checked;

  return (
    <div className={styles.checkboxComponent}>
      <div className={`${styles.checkboxElement} ${disabled ? styles.disabled : ""}`}>
        <input
          {...props}
          id={id}
          type="checkbox"
          disabled={disabled}
          checked={checked}
          aria-invalid={!!showError }
        />

        <label htmlFor={id}>{label}</label>
      </div>

      {showError && (
        <span className={styles.error}>{error}</span>
      )}
    </div>
  );
};
