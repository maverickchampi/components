import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "@storybook/preview-api";
import { Textarea } from ".";
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

const Render = (args: TextareaProps) => {
  const [{ value }, updateArgs] = useArgs();

  return (
    <Textarea
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
    disabled: true,
    value: "Disabled textarea"
  },
  render: Render
};
