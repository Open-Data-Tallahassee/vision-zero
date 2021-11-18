import React, { useEffect, useRef } from 'react'
import { siteMetadata } from '../../../gatsby-config'
import { sources, layers } from '../../../config/map'
import mapboxgl from '!mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import './map.css'

// store mapbox token
const mapboxToken = siteMetadata.mapboxToken

// map component
const Map = () => {

    // if there's no mapbox token, raise an error in the console
    if (!mapboxToken) {
        console.error(
            'ERROR: Mapbox token is required in gatsby-config.js siteMetadata'
        )
    }

    // this ref holds the map DOM node so that we can pass it into Mapbox GL
    const mapContainer = useRef(null)

    // this ref holds the map object once we have instantiated it, so that it
    // can be used in other hooks
    const mapRef = useRef(null)

    // initialize map when component mounts
    useEffect(() => {
        mapboxgl.accessToken = siteMetadata.mapboxToken

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: `mapbox://styles/mapbox/light-v10`,
            center: [-84.28054689999016, 30.444679757470055],
            minZoom: 12,
            interactive: true
        })

        mapRef.current = map
        window.map = map

        // when the map loads
        map.on('load', () => {

            // make the cursor a pointer
            map.getCanvas().style.cursor = 'default';

            // add every source to the map
            Object.entries(sources).forEach(([id, source]) => {
                map.addSource(id, source)
            })

            // add every layer to the map
            layers.forEach(layer => {
                map.addLayer(layer)
            })

        });

        // show pop-up when a crash is clicked
        map.on('click', 'crashes-fill', (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            
            new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML('Year:' + e.features[0].properties.crash_year + '<br>' +
                    'Crash Type:' + e.features[0].properties.first_harmful_event + '<br>' +
                    'Vehicles Involved:' + e.features[0].properties.total_number_of_vehicles + '<br>' +
                    'People Involved:' + e.features[0].properties.total_number_of_persons + '<br>')
            .addTo(map);
        });
          
        // change the cursor to a pointer when the mouse is over a crash
        map.on('mouseenter', 'crashes-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
        });
           
        // change cursor to pointer when it's not hovering over a crash
        map.on('mouseleave', 'crashes-fill', () => {
        map.getCanvas().style.cursor = '';
        });

    }, [])


    return (
        // container for the entire app
        <div className="wrapper">
            {/* map & navigation bar */}
            <div className="main">
                {/* map */}
                <div className="mapContainer">
                    <div className="map" ref={mapContainer} />
                </div>
            </div>
        </div>
    )

}



export default Map