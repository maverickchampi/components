import { fireEvent, render, screen } from "@testing-library/react";
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

  it("keeps the consumer aria-describedby alongside the error", () => {
    render(
      <>
        <span id="hint">Use your work email</span>
        <Input
          id="email"
          label="Email"
          value=""
          onChange={vi.fn()}
          aria-describedby="hint"
          error="Email is required"
        />
      </>
    );

    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-describedby",
      "hint email-error"
    );
  });

  it("supports email inputs", () => {
    render(
      <Input id="email" type="email" label="Email" value="test@example.com" onChange={vi.fn()} />
    );

    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
  });

  it("supports password inputs", () => {
    render(<Input type="password" label="Password" value="" onChange={vi.fn()} />);

    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("supports number inputs", () => {
    render(<Input type="number" label="Age" value="24" onChange={vi.fn()} />);

    expect(screen.getByRole("spinbutton", { name: "Age" })).toHaveAttribute("type", "number");
  });

  it("toggles password visibility", () => {
    render(<Input type="password" label="Password" value="secret" onChange={vi.fn()} />);

    const input = screen.getByLabelText("Password");
    const showButton = screen.getByRole("button", { name: "Show password" });

    expect(input).toHaveAttribute("type", "password");
    expect(showButton).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(showButton);

    expect(input).toHaveAttribute("type", "text");

    const hideButton = screen.getByRole("button", { name: "Hide password" });

    expect(hideButton).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(hideButton);

    expect(input).toHaveAttribute("type", "password");
  });

  it("does not render the password toggle for other types", () => {
    render(<Input type="email" label="Email" value="" onChange={vi.fn()} />);

    expect(
      screen.queryByRole("button", { name: /password/i })
    ).not.toBeInTheDocument();
  });

  it("disables the password toggle when the input is disabled", () => {
    render(
      <Input
        type="password"
        label="Password"
        value=""
        onChange={vi.fn()}
        disabled
      />
    );

    expect(
      screen.getByRole("button", { name: "Show password" })
    ).toBeDisabled();
  });

  it("keeps the placeholder for floating label behavior", () => {
    render(<Input id="username" label="Username" value="" onChange={vi.fn()} />);

    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", " ");
  });
});
