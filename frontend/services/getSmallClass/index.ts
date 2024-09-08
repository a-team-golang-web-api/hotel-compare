import { path, handleFailed, handleSucceed } from "..";

export async function getSmallClass(middleClassName: string) {
	const url = path(`/api/destination/smallClass?middleClassName=${middleClassName}`);

	return fetch(url)
		.then(handleSucceed)
		.catch(handleFailed);
}
