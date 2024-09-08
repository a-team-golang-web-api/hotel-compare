import { path, handleFailed, handleSucceed } from "..";

export async function getDetailClass(smallClassName: string) {
	console.log(path(`/api/destination/detailClass/${smallClassName}`));
	return fetch(path(`/api/destination/detailClass/${smallClassName}`))
		.then(handleSucceed)
		.catch(handleFailed);
}
