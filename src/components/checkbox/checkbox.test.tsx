import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Checkbox } from "./index";
import styles from "./styles.module.scss";

describe("Checkbox Component", () => {
  it("should render checkbox with label", () => {
    render(<Checkbox label="Accept terms and conditions" />);

    const checkbox = screen.getByRole("checkbox", {
      name: /accept terms and conditions/i
    });

    expect(checkbox).toBeInTheDocument();
  });

  it("should render checked when checked prop is true", () => {
    render(
      <Checkbox
        label="Accept terms and conditions"
        checked
      />
    );

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeChecked();
  });

  it("should render unchecked by default", () => {
    render(
      <Checkbox
        label="Accept terms and conditions"
        checked={false}
      />
    );

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).not.toBeChecked();
  });

  it("should call onChange when clicked", () => {
    const handleChange = vi.fn();

    render(
      <Checkbox
        label="Accept terms and conditions"
        checked={false}
        onChange={handleChange}
      />
    );

    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledOnce();
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("should be disabled when disabled prop is true", () => {
    render(
      <Checkbox
        label="Accept terms and conditions"
        disabled
      />
    );

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeDisabled();
  });

  it("should not call onChange when disabled", async () => {
    const handleChange = vi.fn();

    render(
      <Checkbox
        label="Accept terms and conditions"
        disabled
        checked={false}
        onChange={handleChange}
      />
    );

    const checkbox = screen.getByRole("checkbox");

    await userEvent.click(checkbox);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("should render error message", () => {
    render(
      <Checkbox
        label="Accept terms and conditions"
        error="This field is required"
      />
    );

    expect(
      screen.getByText("This field is required")
    ).toBeInTheDocument();
  });

  it("should apply disabled class", () => {
    const { container } = render(
      <Checkbox
        label="Accept terms and conditions"
        disabled
      />
    );

    const wrapper = container.querySelector(`.${styles.checkboxElement}`);

    expect(wrapper).toHaveClass(styles.disabled);
  });

  it("should associate label with checkbox", () => {
    render(<Checkbox label="Accept terms and conditions" />);

    const checkbox = screen.getByLabelText(
      /accept terms and conditions/i
    );

    expect(checkbox).toBeInTheDocument();
  });

  it("should toggle checked state through props", () => {
    const { rerender } = render(
      <Checkbox
        label="Accept terms and conditions"
        checked={false}
      />
    );

    let checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    rerender(
      <Checkbox
        label="Accept terms and conditions"
        checked
      />
    );

    checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });
});
