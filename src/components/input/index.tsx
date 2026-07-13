import { useId } from "react";
import styles from "./styles.module.scss";
import type { InputProps } from "./props";

export const Input = ({
  type = "text",
  label,
  value,
  onChange,
  error,
  disabled,
  id,
  className
}: InputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={`${styles.inputComponent} ${className ?? ""}`}>
      <div className={styles.inputElement}>
        <input
          id={inputId}
          type={type}
          value={value ?? ""}
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={errorId}
          onChange={(event) => onChange?.(event.target.value)}
          onBlur={(event) => onChange?.(event.target.value.trim())}
          placeholder=" "
          className={styles.input}
        />
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      </div>

      {error ? (
        <span id={errorId} className={styles.error}>
          {error}
        </span>
      ) : null}
    </div>
  );
};
