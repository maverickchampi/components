import { useId } from "react";
import { CheckboxProps } from "./props";
import styles from "./styles.module.scss";

export const Checkbox = ({
  label,
  disabled,
  error,
  ...props
}: CheckboxProps) => {
  const generatedId = useId();
  const id = props.id ?? generatedId;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy =
    [props["aria-describedby"], errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={styles.checkboxComponent}>
      <div className={`${styles.checkboxElement} ${disabled ? styles.disabled : ""}`}>
        <input
          {...props}
          id={id}
          type="checkbox"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />

        <label htmlFor={id}>{label}</label>
      </div>

      {error && (
        <span id={errorId} role="alert" className={styles.error}>{error}</span>
      )}
    </div>
  );
};
