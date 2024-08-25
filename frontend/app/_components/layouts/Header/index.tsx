"use client";

import Image from "next/image";

/**
 * ヘッダーコンポーネント
 */
const Header = () => {
	return (
		<div className="navbar bg-base-100 ">
			<div className="btn btn-ghost text-xl">
				<Image
					src="/recursion-logo-square.png"
					width={32}
					height={32}
					alt={""}
				/>
			</div>
		</div>
	);
};

export default Header;
