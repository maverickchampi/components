import { ChipProps } from "./props";
import styles from "./styles.module.scss";

export const Chip = (props: ChipProps) => {
  const {
    ariaLabel,
    className,
    children,
    variant = "primary",
    readonly = true,
    ...rest
  } = props;

  const combinedClasses = `${styles.chip} ${styles[variant]} ${className ?? ""}`;

  if (readonly) {
    return (
      <span
        className={combinedClasses}
        aria-label={ariaLabel}
        aria-readonly="true"
        {...(rest as React.ComponentPropsWithoutRef<"span">)}
      >
        {children}
      </span>
    );
  }

  if ("href" in rest && rest.href) {
    const { href, onClick, ...anchorProps } = rest;
    return (
      <a
        className={combinedClasses}
        href={href}
        onClick={onClick}
        aria-label={ariaLabel}
        role="button"
        {...anchorProps}
      >
        {children}
      </a>
    );
  }

  const { disabled, onClick, ...buttonProps } = rest as {
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  };

  return (
    <button
      className={combinedClasses}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      type="button"
      {...buttonProps}
    >
      {children}
    </button>
  );
};
