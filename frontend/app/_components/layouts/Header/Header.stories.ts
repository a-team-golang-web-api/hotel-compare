import type { Meta, StoryObj } from "@storybook/react";

import Header from ".";

const meta: Meta<typeof Header> = {
	title: "components/layouts/Header",
	component: Header,
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {};
