import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Input } from ".";

describe("Input", () => {
  it("renders the label and input", () => {
    render(<Input id="username" label="Username" value="" onChange={vi.fn()} />);

    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("id", "username");
  });

  it("renders the error state with accessibility attributes", () => {
    render(
      <Input
        id="email"
        label="Email"
        value=""
        onChange={vi.fn()}
        error="Email is required"
      />
    );

    const input = screen.getByRole("textbox");
    const error = screen.getByText("Email is required");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", error.id);
    expect(error).toBeVisible();
  });

  it("renders the disabled state", () => {
    render(
      <Input id="email" label="Email" value="test@example.com" onChange={vi.fn()} disabled />
    );

    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("supports email inputs", () => {
    render(
      <Input id="email" type="email" label="Email" value="test@example.com" onChange={vi.fn()} />
    );

    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
  });

  it("keeps the placeholder for floating label behavior", () => {
    render(<Input id="username" label="Username" value="" onChange={vi.fn()} />);

    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", " ");
  });
});
