import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { Tooltip } from "./index";
import styles from "./styles.module.scss";

beforeEach(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
  }));
});

describe("Tooltip Component", () => {
  it("should render the reference element (children)", () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("should not render tooltip content initially", () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("should show tooltip content on hover", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );

    await user.hover(screen.getByText("Hover me"));

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
    expect(screen.getByText("Tooltip text")).toBeInTheDocument();
  });

  it("should hide tooltip content on unhover", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );

    const reference = screen.getByText("Hover me");
    await user.hover(reference);
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    await user.unhover(reference);
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  it("should show tooltip content on focus", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip text">
        <button>Focus me</button>
      </Tooltip>
    );

    await user.tab();

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });

  it("should hide tooltip content on blur", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Tooltip content="Tooltip text">
          <button>Focus me</button>
        </Tooltip>
        <button>Other button</button>
      </>
    );

    await user.tab();
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    await user.tab();
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  it("should hide tooltip content on Escape (dismiss)", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );

    await user.hover(screen.getByText("Hover me"));
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  it("should render complex content (ReactNode)", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip
        content={
          <span>
            Extra <strong>bold</strong> info
          </span>
        }
      >
        <button>Hover me</button>
      </Tooltip>
    );

    await user.hover(screen.getByText("Hover me"));

    await waitFor(() => {
      expect(screen.getByText("bold")).toBeInTheDocument();
    });
  });

  it("should apply custom className to the reference wrapper", () => {
    render(
      <Tooltip content="Tooltip text" className="custom-class">
        <button>Hover me</button>
      </Tooltip>
    );

    const wrapper = screen.getByText("Hover me").closest("div");
    expect(wrapper).toHaveClass("custom-class");
  });

  it("should apply the tooltip class to the floating element", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );

    await user.hover(screen.getByText("Hover me"));

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toHaveClass(styles.tooltip);
    });
  });

  it("should respect a custom placement prop", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Tooltip text" placement="bottom">
        <button>Hover me</button>
      </Tooltip>
    );

    await user.hover(screen.getByText("Hover me"));

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });
});
