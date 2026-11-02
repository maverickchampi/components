import { useEffect, useId, useState } from "react";
import type { ChangeEvent } from "react";
import { SelectProps } from "./props";
import styles from "./styles.module.scss";

const hasContent = (value: unknown) =>
  value !== undefined && value !== null && String(value) !== "";

export const Select = ({
  label,
  error,
  className,
  children,
  onChange,
  ...props
}: SelectProps) => {
  const generatedId = useId();
  const id = props.id ?? generatedId;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy =
    [props["aria-describedby"], errorId].filter(Boolean).join(" ") || undefined;
  const [hasValue, setHasValue] = useState(() => hasContent(props.value ?? props.defaultValue));
  const isControlled = props.value !== undefined;
  const defaultValue = isControlled ? undefined : props.defaultValue ?? "";

  useEffect(() => {
    if (props.value !== undefined) {
      setHasValue(hasContent(props.value));
    }
  }, [props.value]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setHasValue(hasContent(event.target.value));
    onChange?.(event);
  };

  return (
    <div className={`${styles.selectComponent} ${className ?? ""}`}>
      <div className={styles.selectElement}>
        <select
          {...props}
          id={id}
          defaultValue={defaultValue}
          className={hasValue ? styles.hasValue : ""}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={handleChange}
        >
          <option value="" disabled hidden />
          {children}
        </select>
        <i className="mc-chevron-down" aria-hidden="true" />
        <label htmlFor={id}>{label}</label>
      </div>

      {error && (
        <span id={errorId} role="alert" className={styles.error}>{error}</span>
      )}
    </div>
  );
};
