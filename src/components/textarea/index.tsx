import { useId } from "react";
import { IProps } from "./props";
import styles from "./styles.module.scss";

export const Textarea = ({
  label,
  labelCharacters = "Characters",
  value,
  onChange,
  error,
  disabled,
  maxCharacters = 1000,
  className
}: IProps) => {
  const id = useId();

  const isLabelTop = (value?: string) => value ? styles.hasValue : "";

  return (

    <div className={`${styles.textareaComponent} ${className ?? ""}`}>
      <div className={styles.textareaWrapper}>
        <div className={styles.textareaElement}>
          <textarea
            id={id}
            value={value || ""}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.value)}
            onBlur={(e) => onChange?.(e.target.value.trim())}
            className={isLabelTop(value)}
            placeholder=" "
            maxLength={maxCharacters}
          />
          <span className={styles.decorator}>{value?.length || 0} / {maxCharacters} {labelCharacters}</span>
          <label htmlFor={id}>{label}</label>
        </div>
      </div>

      {error && (
        <span className={styles.error}>{error}</span>
      )}
    </div>
  );
};
