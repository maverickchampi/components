import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Chip } from "./index";
import styles from "./styles.module.scss";

describe("Chip Component", () => {
  it("should render chip with text as a span when readonly is true (default)", () => {
    render(<Chip>New Tag</Chip>);
    const chip = screen.getByText(/new tag/i);
    expect(chip.tagName).toBe("SPAN");
    expect(chip).toHaveClass(styles.readonly);
  });

  it("should render with primary variant by default", () => {
    render(<Chip>Primary</Chip>);
    const chip = screen.getByText("Primary");
    expect(chip).toHaveClass(styles.primary);
  });

  it("should render with outline variant", () => {
    render(<Chip variant="outline">Outline</Chip>);
    const chip = screen.getByText("Outline");
    expect(chip).toHaveClass(styles.outline);
  });

  it("should call onClick handler when clicked as a button", () => {
    const handleClick = vi.fn();
    render(<Chip readonly={false} onClick={handleClick}>Click me</Chip>);

    const chip = screen.getByRole("button", { name: /click me/i });

    fireEvent.click(chip);
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Chip readonly={false} disabled>Disabled</Chip>);
    const chip = screen.getByRole("button", { name: /disabled/i });
    expect(chip).toBeDisabled();
  });

  it("should not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(
      <Chip readonly={false} onClick={handleClick} disabled>
        Disabled
      </Chip>
    );
    const chip = screen.getByRole("button", { name: /disabled/i });

    fireEvent.click(chip);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should render as an anchor link when href is provided", () => {
    render(<Chip readonly={false} href="https://example.com">Go to link</Chip>);
    
    const chip = screen.getByRole("button", { name: /go to link/i });
    
    expect(chip.tagName).toBe("A");
    expect(chip).toHaveAttribute("href", "https://example.com");
  });

  it("should support target blank and custom props on links", () => {
    render(
      <Chip readonly={false} href="https://example.com" target="_blank" rel="noopener">
        External Link
      </Chip>
    );
    const chip = screen.getByRole("button", { name: /external link/i });
    expect(chip).toHaveAttribute("target", "_blank");
    expect(chip).toHaveAttribute("rel", "noopener");
  });

  it("should have aria-label when provided", () => {
    render(<Chip ariaLabel="Custom label">Chip</Chip>);
    const chip = screen.getByText("Chip");
    expect(chip).toHaveAttribute("aria-label", "Custom label");
  });

  it("should accept custom className", () => {
    render(<Chip className="my-custom-chip">Chip</Chip>);
    const chip = screen.getByText("Chip");
    expect(chip).toHaveClass("my-custom-chip");
    expect(chip).toHaveClass(styles.chip);
  });

  it("should render with medium size by default", () => {
    render(<Chip>Default Size</Chip>);
    const chip = screen.getByText("Default Size");
    expect(chip).toHaveClass(styles.medium);
  });

  it("should render with small size class when provided", () => {
    render(<Chip size="small">Small Chip</Chip>);
    const chip = screen.getByText("Small Chip");
    expect(chip).toHaveClass(styles.small);
  });

  it("should render with large size class when provided", () => {
    render(<Chip size="large">Large Chip</Chip>);
    const chip = screen.getByText("Large Chip");
    expect(chip).toHaveClass(styles.large);
  });
});
