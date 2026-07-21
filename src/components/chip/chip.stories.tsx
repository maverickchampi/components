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
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"]
    }
  }
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Chip (Readonly)",
    size: "medium"
  }
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Chip (Readonly)",
    size: "medium"
  }
};

export const Clickable: Story = {
  args: {
    variant: "primary",
    children: "Clickable Chip",
    readonly: false,
    onClick: () => alert("Chip clicked!"),
    size: "medium"
  }
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    children: "Disabled Chip",
    readonly: false,
    disabled: true,
    size: "medium"
  }
};

export const AsLink: Story = {
  args: {
    variant: "outline",
    children: "Chip Link (Open Portfolio)",
    readonly: false,
    href: "https://maverickchampi.vercel.app",
    target: "_blank",
    size: "medium"
  }
};
