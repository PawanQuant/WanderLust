const el = document.createElement("div");

el.className = "custom-home-marker";



mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-streets-v12', // Use the standard style for the map
    projection: 'globe', // display the map as a globe
    zoom: 12, // initial zoom level, 0 is the world view, higher values zoom in
    center: listing.geometry.coordinates // center the map on this longitude and latitude
});


const marker = new mapboxgl.Marker(el)
.setLngLat(listing.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({ offset : 25}).setHTML(
        `<h4>${listing.location}</h4><p>Exact location will be provided after booking</p>`
    )
)
.addTo(map)