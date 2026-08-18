import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Textarea } from ".";

describe("Textarea", () => {
  it("renders the label and textarea", () => {
    render(<Textarea label="Comments" value="" onChange={vi.fn()} />);

    expect(screen.getByLabelText("Comments")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("id");
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
});
