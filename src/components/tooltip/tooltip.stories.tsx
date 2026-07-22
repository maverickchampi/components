import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from ".";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  }
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Top: Story = {
  args: {
    placement: "top",
    children: "Hover me",
    content: "This is a tooltip on top"
  }
};

export const Bottom: Story = {
  args: {
    placement: "bottom",
    children: <input type="text" placeholder="Hover me" />,
    content: "This is a tooltip on bottom"
  }
};

export const Left: Story = {
  args: {
    placement: "left",
    children: <i className="mc-earth" style={{ fontSize: 24, color: "green" }} />,
    content: "This is a tooltip on left"
  }
};

export const Right: Story = {
  args: {
    placement: "right",
    children: <a href="#">Hover me</a>,
    content: "This is a tooltip on right"
  }
};
