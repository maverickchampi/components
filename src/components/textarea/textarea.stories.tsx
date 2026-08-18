import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from ".";
import { useState, useEffect } from "react";
import type { TextareaProps } from "./props";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: {
    label: "Comments",
    maxCharacters: 500,
    value: ""
  }
};

export default meta;

type Story = StoryObj<typeof Textarea>;

const TextareaWithState = (props: TextareaProps) => {
  const [currentValue, setCurrentValue] = useState(props.value ?? "");

  useEffect(() => {
    setCurrentValue(props.value ?? "");
  }, [props.value]);

  return (
    <Textarea
      {...props}
      value={currentValue}
      onChange={(event) => setCurrentValue(event.target.value)}
    />
  );
};

export const Default: Story = {
  render: (args) => <TextareaWithState {...args} />
};

export const WithValue: Story = {
  args: {
    value: "Maverick Champi"
  },
  render: (args) => <TextareaWithState {...args} />
};

export const WithError: Story = {
  args: {
    error: "This field is required",
    value: ""
  },
  render: (args) => <TextareaWithState {...args} />
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Disabled textarea"
  },
  render: (args) => <TextareaWithState {...args} />
};
