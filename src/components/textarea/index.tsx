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
  const generatedId = useId();
  const id = props.id ?? generatedId;
  const errorId = error ? `${id}-error` : undefined;
  const counterId = `${id}-counter`;
  const describedBy =
    [props["aria-describedby"], errorId, counterId].filter(Boolean).join(" ") ||
    undefined;
  const currentLength = String(value ?? props.defaultValue ?? "").length;

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
            value={value ?? ""}
            placeholder={props.placeholder ?? " "}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            maxLength={maxCharacters}
          />
          <span id={counterId} className={styles.decorator}>
            {currentLength} / {maxCharacters} {labelCharacters}
          </span>
          <label htmlFor={id}>{label}</label>
        </div>
      </div>

      {error && (
        <span id={errorId} role="alert" className={styles.error}>{error}</span>
      )}
    </div>
  );
};
