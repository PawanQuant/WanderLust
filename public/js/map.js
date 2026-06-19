mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/standard', // Use the standard style for the map
    projection: 'globe', // display the map as a globe
    zoom: 10, // initial zoom level, 0 is the world view, higher values zoom in
    center: [78.0167 , 27.1833] // center the map on this longitude and latitude
});