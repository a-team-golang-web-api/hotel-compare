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

interface DestinationSelectboxProps {
	labelText: string;
}

const DestinationSelectbox = ({ labelText }: DestinationSelectboxProps) => {
	return (
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-1">
				{labelText}
			</label>
			<Select
				defaultValue={destinationOption[0]}
				isClearable
				options={destinationOption}
				styles={customStyles}
			/>
		</div>
	);
};

export default DestinationSelectbox;
