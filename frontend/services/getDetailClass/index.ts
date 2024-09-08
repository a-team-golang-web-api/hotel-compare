import { path, handleFailed, handleSucceed } from "..";

export async function getDetailClass(smallClassName: string) {
	const url = path(
		`/api/destination/detailClass?smallClassName=${smallClassName}`,
	);

	return fetch(url).then(handleSucceed).catch(handleFailed);
}
