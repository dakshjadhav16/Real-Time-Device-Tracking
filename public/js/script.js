const socket = io();

// 1. Check if the browser supports Geo-location
if (navigator.geolocation) // navigator is an object present in the windows object
{
    navigator.geolocation.watchPosition((position) => {      // It watches the position of person and stores the latitudes and longi
        const { latitude, longitude } = position.coords;
        console.log("Sending location:", { latitude, longitude }); // Debugging
        socket.emit("send-location", { latitude, longitude }); //The postion coordinates are set to the backend
    },
        (error) => {
            console.error("Geolocation Error:", error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0, // It stores the cache data which means the location which was accessed recently in past and 
            // "0" means that the location fetched is in real time and if infinity then it always access the location previously stored 
        }
    );
}

const map = L.map("map").setView([0, 0], 15);  //The centre co-ordinates (0,0) and 10 % zoom
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "© OpenStreetMap contributors"
    }
).addTo(map);

const markers = {}

socket.on("receive-location", (data) => {
    console.log("Received location:", data);
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude]);
    if (markers[id]) {
        console.log(`Updating marker for user: ${id}`);
        markers[id].setLatLng([latitude, longitude]);
    } else {
        console.log(`Creating new marker for user: ${id}`);
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }

})


socket.on("user-disconnected", (id) => {
    console.log(`User disconnected: ${id}`);
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});

