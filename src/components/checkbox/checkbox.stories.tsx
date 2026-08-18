import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from ".";
import { CheckboxProps } from "./props";
import { useEffect, useState } from "react";

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

const CheckboxWithState = (props: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(props.checked);

  useEffect(() => {
    setIsChecked(props.checked);
  }, [props.checked]);

  return (
    <Checkbox
      {...props}
      checked={isChecked}
      disabled={props.disabled}
      onChange={(event) => setIsChecked(event.target.checked)}
    />
  );
};

export const Default: Story = {
  render: (args) => <CheckboxWithState {...args} />
};

export const WithError: Story = {
  args: {
    error: "This field is required",
    checked: false
  },
  render: (args) => <CheckboxWithState {...args} />
};

export const Disabled: Story = {
  args: {
    disabled: true,
    checked: false
  },
  render: (args) => <CheckboxWithState {...args} />
};
