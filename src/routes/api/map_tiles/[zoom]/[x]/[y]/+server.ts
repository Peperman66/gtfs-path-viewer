import { error, type RequestHandler } from "@sveltejs/kit";
import { MAPYCZ_APIKEY } from "$env/static/private";

export const GET: RequestHandler = async ({request, params, setHeaders}) => {
	const zoom = params.zoom;
	const x = params.x;
	let y = params.y as string;
	const size = y?.endsWith("@2x") ? "256@2x" : "256";
	y = y.replace("@2x", "");

	const data = await fetch(`https://api.mapy.cz/v1/maptiles/basic/${size}/${zoom}/${x}/${y}`, {
		headers: [
			["X-Mapy-Api-Key", MAPYCZ_APIKEY],
			["lang", request.headers.get("lang") || ""]
		],
	});
	console.log(MAPYCZ_APIKEY);
	console.log(data);
	if (data.status === 200 && data.body !== null) {
		setHeaders({
			"Content-Type": data.headers.get("Content-Type") || ""
		})
		return new Response(data.body);
	} else {
		throw error(data.status);
	}
}