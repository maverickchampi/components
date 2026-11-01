import styles from "./styles.module.scss";
import type { ModalProps } from "./props";
import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import ReactDOM from "react-dom";

const modalStack: HTMLDivElement[] = [];
const modalRootStack: HTMLElement[] = [];

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
].join(", ");

const getFocusableElements = (container: HTMLElement): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.hasAttribute("inert") &&
      element.getAttribute("aria-hidden") !== "true"
  );

const supportsInert = () =>
  typeof HTMLElement !== "undefined" && "inert" in HTMLElement.prototype;

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  closeInClickOut = true,
  hasCloseButtonInDesktop,
  className,
  ariaLabelClose = "Close",
  inertBackground = true,
  ...rest
}: ModalProps) => {
  const refContent = useRef<HTMLDivElement>(null);
  const refBody = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isClosingRef = useRef(false);
  const isOpeningRef = useRef(false);
  const dragMovedRef = useRef(false);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const previousOverflowRef = useRef("");
  const onCloseRef = useRef(onClose);
  const [shouldRender, setShouldRender] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isScrollAtTop, setIsScrollAtTop] = useState(true);
  const titleId = useId();

  const dragStartY = useRef<number>(0);
  const dragCurrentY = useRef<number>(0);
  const dragStartTime = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  const DRAG_THRESHOLD = 150;
  const MIN_DRAG = 100;
  const VELOCITY_THRESHOLD = 0.8;
  const TAP_THRESHOLD = 10;

  const isDesktop = useMediaQuery("(min-width: 769px)");

  const handleClose = useCallback(() => {
    if (isClosingRef.current || isOpeningRef.current) return;

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    isClosingRef.current = true;
    setIsClosing(true);

    if (refContent.current) {
      const currentTransform = refContent.current.style.transform;
      const match = currentTransform.match(/translateY\((.+?)px\)/);
      const currentY = match ? parseFloat(match[1]) : 0;

      refContent.current.style.setProperty("--start-y", `${currentY}px`);
    }

    closeTimerRef.current = setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
      isClosingRef.current = false;
      closeTimerRef.current = null;
      onCloseRef.current?.();
    }, 300);
  }, []);

  const handleScroll = useCallback(() => {
    if (refBody.current) {
      setIsScrollAtTop(refBody.current.scrollTop === 0);
    }
  }, []);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (modalStack[modalStack.length - 1] !== refContent.current) return;

    if (e.key === "Escape") {
      e.preventDefault();
      handleClose();
      return;
    }

    if (e.key !== "Tab" || !refContent.current) return;

    const focusableElements = getFocusableElements(refContent.current);

    if (focusableElements.length === 0) {
      e.preventDefault();
      refContent.current.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (!refContent.current.contains(activeElement)) {
      e.preventDefault();
      firstElement.focus();
      return;
    }

    if (e.shiftKey && (activeElement === firstElement || activeElement === refContent.current)) {
      e.preventDefault();
      lastElement.focus();
      return;
    }

    if (!e.shiftKey && activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }, [handleClose]);

  const onMouseDownOverlay = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!closeInClickOut) return;

    const isClickLeft = e.button === 0;
    const isOut = !(refContent?.current?.contains(e.target as Element));

    if (isClickLeft && isOut) handleClose();
  }, [closeInClickOut, handleClose]);

  const canDrag = useCallback((target: HTMLElement): boolean => {
    if (isDesktop) return false;

    const isDragHandle = target.closest(`.${styles.modalDragHandle}`);
    if (isDragHandle) return true;

    const isHeader = target.closest(`.${styles.modalHeader}`);
    if (isHeader) return true;

    const isBody = target.closest(`.${styles.modalBody}`);
    if (isBody && refBody.current) {
      return refBody.current.scrollTop === 0;
    }

    return false;
  }, [isDesktop]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const target = e.target as HTMLElement;

    if (!canDrag(target)) return;

    dragStartY.current = e.touches[0].clientY;
    dragCurrentY.current = e.touches[0].clientY;
    dragStartTime.current = Date.now();
    isDragging.current = true;
    dragMovedRef.current = false;
  }, [canDrag]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;

    dragCurrentY.current = e.touches[0].clientY;
    const diff = dragCurrentY.current - dragStartY.current;

    if (Math.abs(diff) > TAP_THRESHOLD) {
      dragMovedRef.current = true;
    }

    if (diff > 0 && refContent.current) {
      refContent.current.style.transform = `translateY(${diff}px)`;
      refContent.current.style.transition = "none";
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return;

    const diff = dragCurrentY.current - dragStartY.current;
    const duration = Date.now() - dragStartTime.current;
    const velocity = duration > 0 ? diff / duration : 0;

    if (refContent.current) {
      refContent.current.style.transition = "transform 0.3s ease-out";

      if (diff > DRAG_THRESHOLD || (diff > MIN_DRAG && velocity > VELOCITY_THRESHOLD)) {
        handleClose();
      } else {
        refContent.current.style.transform = "";
      }
    }

    isDragging.current = false;
    dragStartY.current = 0;
    dragCurrentY.current = 0;
    dragStartTime.current = 0;
  }, [handleClose]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    if (!canDrag(target)) return;

    dragStartY.current = e.clientY;
    dragCurrentY.current = e.clientY;
    dragStartTime.current = Date.now();
    isDragging.current = true;
    dragMovedRef.current = false;
    e.preventDefault();
  }, [canDrag]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;

    dragCurrentY.current = e.clientY;
    const diff = dragCurrentY.current - dragStartY.current;

    if (Math.abs(diff) > TAP_THRESHOLD) {
      dragMovedRef.current = true;
    }

    if (diff > 0 && refContent.current) {
      refContent.current.style.transform = `translateY(${diff}px)`;
      refContent.current.style.transition = "none";
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;

    const diff = dragCurrentY.current - dragStartY.current;
    const duration = Date.now() - dragStartTime.current;
    const velocity = duration > 0 ? diff / duration : 0;

    if (refContent.current) {
      refContent.current.style.transition = "transform 0.3s ease-out";

      if (diff > DRAG_THRESHOLD || (diff > MIN_DRAG && velocity > VELOCITY_THRESHOLD)) {
        handleClose();
      } else {
        refContent.current.style.transform = "";
      }
    }

    isDragging.current = false;
    dragStartY.current = 0;
    dragCurrentY.current = 0;
    dragStartTime.current = 0;
  }, [handleClose]);

  const handleGrabberClick = useCallback(() => {
    if (dragMovedRef.current) {
      dragMovedRef.current = false;
      return;
    }

    handleClose();
  }, [handleClose]);

  const handlersRef = useRef({ onKeyDown, handleMouseMove, handleMouseUp });

  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useLayoutEffect(() => {
    handlersRef.current = { onKeyDown, handleMouseMove, handleMouseUp };
  }, [onKeyDown, handleMouseMove, handleMouseUp]);

  useLayoutEffect(function handleOpenClose() {
    if (isOpen) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      if (openTimerRef.current) {
        clearTimeout(openTimerRef.current);
      }

      if (!shouldRender) {
        previousFocusRef.current = document.activeElement as HTMLElement | null;
      }

      isClosingRef.current = false;
      isOpeningRef.current = true;
      setIsClosing(false);
      setShouldRender(true);
      setIsScrollAtTop(true);

      openTimerRef.current = setTimeout(() => {
        isOpeningRef.current = false;
        openTimerRef.current = null;
      }, 300);
    } else if (shouldRender && !isClosingRef.current) {
      handleClose();
    }
  }, [isOpen, shouldRender, handleClose]);

  useLayoutEffect(function manageModalStack() {
    const content = refContent.current;
    const modalRoot = content?.parentElement ?? null;

    if (!shouldRender || !content || !modalRoot) return;

    if (modalStack.length === 0) {
      previousOverflowRef.current = document.body.style.overflow;
    }
    document.body.style.overflow = "hidden";
    content.focus({ preventScroll: true });

    const keyDownListener = (event: KeyboardEvent) => handlersRef.current.onKeyDown(event);
    const mouseMoveListener = (event: MouseEvent) => handlersRef.current.handleMouseMove(event);
    const mouseUpListener = () => handlersRef.current.handleMouseUp();

    modalStack.push(content);
    modalRootStack.push(modalRoot);

    document.addEventListener("keydown", keyDownListener);
    document.addEventListener("mousemove", mouseMoveListener);
    document.addEventListener("mouseup", mouseUpListener);

    const hiddenElements: Array<{ element: HTMLElement; inert: boolean; ariaHidden: boolean }> = [];
    const useInert = supportsInert();

    if (inertBackground) {
      Array.from(document.body.children).forEach((element) => {
        if (!(element instanceof HTMLElement)) return;
        if (element === modalRoot) return;
        if (modalRootStack.includes(element)) return;
        if (
          element.hasAttribute("data-floating-ui-portal") ||
          element.querySelector("[data-floating-ui-portal]")
        ) {
          return;
        }
        if (element.hasAttribute("inert") || element.getAttribute("aria-hidden") === "true") {
          return;
        }

        if (useInert) {
          element.setAttribute("inert", "");
        }

        const ariaHidden = !useInert;
        if (ariaHidden) {
          element.setAttribute("aria-hidden", "true");
        }

        hiddenElements.push({ element, inert: useInert, ariaHidden });
      });
    }

    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      if (openTimerRef.current) {
        clearTimeout(openTimerRef.current);
        openTimerRef.current = null;
      }

      modalStack.pop();
      modalRootStack.pop();

      hiddenElements.forEach(({ element, inert, ariaHidden }) => {
        if (inert) element.removeAttribute("inert");
        if (ariaHidden) element.removeAttribute("aria-hidden");
      });

      document.removeEventListener("keydown", keyDownListener);
      document.removeEventListener("mousemove", mouseMoveListener);
      document.removeEventListener("mouseup", mouseUpListener);

      if (modalStack.length === 0) {
        document.body.style.overflow = previousOverflowRef.current;
      }

      if (modalStack.length === 0 && previousFocusRef.current?.isConnected) {
        previousFocusRef.current.focus({ preventScroll: true });
        previousFocusRef.current = null;
      }
    };
  }, [shouldRender, inertBackground]);

  if (!shouldRender) return null;

  return ReactDOM.createPortal(
    <div
      className={`${styles.modalComponent} ${isClosing ? styles.modalClosing : ""}`}
      onMouseDown={onMouseDownOverlay}
    >
      <div
        {...rest}
        ref={refContent}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`${styles.modalContent} ${isClosing ? styles.modalClosing : ""} ${className || ""}`}
      >
        <button
          type="button"
          className={styles.modalDragHandle}
          aria-label={ariaLabelClose}
          onClick={handleGrabberClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <span className={styles.dragIndicator} aria-hidden="true" />
        </button>

        <section
          className={styles.modalHeader}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <h2 id={titleId}>{title}</h2>
          {(hasCloseButtonInDesktop && isDesktop) && (
            <button
              className={styles.modalClose}
              onClick={handleClose}
              aria-label={ariaLabelClose}
              type="button"
            >
              <i className="mc-x" aria-hidden="true" />
            </button>
          )}
        </section>

        <section
          ref={refBody}
          className={`${styles.modalBody} ${isScrollAtTop ? styles.bodyScrollTop : ""}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onScroll={handleScroll}
        >
          {children}
        </section>
      </div>
    </div>,
    document.body
  );
};
