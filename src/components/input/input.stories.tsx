import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";
import { Input } from ".";
import type { InputProps } from "./props";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    label: "Email",
    type: "email",
    value: ""
  }
};

export default meta;

type Story = StoryObj<typeof Input>;

const Render = (args: InputProps) => {
  const [{ value }, updateArgs] = useArgs();

  return (
    <Input
      {...args}
      value={value}
      onChange={(value) => updateArgs({ value })}
    />
  );
};

export const Default: Story = {
  render: Render
};

export const WithValue: Story = {
  args: {
    label: "Full name",
    type: "text",
    value: "Maverick Champi"
  },
  render: Render
};

export const WithError: Story = {
  args: {
    error: "This field is required"
  },
  render: Render
};

export const Disabled: Story = {
  args: {
    disabled: true
  },
  render: Render
};
