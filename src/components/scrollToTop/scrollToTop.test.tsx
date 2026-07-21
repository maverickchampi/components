import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ScrollToTop } from ".";
import styles from "./styles.module.scss";

describe("ScrollToTop", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 0
    });

    window.scrollTo = vi.fn();
  });

  it("renders the button", () => {
    render(<ScrollToTop />);

    expect(
      screen.getByRole("button", { name: /scroll to top/i })
    ).toBeInTheDocument();
  });

  it("uses a custom aria-label", () => {
    render(<ScrollToTop ariaLabel="Back to top" />);

    expect(
      screen.getByRole("button", { name: /back to top/i })
    ).toBeInTheDocument();
  });

  it("scrolls to the top when clicked", () => {
    render(<ScrollToTop />);

    fireEvent.click(screen.getByRole("button"));

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth"
    });
  });

  it("calls the callback when clicked", () => {
    const callback = vi.fn();

    render(<ScrollToTop callback={callback} />);

    fireEvent.click(screen.getByRole("button"));

    expect(callback).toHaveBeenCalledOnce();
  });

  it("renders disabled", () => {
    render(<ScrollToTop disabled />);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("becomes visible after scrolling up beyond minimumScrollY", () => {
    render(<ScrollToTop minimumScrollY={100} />);

    window.scrollY = 150;
    fireEvent.scroll(window);

    window.scrollY = 120;
    fireEvent.scroll(window);

    expect(screen.getByRole("button")).toHaveClass(styles.active);
  });

  it("remains hidden while scrolling down", () => {
    render(<ScrollToTop minimumScrollY={100} />);

    window.scrollY = 120;
    fireEvent.scroll(window);

    window.scrollY = 180;
    fireEvent.scroll(window);

    expect(screen.getByRole("button")).not.toHaveClass(styles.active);
  });

  it("uses the provided container instead of window", () => {
    const container = document.createElement("div");
    container.scrollTop = 0;
    container.scrollTo = vi.fn();

    const ref = createRef<HTMLDivElement>();
    ref.current = container;

    render(<ScrollToTop container={ref} />);

    fireEvent.click(screen.getByRole("button"));

    expect(container.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth"
    });

    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
