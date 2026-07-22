import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollToTopProps } from "./props";
import styles from "./styles.module.scss";

export const ScrollToTop = ({
  ariaLabel,
  callback,
  className,
  disabled,
  minimumScrollY = 300,
  container
}: ScrollToTopProps) => {
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef(0);

  const getScrollElement = useCallback(() => container?.current ?? window, [container]);

  const getCurrentScrollY = useCallback(() => container?.current?.scrollTop ?? window.scrollY, [container]);

  const handleToTop = () => {
    getScrollElement().scrollTo({
      top: 0,
      behavior: "smooth"
    });

    callback?.();
  };

  const handleVisibilityScrollToTop = useCallback(() => {
    const currentScrollY = getCurrentScrollY();

    const isScrollingUp = currentScrollY < lastScrollY.current;
    const hasScrolledEnough = currentScrollY > minimumScrollY;

    setVisible(hasScrolledEnough && isScrollingUp);

    lastScrollY.current = currentScrollY;
  }, [getCurrentScrollY, minimumScrollY]);

  useEffect(() => {
    const element = getScrollElement();

    handleVisibilityScrollToTop();

    element.addEventListener("scroll", handleVisibilityScrollToTop);

    return () => {
      element.removeEventListener("scroll", handleVisibilityScrollToTop);
    };
  }, [getScrollElement, handleVisibilityScrollToTop]);

  return (
    <button
      onClick={handleToTop}
      className={`${styles.scrollToTop} ${visible ? styles.active : ""} ${className ?? ""}`}
      disabled={disabled}
      aria-label={ariaLabel ?? "Scroll to top"}
    >
      <i className="mc-chevron-up" />
    </button>
  );
};
