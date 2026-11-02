import { useId, useState } from "react";
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
  const describedBy =
    [props["aria-describedby"], errorId].filter(Boolean).join(" ") || undefined;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && isPasswordVisible ? "text" : type;

  return (
    <div className={`${styles.inputComponent} ${className ?? ""}`}>
      <div className={styles.inputElement}>
        <input
          {...props}
          id={inputId}
          type={inputType}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          value={props.value ?? ""}
          placeholder={props.placeholder ?? " "}
          className={`${styles.input} ${isPassword ? styles.hasPasswordToggle : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.passwordToggle}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            aria-pressed={isPasswordVisible}
            disabled={props.disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
          >
            <i
              className={isPasswordVisible ? "mc-eye-slash" : "mc-eye"}
              aria-hidden="true"
            />
          </button>
        )}
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      </div>

      {error ? (
        <span id={errorId} role="alert" className={styles.error}>
          {error}
        </span>
      ) : null}
    </div>
  );
};
