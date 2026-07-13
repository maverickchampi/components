import { useState } from "react";
import type { ComponentProps } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Input } from ".";

function ControlledInput({
  initialValue = "",
  onChange,
  ...props
}: {
  initialValue?: string;
  onChange?: (value: string) => void;
} & ComponentProps<typeof Input>) {
  const [value, setValue] = useState(initialValue);

  return (
    <Input
      {...props}
      value={value}
      onChange={(nextValue) => {
        setValue(nextValue);
        onChange?.(nextValue);
      }}
    />
  );
}

describe("Input", () => {
  it("renders the label and input", () => {
    render(<Input id="username" label="Username" value="" onChange={vi.fn()} />);

    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("id", "username");
  });

  it("updates its value and trims on blur", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<ControlledInput label="Username" onChange={handleChange} />);

    const input = screen.getByRole("textbox");

    await user.type(input, "  johndoe  ");
    expect(input).toHaveValue("  johndoe  ");

    await user.tab();
    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue("johndoe");
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

  it("trims the value on blur", () => {
    const handleChange = vi.fn();

    render(<Input id="username" label="Username" value="  johndoe  " onChange={handleChange} />);

    fireEvent.blur(screen.getByRole("textbox"));

    expect(handleChange).toHaveBeenCalledWith("johndoe");
  });
});
