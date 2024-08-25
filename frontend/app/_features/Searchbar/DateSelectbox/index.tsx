import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

interface DateSelectboxProps {
	labelText: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	value: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	onChange: (newValue: any) => void;
}

/**
 * 日付を選択できるコンポーネント
 *
 * @param {string} props.labelText - 日付選択ボックスのラベルテキスト
 * @param {any} props.value - 選択された日付の値
 * @param {function} props.onChange - 日付が変更されたときに呼び出されるコールバック関数
 */
const DateSelectbox = ({ labelText }: DateSelectboxProps) => {
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DatePicker label={labelText} format="YYYY/MM/DD" />
		</LocalizationProvider>
	);
};

export default DateSelectbox;
