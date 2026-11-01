import { useState } from "react";
import type { ComponentProps } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeAll, beforeEach, afterEach } from "vitest";
import { Modal } from ".";
import styles from "./styles.module.scss";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: query === "(min-width: 769px)",
      media: query,
      onchange: null,
      addListener: vi.fn(), 
      removeListener: vi.fn(), 
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  });
});

function ControlledModal({
  initialOpen = true,
  onClose,
  ...props
}: {
  initialOpen?: boolean;
  onClose?: () => void;
} & Omit<ComponentProps<typeof Modal>, "isOpen">) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <Modal
      {...props}
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
        onClose?.();
      }}
    />
  );
}

describe("Modal", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.style.overflow = "visible";
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the modal content when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Modal Title">
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText("Modal Title")).toBeInTheDocument();
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("does not render the modal content when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Modal Title">
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.queryByText("Modal Title")).not.toBeInTheDocument();
  });

  it("triggers onClose after the animation timeout when close button is clicked", () => {
    const handleClose = vi.fn();

    render(
      <ControlledModal title="Modal Title" hasCloseButtonInDesktop={true} onClose={handleClose}>
        <div>Content</div>
      </ControlledModal>
    );

    vi.advanceTimersByTime(310);

    const closeButtons = screen.getAllByRole("button", { name: /close/i });
    fireEvent.click(closeButtons[closeButtons.length - 1]);

    vi.advanceTimersByTime(310);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("closes the modal when clicking outside the content (overlay) if closeInClickOut is true", () => {
    const handleClose = vi.fn();
    
    render(
      <ControlledModal title="Modal Title" closeInClickOut={true} onClose={handleClose}>
        <div>Content</div>
      </ControlledModal>
    );

    vi.advanceTimersByTime(310);

    const overlay = document.body.querySelector("[class*='modalComponent']");
    
    expect(overlay).toBeInTheDocument();

    if (overlay) {
      fireEvent.mouseDown(overlay, { 
        button: 0,
        target: overlay,
        currentTarget: overlay
      });
    }

    vi.advanceTimersByTime(310);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when clicking outside if closeInClickOut is false", () => {
    const handleClose = vi.fn();
    
    const { container } = render(
      <ControlledModal title="Modal Title" closeInClickOut={false} onClose={handleClose}>
        <div>Content</div>
      </ControlledModal>
    );

    vi.advanceTimersByTime(310);

    const overlay = container.querySelector("[class*='modalComponent']");
    
    if (overlay) {
      fireEvent.mouseDown(overlay, { button: 0 });
    }

    vi.advanceTimersByTime(310);
    expect(handleClose).not.toHaveBeenCalled();
  });

  it("closes the modal when pressing the Escape key", () => {
    const handleClose = vi.fn();

    render(
      <ControlledModal title="Modal Title" onClose={handleClose}>
        <div>Content</div>
      </ControlledModal>
    );

    vi.advanceTimersByTime(310);

    fireEvent.keyDown(document, { key: "Escape" });

    vi.advanceTimersByTime(310);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("blocks body scroll when opened and restores it when unmounted", () => {
    const { unmount } = render(
      <Modal isOpen={true} onClose={vi.fn()} title="Modal Title">
        <div>Content</div>
      </Modal>
    );

    expect(document.body.style.overflow).toBe("hidden");

    unmount();

    expect(document.body.style.overflow).toBe("visible");
  });

  it("exposes the modal as a labelled dialog", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Modal Title">
        <div>Content</div>
      </Modal>
    );

    vi.advanceTimersByTime(310);

    const dialog = screen.getByRole("dialog", { name: "Modal Title" });

    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });

  it("keeps focus inside the dialog when tabbing from the last element", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Modal Title" hasCloseButtonInDesktop>
        <button>Last action</button>
      </Modal>
    );

    vi.advanceTimersByTime(310);

    const dialog = screen.getByRole("dialog");
    const lastAction = screen.getByRole("button", { name: "Last action" });

    lastAction.focus();
    fireEvent.keyDown(document, { key: "Tab" });

    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("closes when the mobile drag handle is activated", () => {
    const handleClose = vi.fn();

    render(
      <ControlledModal title="Modal Title" onClose={handleClose}>
        <div>Content</div>
      </ControlledModal>
    );

    vi.advanceTimersByTime(310);

    const handle = document.body.querySelector(`button.${styles.modalDragHandle}`);

    expect(handle).toBeInTheDocument();
    if (handle) fireEvent.click(handle);

    vi.advanceTimersByTime(310);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("restores focus to the trigger after closing", () => {
    function Wrapper() {
      const [isModalOpen, setIsModalOpen] = useState(false);

      return (
        <>
          <button onClick={() => setIsModalOpen(true)}>Open</button>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Modal Title">
            <button>Action</button>
          </Modal>
        </>
      );
    }

    render(<Wrapper />);

    const trigger = screen.getByRole("button", { name: "Open" });
    trigger.focus();
    fireEvent.click(trigger);

    vi.advanceTimersByTime(310);

    expect(document.activeElement).not.toBe(trigger);

    fireEvent.keyDown(document, { key: "Escape" });
    vi.advanceTimersByTime(310);

    expect(document.activeElement).toBe(trigger);
  });
});
