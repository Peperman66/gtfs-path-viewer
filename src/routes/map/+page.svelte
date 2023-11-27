<script lang="ts">
	import { gtfs } from "$lib/gtfsstore";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import * as L from "leaflet";

	let map: L.Map;
	let shapeSelect: HTMLSelectElement;
	let tripSelect: HTMLSelectElement;
	let currentPolyline: L.Polyline | null;

	function createMap(container: HTMLElement) {
		const m = L.map(container).setView([49.5933795, 17.2550610], 13);
		L.tileLayer(`${$page.url.origin}/api/map_tiles/{z}/{x}/{y}{r}`, {
			minZoom: 0,
			maxZoom: 19,
			attribution: '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
		}).addTo(m);

		const LogoControl = L.Control.extend({
			options: {
				position: 'bottomleft',
			},

			onAdd: function () {
				const container = L.DomUtil.create('div');
				const link = L.DomUtil.create('a', '', container);

				link.setAttribute('href', 'http://mapy.cz/');
				link.setAttribute('target', '_blank');
				link.innerHTML = '<img src="https://api.mapy.cz/img/api/logo.svg" />';
				L.DomEvent.disableClickPropagation(link);

				return container;
			},
		})

		new LogoControl().addTo(m);

		return m;
	}

	function mapAction(container: HTMLElement) {
		map = createMap(container);
		return {
			destroy: () => {
				map.remove();
			}
		}
	}

	// Gtfs shouldn't change, so we probably don't need this to be reactive
	if ($gtfs.shapes.size === 0) {
		goto("/")
	}

	function changeShape() {
		const shapeId = shapeSelect.value;
		const shape = $gtfs.shapes.get(shapeId) as Shape;
		tripSelect.value = "";
		renderShape(shape);
	}

	function changeTrip() {
		const tripId = tripSelect.value;
		const trip = $gtfs.trips.get(tripId) as Trip;
		const shapeId = trip.shape_id;
		const shape = $gtfs.shapes.get(shapeId) as Shape;

		shapeSelect.value = shapeId;
		renderShape(shape);
	}

	function renderShape(shape: Shape) {
		if (currentPolyline) {
			currentPolyline.remove();
		}
		const newPolyline = L.polyline(shape.shape_pt.map(x => [x.shape_pt_lat, x.shape_pt_lon]), {color: 'red'});
		currentPolyline = newPolyline;
		newPolyline.addTo(map);
		map.fitBounds(newPolyline.getBounds());
	}
</script>

<div class="flex flex-col h-screen">
	<p>Shape count: {$gtfs.shapes.size}</p>
	<p>Trip count: {$gtfs.trips.size}</p>
	<div>
		Select shape: 
		<select on:change={changeShape} bind:this={shapeSelect}>
			<option value=""></option>
			{#each [...$gtfs.shapes.keys()].sort() as shape}
				<option value={shape}>{shape}</option>
			{/each}
		</select>
	</div>
	<div>
		Or select trip:
		<select on:change={changeTrip} bind:this={tripSelect}>
			<option value=""></option>
			{#each [...$gtfs.trips.keys()].sort() as trip}
				<option value={trip}>{trip}</option>
			{/each}
		</select>
	</div>

	<div class="w-full flex-grow" use:mapAction/>
</div>
<style>
	@import 'leaflet/dist/leaflet.css';
</style>