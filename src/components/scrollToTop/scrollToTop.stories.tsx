import { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ScrollToTop } from ".";
import type { ScrollToTopProps } from "./props";

const meta: Meta<typeof ScrollToTop> = {
  title: "Components/ScrollToTop",
  component: ScrollToTop,
  tags: ["autodocs"],
  args: {
    ariaLabel: "Scroll to top",
    minimumScrollY: 300
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Displays a button that scrolls its scrollable container back to the top.

By default, it listens to the window scroll. When the \`container\` prop is provided, it only affects that specific scrollable element.

The button is shown only when the user has scrolled beyond \`minimumScrollY\` and is scrolling upward. It stays hidden while scrolling downward.
        `
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ScrollToTop>;

const filler = Array.from({ length: 100 }).map((_, index) => (
  <p key={index} style={{ marginBottom: "1rem" }}>
    Line {index + 1} — Sample content to force scrolling.
  </p>
));

const RenderContainer = (args: ScrollToTopProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      style={{
        width: "100%",
        margin: "auto"
      }}
    >
      <div
        ref={containerRef}
        style={{
          height: 400,
          overflowY: "auto",
          border: "1px solid var(--mc-color-border)",
          borderRadius: 8
        }}
      >
        <div style={{ padding: "1rem" }}>
          {filler}
        </div>

        <ScrollToTop
          {...args}
          container={containerRef}
        />
      </div>
    </div>
  );
};

export const Default: Story = {
  render: RenderContainer
};

export const Disabled: Story = {
  args: {
    disabled: true
  },
  render: RenderContainer
};

export const CustomCallback: Story = {
  args: {
    callback: () => alert("Scrolled to top!")
  },
  render: RenderContainer
};
