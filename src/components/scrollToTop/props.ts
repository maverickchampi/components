import { RefObject } from "react";

export interface ScrollToTopProps {
  ariaLabel?: string;
  callback?: () => void;
  className?: string;
  disabled?: boolean;
  minimumScrollY?: number;
  container?: RefObject<HTMLElement | null>;
}
