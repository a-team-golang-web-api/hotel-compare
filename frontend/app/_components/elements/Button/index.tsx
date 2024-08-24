interface ButtonProps {
	text: string;
	fontSize?: "text-xs" | "text-sm" | "text-base" | "text-lg" | "text-xl";
	btnSize?: "btn-lg" | "btn-sm" | "btn-xs";
	btnColor?:
		| "btn-neutral"
		| "btn-primary"
		| "btn-secondary"
		| "btn-accent"
		| "btn-info"
		| "btn-success"
		| "btn-warning"
		| "btn-error";
}

/**
 * ボタンコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {string} props.text - ボタンに表示するテキスト
 * @param {'text-xs' | 'text-sm' | 'text-base' | 'text-lg' | 'text-xl'} [props.fontSize] - ボタンのフォントサイズ（オプション）
 * @param {'btn-primary' | 'btn-secondary' | 'btn-accent' | 'btn-info' | 'btn-success' | 'btn-warning' | 'btn-error'} [props.btnColor] - ボタンの色クラス（オプション）
 * @param {'btn-sm' | 'btn-md' | 'btn-lg'} [props.btnSize] - ボタンのサイズクラス（オプション）
 */
const Button = ({ text, fontSize, btnColor, btnSize }: ButtonProps) => {
	return (
		<button type="button" className={`btn ${fontSize} ${btnSize} ${btnColor}`}>
			{text}
		</button>
	);
};

export { Button };
