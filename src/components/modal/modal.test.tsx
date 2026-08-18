import { useState } from "react";
import type { ComponentProps } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeAll, beforeEach, afterEach } from "vitest";
import { Modal } from ".";

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

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

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
});
