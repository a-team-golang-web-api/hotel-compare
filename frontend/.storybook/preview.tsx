import type { Preview } from "@storybook/react";
import "../app/globals.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";

const preview: Preview = {
	decorators: [
		(Story) => (
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<Story />
			</LocalizationProvider>
		),
	],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
};

export default preview;
