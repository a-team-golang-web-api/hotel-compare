import type { Meta, StoryObj } from "@storybook/react";
import Selectbox from ".";
import { middleClassOption } from "../../../_features/Searchbar/middleClassOption";

const meta: Meta<typeof Selectbox> = {
	title: "components/elements/Selectbox",
	component: Selectbox,
	argTypes: {
		labelText: {
			control: "text",
			description: "The label text displayed above the select box",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Selectbox>;

export const Default: Story = {
	args: {
		labelText: "目的地",
		options: middleClassOption,
	},
};
