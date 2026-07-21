import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Chip } from "./index";
import styles from "./styles.module.scss";

describe("Chip Component", () => {
  it("should render chip with text", () => {
    render(<Chip>New Tag</Chip>);
    const chip = screen.getByRole("button", { name: /new tag/i });
    expect(chip).toBeInTheDocument();
  });

  it("should render with primary variant by default", () => {
    render(<Chip>Primary</Chip>);
    const chip = screen.getByRole("button");
    expect(chip).toHaveClass(styles.primary);
  });

  it("should render with outline variant", () => {
    render(<Chip variant="outline">Outline</Chip>);
    const chip = screen.getByRole("button");
    expect(chip).toHaveClass(styles.outline);
  });

  it("should call onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Chip onClick={handleClick}>Click me</Chip>);
    const chip = screen.getByRole("button");

    fireEvent.click(chip);
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Chip disabled>Disabled</Chip>);
    const chip = screen.getByRole("button");
    expect(chip).toBeDisabled();
  });

  it("should not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(
      <Chip onClick={handleClick} disabled>
        Disabled
      </Chip>
    );
    const chip = screen.getByRole("button");

    fireEvent.click(chip);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should have aria-readonly='true' by default", () => {
    render(<Chip>Readonly Default</Chip>);
    const chip = screen.getByRole("button");
    expect(chip).toHaveAttribute("aria-readonly", "true");
  });

  it("should change aria-readonly attribute when prop is false", () => {
    render(<Chip readonly={false}>Editable</Chip>);
    const chip = screen.getByRole("button");
    expect(chip).toHaveAttribute("aria-readonly", "false");
  });

  it("should have aria-label when provided", () => {
    render(<Chip ariaLabel="Custom label">Chip</Chip>);
    const chip = screen.getByRole("button", { name: /custom label/i });
    expect(chip).toBeInTheDocument();
  });

  it("should accept custom className", () => {
    render(<Chip className="my-custom-chip">Chip</Chip>);
    const chip = screen.getByRole("button");
    expect(chip).toHaveClass("my-custom-chip");
    expect(chip).toHaveClass(styles.chip);
  });
});
