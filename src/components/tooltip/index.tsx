import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole
} from "@floating-ui/react";
import React, { useState } from "react";
import { TooltipProps } from "./props";
import styles from "./styles.module.scss";

export function Tooltip({
  children, 
  content, 
  placement = "top"
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    strategy: "fixed",
    placement: placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(6),
      flip({
        fallbackAxisSideDirection: "start"
      }),
      shift({ padding: 8 })
    ]
  });

  const hover = useHover(context, { move: false, delay: 100 });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role
  ]);

  const renderReference = React.cloneElement(
    children,
    getReferenceProps({
      ref: refs.setReference,
      ...children.props
    })
  );

  return (
    <>
      {renderReference}

      <FloatingPortal>
        {isOpen && (
          <div
            className={styles.tooltip}
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            {content}
          </div>
        )}
      </FloatingPortal>
    </>
  );
}
