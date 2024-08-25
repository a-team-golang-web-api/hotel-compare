import type { Meta, StoryObj } from "@storybook/react";

import Searchbar from "./index";

const meta: Meta<typeof Searchbar> = {
	title: "features/HotelList/HotelList",
	component: Searchbar,
};

export default meta;
type Story = StoryObj<typeof Searchbar>;

export const Default: Story = {};
