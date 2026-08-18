import { useId } from "react";
import styles from "./styles.module.scss";
import type { InputProps } from "./props";

export const Input = ({
  type = "text",
  label,
  error,
  className,
  ...props
}: InputProps) => {
  const generatedId = useId();
  const inputId = props.id ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={`${styles.inputComponent} ${className ?? ""}`}>
      <div className={styles.inputElement}>
        <input
          {...props}
          id={inputId}
          type={type}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={errorId}
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
