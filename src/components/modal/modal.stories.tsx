import type { Meta, StoryObj } from "@storybook/react";
import { useState, useEffect } from "react";
import { Modal } from ".";
import type { ModalProps } from "./props";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  tags: ["autodocs"],
  args: {
    isOpen: false,
    title: "Modal Title",
    children: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    hasCloseButtonInDesktop: true,
    closeInClickOut: true
  }
};

export default meta;

type Story = StoryObj<typeof Modal>;

const ModalInteractiveWrapper = (args: ModalProps) => {
  const [localIsOpen, setLocalIsOpen] = useState(args.isOpen);

  useEffect(() => {
    setLocalIsOpen(args.isOpen);
  }, [args.isOpen]);

  return (
    <>
      <button 
        style={{ padding: "8px 16px", cursor: "pointer" }} 
        onClick={() => setLocalIsOpen(true)}
      >
        Open Modal
      </button>
      <Modal
        {...args}
        isOpen={localIsOpen}
        onClose={() => setLocalIsOpen(false)}
      />
    </>
  );
};

export const Default: Story = {
  render: (args) => <ModalInteractiveWrapper {...args} />
};

export const WithoutCloseButton: Story = {
  args: {
    hasCloseButtonInDesktop: false
  },
  render: (args) => <ModalInteractiveWrapper {...args} />
};

export const NoClickOutClose: Story = {
  args: {
    closeInClickOut: false
  },
  render: (args) => <ModalInteractiveWrapper {...args} />
};
