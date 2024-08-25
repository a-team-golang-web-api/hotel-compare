import Select from "react-select";

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

interface SelectboxProps {
	labelText?: string;
	options: Array<{ value: string; label: string }>;
}

/**
 * セレクトボックスコンポーネント
 * @param {string} props.labelText - セレクトボックス上に表示するラベルテキスト
 * @returns
 */
const Selectbox = ({ labelText, options }: SelectboxProps) => {
	return (
		<div>
			{labelText && (
				<label className="block text-sm font-medium text-gray-700 mb-1">
					{labelText}
				</label>
			)}
			<Select
				defaultValue={options[0]}
				isClearable
				options={options}
				styles={customStyles}
			/>
		</div>
	);
};

export default Selectbox;
