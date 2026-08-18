import styles from "./styles.module.scss";
import type { ModalProps } from "./props";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import ReactDOM from "react-dom";

const modalStack: HTMLDivElement[] = [];

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  closeInClickOut = true,
  hasCloseButtonInDesktop,
  className,
  ariaLabelClose = "Close"
}: ModalProps) => {
  const refContent = useRef<HTMLDivElement>(null);
  const refBody = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isClosingRef = useRef(false);
  const isOpeningRef = useRef(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isScrollAtTop, setIsScrollAtTop] = useState(true);

  const dragStartY = useRef<number>(0);
  const dragCurrentY = useRef<number>(0);
  const dragStartTime = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  const DRAG_THRESHOLD = 150;
  const MIN_DRAG = 100;
  const VELOCITY_THRESHOLD = 0.8;

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
      onClose?.();
    }, 300);
  }, [onClose]);

  const handleScroll = useCallback(() => {
    if (refBody.current) {
      setIsScrollAtTop(refBody.current.scrollTop === 0);
    }
  }, []);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && modalStack[modalStack.length - 1] === refContent.current) {
      handleClose();
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
    dragStartTime.current = Date.now();
    isDragging.current = true;
  }, [canDrag]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;

    dragCurrentY.current = e.touches[0].clientY;
    const diff = dragCurrentY.current - dragStartY.current;

    if (diff > 0 && refContent.current) {
      refContent.current.style.transform = `translateY(${diff}px)`;
      refContent.current.style.transition = "none";
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return;

    const diff = dragCurrentY.current - dragStartY.current;
    const duration = Date.now() - dragStartTime.current;
    const velocity = diff / duration;

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
    dragStartTime.current = Date.now();
    isDragging.current = true;
    e.preventDefault();
  }, [canDrag]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;

    dragCurrentY.current = e.clientY;
    const diff = dragCurrentY.current - dragStartY.current;

    if (diff > 0 && refContent.current) {
      refContent.current.style.transform = `translateY(${diff}px)`;
      refContent.current.style.transition = "none";
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;

    const diff = dragCurrentY.current - dragStartY.current;
    const duration = Date.now() - dragStartTime.current;
    const velocity = diff / duration;

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

  useLayoutEffect(function handleOpenClose() {
    if (isOpen) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      if (openTimerRef.current) {
        clearTimeout(openTimerRef.current);
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
    if (shouldRender && refContent.current) {
      modalStack.push(refContent.current);
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.overflow = "hidden";
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
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      if (modalStack.length === 0) {
        document.body.style.overflow = "visible";
      }
    };
  }, [shouldRender, onKeyDown, handleMouseMove, handleMouseUp]);

  if (!shouldRender) return null;

  return ReactDOM.createPortal(
    <div
      className={`${styles.modalComponent} ${isClosing ? styles.modalClosing : ""}`}
      onMouseDown={onMouseDownOverlay}
    >
      <div
        ref={refContent}
        className={`${styles.modalContent} ${isClosing ? styles.modalClosing : ""} ${className || ""}`}
      >
        <div 
          className={styles.modalDragHandle}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <span className={styles.dragIndicator}></span>
        </div>

        <section 
          className={styles.modalHeader}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <h2>{title}</h2>
          {(hasCloseButtonInDesktop && isDesktop) && (
            <button
              className={styles.modalClose}
              onClick={handleClose}
              aria-label={ariaLabelClose}
              type="button"
            >
              <i className="mc-x" />
            </button>
          )}
        </section>

        <section 
          ref={refBody}
          className={`${styles.modalBody} ${isScrollAtTop ?styles.bodyScrollTop : ""}`}
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
