import type { Meta, StoryObj } from "@storybook/react";
import { Input } from ".";
import { useState, useEffect } from "react";
import type { InputProps } from "./props";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    label: "Email",
    type: "email",
    value: "maverick.champi@gmail.com"
  }
};

export default meta;

type Story = StoryObj<typeof Input>;

const InputWithState = (props: InputProps) => {
  const [currentValue, setCurrentValue] = useState(props.value ?? "");

  useEffect(() => {
    setCurrentValue(props.value ?? "");
  }, [props.value]);

  return (
    <Input
      {...props}
      value={currentValue}
      onChange={(event) => setCurrentValue(event.target.value)}
    />
  );
};

export const Default: Story = {
  render: (args) => <InputWithState {...args} />
};

export const WithValue: Story = {
  args: {
    label: "Full name",
    type: "text",
    value: "Maverick Champi"
  },
  render: (args) => <InputWithState {...args} />
};

export const WithError: Story = {
  args: {
    label: "Email",
    type: "email",
    error: "This field is required",
    value: ""
  },
  render: (args) => <InputWithState {...args} />
};

export const Disabled: Story = {
  args: {
    label: "Disabled Field",
    type: "text",
    disabled: true,
    value: "No me puedes editar"
  },
  render: (args) => <InputWithState {...args} />
};
