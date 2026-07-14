import type { Meta, StoryObj } from "@storybook/react";
import { Button } from ".";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "outline"]
    },
    onClick: { action: "clicked" }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button"
  }
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Button"
  }
};

export const Loading: Story = {
  args: {
    variant: "primary",
    children: "Loading Button",
    loading: true
  }
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    children: "Disabled Button",
    disabled: true
  }
};
