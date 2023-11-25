<script lang="ts">
	import { gtfs, handleFeed } from "$lib/gtfsstore";
	import JSZip from "jszip";
	import {goto} from "$app/navigation";
	
	const zip = new JSZip();
	
	let fileList: FileList;
	
	async function parseFile() {
		const data = await zip.loadAsync(fileList.item(0) as File)

		const rawFeed: RawFeed = {
			trips: await data.file("trips.txt")?.async("string") || "",
			shapes: await data.file("shapes.txt")?.async("string") || ""
		}
		handleFeed(rawFeed)
	}

	$: if (fileList && fileList.length > 0) {
		parseFile().then(() => {
			setTimeout(() => goto('/map'), 2000)
		})
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<p>Choose a valid GTFS file:</p>
<input type="file" accept=".zip" bind:files={fileList} disabled={fileList && fileList.length > 0}/>

{#if $gtfs.shapes.size > 0}
	<p>Shape count: {$gtfs.shapes.size}</p>
	<p>Trip count: {$gtfs.trips.size}</p>
{/if}