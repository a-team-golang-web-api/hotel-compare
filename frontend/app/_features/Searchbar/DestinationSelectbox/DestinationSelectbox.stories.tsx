import type { Meta, StoryObj } from "@storybook/react";

import DestinationSelectbox from ".";

const meta: Meta<typeof DestinationSelectbox> = {
	title: "features/Searchbar/DestinationSelectbox",
	component: DestinationSelectbox,
};

export default meta;
type Story = StoryObj<typeof DestinationSelectbox>;

export const Default: Story = {};
