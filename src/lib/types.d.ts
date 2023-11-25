type Shape = {
	shape_id: string,
	shape_pt: ShapeCoord[]
}

type ShapeCoord = {
	shape_pt_lat: number,
	shape_pt_lon: number,
	shape_pt_sequence: number
}

type Trip = {
	route_id: string,
	service_id: string,
	trip_id: string,
	trip_headsign: string,
	shape_id: string
}

type RawFeed = {
	trips: string,
	shapes: string
}