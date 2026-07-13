import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Input } from ".";
import type { InputProps } from "./props";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  },
  args: {
    label: "Email",
    type: "email"
  }
};

export default meta;
type Story = StoryObj<typeof Input>;

function StatefulInput(args: InputProps) {
  const [value, setValue] = useState(args.value ?? "");

  return (
    <div style={{ width: 360 }}>
      <Input {...args} value={value} onChange={setValue} />
    </div>
  );
}

export const Default: Story = {
  render: (args) => <StatefulInput {...args} />
};

export const WithValue: Story = {
  args: {
    label: "Full name",
    type: "text",
    value: "Maverick Champi"
  },
  render: (args) => <StatefulInput {...args} />
};

export const WithError: Story = {
  args: {
    label: "Email",
    type: "email",
    error: "This field is required"
  },
  render: (args) => <StatefulInput {...args} />
};

export const Disabled: Story = {
  args: {
    label: "Email",
    type: "email",
    disabled: true
  },
  render: (args) => <StatefulInput {...args} />
};
