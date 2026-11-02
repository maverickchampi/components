import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Select } from ".";
import styles from "./styles.module.scss";

const options = (
  <>
    <option value="us">United States</option>
    <option value="pe">Peru</option>
  </>
);

describe("Select", () => {
  it("renders the label and the options", () => {
    render(<Select label="Country">{options}</Select>);

    expect(screen.getByLabelText("Country")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Country" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Peru" })).toBeInTheDocument();
  });

  it("calls onChange when the value changes", () => {
    const handleChange = vi.fn();

    render(
      <Select label="Country" onChange={handleChange}>
        {options}
      </Select>
    );

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "pe" } });

    expect(handleChange).toHaveBeenCalledOnce();
  });

  it("floats the label once a value is selected", () => {
    render(
      <Select label="Country" defaultValue="pe">
        {options}
      </Select>
    );

    expect(screen.getByRole("combobox")).toHaveClass(styles.hasValue);
  });

  it("keeps the label centered when there is no value", () => {
    render(<Select label="Country">{options}</Select>);

    const select = screen.getByRole("combobox");

    expect(select).toHaveValue("");
    expect(select).not.toHaveClass(styles.hasValue);
  });

  it("associates the error message with the select", () => {
    render(
      <Select label="Country" error="This field is required">
        {options}
      </Select>
    );

    const select = screen.getByRole("combobox");
    const error = screen.getByText("This field is required");

    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select).toHaveAttribute("aria-describedby", error.id);
    expect(error).toHaveAttribute("role", "alert");
  });

  it("renders the disabled state", () => {
    render(
      <Select label="Country" disabled>
        {options}
      </Select>
    );

    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("respects a consumer provided id and aria-describedby", () => {
    render(
      <>
        <span id="hint">Pick one</span>
        <Select label="Country" id="country" aria-describedby="hint" error="Required">
          {options}
        </Select>
      </>
    );

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-describedby",
      "hint country-error"
    );
  });
});
