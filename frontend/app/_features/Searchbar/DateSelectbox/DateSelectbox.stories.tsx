import type { Meta, StoryObj } from "@storybook/react";

import DateSelectbox from ".";

const meta: Meta<typeof DateSelectbox> = {
	title: "features/Searchbar/DateSelectbox",
	component: DateSelectbox,
};

export default meta;
type Story = StoryObj<typeof DateSelectbox>;

export const Default: Story = {
	args: {
		labelText: "チェックイン",
		value: null,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		onChange: (newValue: any) => console.log("Selected date:", newValue),
	},
};
