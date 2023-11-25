import { writable } from "svelte/store";
import { parse } from "papaparse";

type GTFSData = {
	shapes: Map<string, Shape>,
	trips: Map<string, Trip>
}

export const gtfs = writable<GTFSData>({shapes: new Map(), trips: new Map()});

export function handleFeed(rawFeed: RawFeed) {
	const parsedTrips = parse<{[column: string]: string}>(rawFeed.trips, {header: true});
	const parsedShapes = parse<{[column: string]: string}>(rawFeed.shapes, {header: true});

	const trips = new Map<string, Trip>();
	const shapes = new Map<string, Shape>();
	
	for (const line of parsedTrips.data) {
		const trip: Trip = {
			route_id: line["route_id"],
			service_id: line["service_id"],
			trip_id: line["trip_id"],
			shape_id: line["shape_id"],
			trip_headsign: line["trip_headsign"]
		}
		trips.set(trip.trip_id, trip);
	}

	for (const line of parsedShapes.data) {
		const shape_id = line["shape_id"];
		if (!shapes.has(shape_id)) {
			const shape: Shape = {
				shape_id: line["shape_id"],
				shape_pt: []
			}
			shapes.set(shape.shape_id, shape);
		}
		const point: ShapeCoord = {
			shape_pt_lat: parseInt(line["shape_pt_lat"]),
			shape_pt_lon: parseInt(line["shape_pt_lin"]),
			shape_pt_sequence: parseInt(line["shape_pt_sequence"])
		}
		shapes.get(shape_id)?.shape_pt.push(point);
	}

	for (const shape of shapes.values()) {
		shape.shape_pt.sort((a, b) => a.shape_pt_sequence - b.shape_pt_sequence);
	}

	gtfs.set({
		shapes: shapes,
		trips: trips
	})
}