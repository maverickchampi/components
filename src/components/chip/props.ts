export type ChipVariant = "primary" | "outline";

interface BaseChipProps {
  ariaLabel?: string;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: ChipVariant;
}

type ReadonlyChipProps = {
  readonly: true;
  onClick?: never;
};

type InteractiveChipProps = {
  readonly?: false;
  onClick?: () => void;
};

export type ChipProps = BaseChipProps &
  (ReadonlyChipProps | InteractiveChipProps);
