import Select from "react-select";
import { destinationOption } from "./destinationOption";

const customStyles = {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	control: (provided: any, state: { isFocused: any }) => ({
		...provided,
		borderRadius: "8px",
		"&:hover": {
			borderColor: state.isFocused ? "#007bff" : "#aaa",
		},
	}),
};

const DestinationSelectbox = () => {
	return (
		<Select
			defaultValue={destinationOption[0]}
			isClearable
			options={destinationOption}
			styles={customStyles}
		/>
	);
};

export default DestinationSelectbox;
