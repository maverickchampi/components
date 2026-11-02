import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Select } from ".";

const countries = (
  <>
    <option value="us">United States</option>
    <option value="pe">Peru</option>
    <option value="mx">Mexico</option>
  </>
);

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  args: {
    label: "Country",
    children: countries
  }
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    defaultValue: "pe"
  }
};

export const WithError: Story = {
  args: {
    error: "Please select a country"
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "mx"
  }
};

const ControlledSelect = () => {
  const [country, setCountry] = useState("");

  return (
    <div style={{ display: "grid", gap: "0.5rem", minWidth: "16rem" }}>
      <Select
        label="Country"
        value={country}
        onChange={(event) => setCountry(event.target.value)}
      >
        {countries}
      </Select>
      <span>Selected: {country || "none"}</span>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledSelect />
};
