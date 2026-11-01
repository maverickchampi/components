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
import { Children, cloneElement, useState } from "react";
import type { HTMLProps, ReactElement, Ref } from "react";
import { TooltipProps } from "./props";
import styles from "./styles.module.scss";

const assignRef = <T,>(ref: Ref<T> | undefined, value: T | null) => {
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  if (ref && typeof ref === "object") {
    (ref as { current: T | null }).current = value;
  }
};

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
      offset(5),
      flip({
        fallbackAxisSideDirection: "start"
      }),
      shift()
    ]
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role
  ]);

  const child = Children.only(children) as ReactElement<HTMLProps<Element>>;
  const referenceProps = getReferenceProps(child.props) as unknown as HTMLProps<Element>;

  return (
    <>
      {cloneElement(child, {
        ...referenceProps,
        ref: (node: Element | null) => {
          refs.setReference(node);
          assignRef(child.ref as Ref<Element> | undefined, node);
        }
      })}

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
