import type { Meta, StoryObj } from "@storybook/react";
import { Button } from ".";

const meta: Meta<typeof Button> = {
	title: "components/elements/Button",
	component: Button,
	argTypes: {
		text: { control: "text" },
		fontSize: {
			control: "select",
			options: ["text-xs", "text-sm", "text-base", "text-lg", "text-xl"],
		},
		btnColor: {
			control: "select",
			options: [
				"btn-primary",
				"btn-secondary",
				"btn-accent",
				"btn-info",
				"btn-success",
				"btn-warning",
				"btn-error",
			],
		},
		btnSize: { control: "select", options: ["btn-sm", "btn-md", "btn-lg"] },
	},
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
	args: {
		text: "Default Button",
		fontSize: "text-base",
	},
};

export const Small: Story = {
	args: {
		text: "Small Button",
		fontSize: "text-sm",
		btnColor: "btn-secondary",
		btnSize: "btn-sm",
	},
};

export const Large: Story = {
	args: {
		text: "Large Button",
		fontSize: "text-lg",
		btnColor: "btn-accent",
		btnSize: "btn-lg",
	},
};

export const Success: Story = {
	args: {
		text: "Success Button",
		fontSize: "text-base",
		btnColor: "btn-success",
	},
};

export const Warning: Story = {
	args: {
		text: "Warning Button",
		fontSize: "text-base",
		btnColor: "btn-warning",
	},
};
