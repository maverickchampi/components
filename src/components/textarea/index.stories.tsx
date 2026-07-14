import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Textarea } from ".";
import type { IProps } from "./props";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: {
    label: "Comments",
    maxCharacters: 500
  }
};

export default meta;
type Story = StoryObj<typeof Textarea>;

function StatefulTextarea(args: IProps) {
  const [value, setValue] = useState(args.value ?? "");

  return <Textarea {...args} value={value} onChange={setValue} />;
}

export const Default: Story = {
  render: (args) => <StatefulTextarea {...args} />
};

export const WithValue: Story = {
  args: {
    label: "Comments",
    value: "Maverick Champi"
  },
  render: (args) => <StatefulTextarea {...args} />
};

export const WithError: Story = {
  args: {
    label: "Comments",
    error: "This field is required"
  },
  render: (args) => <StatefulTextarea {...args} />
};

export const Disabled: Story = {
  args: {
    label: "Comments",
    disabled: true,
    value: "Disabled textarea"
  },
  render: (args) => <StatefulTextarea {...args} />
};
