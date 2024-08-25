import type { Meta, StoryObj } from "@storybook/react";
import DestinationSelectbox from ".";

const meta: Meta<typeof DestinationSelectbox> = {
	title: "features/Searchbar/DestinationSelectbox",
	component: DestinationSelectbox,
	argTypes: {
		labelText: {
			control: "text",
			description: "The label text displayed above the select box",
		},
	},
};

export default meta;
type Story = StoryObj<typeof DestinationSelectbox>;

export const Default: Story = {
	args: {
		labelText: "目的地",
	},
};
