import { RefObject, ButtonHTMLAttributes } from "react";

export interface ScrollToTopProps extends ButtonHTMLAttributes<HTMLButtonElement> {            
  callback?: () => void;
  className?: string;
  minimumScrollY?: number;
  container?: RefObject<HTMLElement | null>;
}
