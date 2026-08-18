import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollToTopProps } from "./props";
import styles from "./styles.module.scss";

export const ScrollToTop = ({
  callback,
  className,
  minimumScrollY = 300,
  container,
  ...props
}: ScrollToTopProps) => {
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef(0);
  const isTicking = useRef(false);

  const getScrollElement = useCallback(() => container?.current ?? window, [container]);

  const getCurrentScrollY = useCallback(() => container?.current?.scrollTop ?? window.scrollY, [container]);

  const handleToTop = () => {
    getScrollElement().scrollTo({
      top: 0,
      behavior: "smooth"
    });

    callback?.();
  };

  useEffect(() => {
    const targetElement = getScrollElement();

    const handleScrollEvaluation = () => {
      const currentScrollY = getCurrentScrollY();
      const isScrollingUp = currentScrollY < lastScrollY.current;
      const hasScrolledEnough = currentScrollY > minimumScrollY;

      setVisible(hasScrolledEnough && isScrollingUp);
      lastScrollY.current = currentScrollY;
      isTicking.current = false;
    };

    const onScroll = () => {
      if (!isTicking.current) {
        window.requestAnimationFrame(handleScrollEvaluation);
        isTicking.current = true;
      }
    };

    handleScrollEvaluation();
    targetElement.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      targetElement.removeEventListener("scroll", onScroll);
    };
  }, [getScrollElement, getCurrentScrollY, minimumScrollY]);

  return (
    <button
      {...props}
      aria-label={props["aria-label"] ?? "Scroll to top"}
      type="button"
      onClick={handleToTop}
      className={`${styles.scrollToTop} ${visible ? styles.active : ""} ${className ?? ""}`}
    >
      <i className="mc-chevron-up" aria-hidden="true" />
    </button>
  );
};
