import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from ".";
import { useArgs } from "@storybook/preview-api";
import { CheckboxProps } from "./props";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: {
    label: "Accept terms and conditions",
    checked: false
  }
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

const Render = (args: CheckboxProps) => {
  const [{ checked }, updateArgs] = useArgs();

  return (
    <Checkbox
      {...args}
      checked={checked}
      onChange={(value) => updateArgs({ checked: value })}
    />
  );
};

export const Default: Story = {
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
