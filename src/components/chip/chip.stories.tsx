import type { Meta, StoryObj } from "@storybook/react";
import { Chip } from ".";

const meta: Meta<typeof Chip> = {
  title: "Components/Chip",
  component: Chip,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "outline"]
    }
  }
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Chip"
  }
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Chip"
  }
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    children: "Disabled Chip",
    disabled: true
  }
};

export const Clickable: Story = {
  args: {
    variant: "primary",
    children: "Clickable Chip",
    readonly: false,
    onClick: () => alert("Chip clicked!")
  }
};
