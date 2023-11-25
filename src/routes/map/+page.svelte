<script lang="ts">
	import { gtfs } from "$lib/gtfsstore";
	import { page } from "$app/stores";
	import * as L from "leaflet";
	let map: L.Map;

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
</script>

<div class="flex flex-col h-screen">
	<p>Shape count: {$gtfs.shapes.size}</p>
	<p>Trip count: {$gtfs.trips.size}</p>

	<div class="w-full flex-grow" use:mapAction/>
</div>
<style>
	@import 'leaflet/dist/leaflet.css';
</style>