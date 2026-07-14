import { useId } from "react";
import { CheckboxProps } from "./props";
import styles from "./styles.module.scss";

export const Checkbox = ({
  label,
  checked,
  disabled,
  onChange,
  error
}: CheckboxProps) => {
  const id = useId();

  return (
    <div className={styles.checkboxComponent}>
      <div className={`${styles.checkboxElement} ${disabled ? styles.disabled : ""}`}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
        />

        <label htmlFor={id}>{label}</label>
      </div>

      {error && (
        <span className={styles.error}>{error}</span>
      )}
    </div>
  );
};
