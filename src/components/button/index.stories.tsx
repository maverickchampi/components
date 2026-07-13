import type { Meta, StoryObj } from "@storybook/react";
import { Button } from ".";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline"]
    }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Botón primario"
  }
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Botón secundario"
  }
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Botón outline"
  }
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    children: "Deshabilitado",
    disabled: true
  }
};
