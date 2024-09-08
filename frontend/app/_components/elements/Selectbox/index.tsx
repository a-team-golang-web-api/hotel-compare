import Select from "react-select";

const customStyles = {
	// セレクトボックス全体のスタイル
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	control: (provided: any, state: { isFocused: any }) => ({
		...provided,
		borderRadius: "8px",
		"&:hover": {
			borderColor: state.isFocused ? "#007bff" : "#aaa",
		},
	}),
	// メニュー（ドロップダウンリスト）のスタイル
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	menu: (provided: any) => ({
		...provided,
		backgroundColor: "white", // 背景を白に設定
	}),
	// 各オプションのスタイル
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	option: (provided: any, state: { isSelected: boolean }) => ({
		...provided,
		backgroundColor: state.isSelected ? "#007bff" : "white", // 選択中のオプションと非選択オプションの背景色を変更
		color: state.isSelected ? "white" : "black", // 選択されたときは白、されていないときは黒文字
		"&:hover": {
			backgroundColor: "#f0f0f0", // ホバー時の背景色
		},
	}),
};

interface SelectboxProps {
	labelText?: string;
	options: Array<{ value: string; label: string }>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	value: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	onChange: any;
}

/**
 * セレクトボックスコンポーネント
 * @param {string} props.labelText - セレクトボックス上に表示するラベルテキスト
 * @returns
 */
const Selectbox = ({ labelText, options, value, onChange }: SelectboxProps) => {
	return (
		<div>
			{labelText && (
				<label className="block text-sm font-medium text-gray-700 mb-1">
					{labelText}
				</label>
			)}
			<Select
				value={value}
				isClearable
				options={options}
				onChange={onChange}
				styles={customStyles}
			/>
		</div>
	);
};

export default Selectbox;
