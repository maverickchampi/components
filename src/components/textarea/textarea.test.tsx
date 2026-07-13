import { useState } from "react";
import type { ComponentProps } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Textarea } from ".";

function ControlledTextarea({
  initialValue = "",
  onChange,
  ...props
}: {
  initialValue?: string;
  onChange?: (value: string) => void;
} & ComponentProps<typeof Textarea>) {
  const [value, setValue] = useState(initialValue);

  return (
    <Textarea
      {...props}
      value={value}
      onChange={(nextValue) => {
        setValue(nextValue);
        onChange?.(nextValue);
      }}
    />
  );
}

describe("Textarea", () => {
  it("renders the label and textarea", () => {
    render(<Textarea label="Comments" value="" onChange={vi.fn()} />);

    expect(screen.getByLabelText("Comments")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("id");
  });

  it("updates value and trims on blur", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<ControlledTextarea label="Comments" onChange={handleChange} />);

    const textarea = screen.getByRole("textbox");

    await user.type(textarea, "  Test comment  ");
    expect(textarea).toHaveValue("  Test comment  ");

    await user.tab();
    expect(handleChange).toHaveBeenCalled();
    expect(textarea).toHaveValue("Test comment");
  });

  it("renders the error and character count", () => {
    render(
      <Textarea
        label="Comments"
        value="Test comment"
        onChange={vi.fn()}
        error="Comments are required"
        maxCharacters={500}
      />
    );

    expect(screen.getByText("Comments are required")).toBeVisible();
    expect(screen.getByText(/12 \/ 500 characters/i)).toBeInTheDocument();
  });

  it("respects maxCharacters", () => {
    render(<Textarea label="Comments" value="Test" onChange={vi.fn()} maxCharacters={200} />);

    expect(screen.getByRole("textbox")).toHaveAttribute("maxlength", "200");
  });

  it("uses the default maxCharacters when not provided", () => {
    render(<Textarea label="Comments" value="Test" onChange={vi.fn()} />);

    expect(screen.getByText(/4 \/ 1000 characters/i)).toBeInTheDocument();
  });

  it("renders custom labelCharacters text", () => {
    render(
      <Textarea
        label="Comments"
        value="Test"
        onChange={vi.fn()}
        labelCharacters="caracteres"
      />
    );

    expect(screen.getByText(/4 \/ 1000 caracteres/i)).toBeInTheDocument();
  });

  it("keeps the placeholder for floating label behavior", () => {
    render(<Textarea label="Comments" value="" onChange={vi.fn()} />);

    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", " ");
  });

  it("renders the disabled state", () => {
    render(<Textarea label="Comments" value="Test" onChange={vi.fn()} disabled />);

    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("trims the value on blur", () => {
    const handleChange = vi.fn();

    render(<Textarea label="Comments" value="  Test comment  " onChange={handleChange} />);

    fireEvent.blur(screen.getByRole("textbox"));

    expect(handleChange).toHaveBeenCalledWith("Test comment");
  });
});
