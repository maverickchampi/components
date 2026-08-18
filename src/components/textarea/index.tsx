import { useId } from "react";
import { TextareaProps } from "./props";
import styles from "./styles.module.scss";

export const Textarea = ({
  label,
  labelCharacters = "characters",
  error,
  disabled,
  maxCharacters = 1000,
  className,
  value,
  ...props
}: TextareaProps) => {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;

  const isLabelTop = (value?: string | number | readonly string[]) => value ? styles.hasValue : "";

  return (

    <div className={`${styles.textareaComponent} ${className ?? ""}`}>
      <div className={styles.textareaWrapper}>
        <div className={`${styles.textareaElement} ${disabled ? styles.disabled : ""}`}>
          <textarea
            {...props}
            id={id}
            disabled={disabled}
            className={isLabelTop(value)}
            placeholder=" "
            aria-invalid={!!error}
            aria-describedby={errorId}
            maxLength={maxCharacters}
          />
          <span className={styles.decorator} aria-hidden="true">{value?.length || 0} / {maxCharacters} {labelCharacters}</span>
          <label htmlFor={id}>{label}</label>
        </div>
      </div>

      {error && (
        <span id={errorId} className={styles.error}>{error}</span>
      )}
    </div>
  );
};
