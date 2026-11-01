import { ChipProps } from "./props";
import styles from "./styles.module.scss";

export const Chip = ({
  className,
  children,
  variant = "primary",
  readonly = true,
  size = "medium",
  ...props
}: ChipProps) => {
  const combinedClasses = `
    ${styles.chip} 
    ${styles[variant]} 
    ${styles[size]} 
    ${readonly ? styles.readonly : ""} 
    ${className ?? ""}
  `.trim().replace(/\s+/g, " ");

  if (readonly) {
    return (
      <span className={combinedClasses} {...(props as React.ComponentPropsWithoutRef<"span">)}>
        {children}
      </span>
    );
  }

  if ("href" in props && props.href !== undefined) {
    const { href, onClick, ...anchorProps } = props as React.ComponentPropsWithoutRef<"a">;
    const rel = anchorProps.rel ?? (anchorProps.target === "_blank" ? "noopener noreferrer" : undefined);

    return (
      <a {...anchorProps} className={combinedClasses} href={href} rel={rel} onClick={onClick}>
        {children}
      </a>
    );
  }

  const { disabled, onClick, ...buttonProps } = props as React.ComponentPropsWithoutRef<"button">;
  return (
    <button
      {...buttonProps}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
};
