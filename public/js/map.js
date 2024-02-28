// This line is not needed as mapToken is already defined in show.ejs
// const mapToken = "<%= process.env.MAP_TOKEN %>";

document.addEventListener('DOMContentLoaded', function () {
    // Log the Mapbox access token and listing data for debugging
    console.log("Map Token:", mapToken);
    console.log("Listing:", listing);

    // Check if the listing has coordinates
    if (listing.geometry && listing.geometry.coordinates && listing.geometry.coordinates.length === 2) {
        mapboxgl.accessToken = mapToken;

        // Initialize the map
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v12', // map style
            center: listing.geometry.coordinates, // set map center to listing coordinates
            zoom: 11 // adjust the zoom level as needed
        });

        // Add a marker to the map
        new mapboxgl.Marker({ color: "red" })
            .setLngLat(listing.geometry.coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h4>${listing.title}</h4><p>Exact Location provided after booking</p>`))
            .addTo(map);
    } else {
        console.error('Invalid coordinates:', listing.geometry.coordinates);
    }
});







