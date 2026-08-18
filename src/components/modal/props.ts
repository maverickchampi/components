import React from "react";

export interface ModalProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "children"> {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  children: React.ReactNode;
  closeInClickOut?: boolean;
  className?: string;
  hasCloseButtonInDesktop?: boolean;
  ariaLabelClose?: this["hasCloseButtonInDesktop"] extends false ? never : string;
}
