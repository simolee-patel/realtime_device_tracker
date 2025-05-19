let socket = io();
if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position)=>{
       const {latitude, longitude}= position.coords;
       socket.emit("send-location",{latitude, longitude})
    }, (error)=>{
        console.error(error)
    },
    {
        enableHighAccuracy:true,
        timeout:2000,
        maximumAge:0
    },
);
}


const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let markers={};

socket.on("receive-location", (data)=>{
    const{id, latitude, longitude}= data;
    map.setView([latitude, longitude]);
    if(markers[id]){
        markers[id].setLetLng([latitude, longitude])
    }else{
        markers[id]= L.marker([latitude, longitude]).addTo(map)
    }
})

socket.on("user-disconnected", (id)=>{
    if(map.markers[id]){
        map.removeLayer(markers[id])
        delete(markers[id])
    }
})