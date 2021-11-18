/**
 * Map configuration information used to construct map and populate layers
 */

// initial conditions
export const config = {
    accessToken: "pk.eyJ1IjoicGFzaWgiLCJhIjoiY2pybzJqdTVjMHJzeDQ0bW80aGdzaXV3ayJ9.yxD8Nqu7FLnf8-lBo7F1zQ",
    minZoom: 2,
    padding: 0.1
}

// sources for the map layers
export const sources = {
    crashes: {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/Open-Data-Tallahassee/vision-zero/main/crash-data/clean/all-2018to2021.geojson',
        generateId: true
    },
}

// styles for the map layers
export const layers = [
    {
      id: "crashes-fill",
      source: 'crashes',
      type: 'circle',
      paint: {
        'circle-radius': 3.75,
        'circle-stroke-color': '#ccc',
        'circle-stroke-width': 1,
        'circle-color': [
            'match',
            ['get', 'first_harmful_event'],
            10.0, /* ped */
            '#0000CD', /* blue */
            11.0, /* bike */
            '#D2691E', /* orange */
            32.0, /* tree */
            '#3CB371', /* green */
            /* other */ '#FF0000'
        ]
      }
    },
	{
		id: "crashes-highlight",
		source: "crashes",
		type: "line",
		filter: ['in', 'report_number', ''],
		paint: {
			'line-color': '#000',
			'line-width': 3
		}
	}
]