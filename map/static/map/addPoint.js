var temporaryCoordinates = null
var points = []
const myLatlng = { lat: 52.229676, lng: 21.012229 };
var globmap = null
var currentWindow = null


function pointConfirm(variable) {
    var point = document.createElement('p')
    if (variable === undefined) {
        var myDiv = document.getElementById('points')
        var deleteButton = document.createElement('button')
        var marker = addMarker()
        deleteButton.onclick = function () {
            point.remove()
            marker.setMap(null)
            marker.setPosition(null)
        }
        deleteButton.appendChild(document.createTextNode('x'))
        deleteButton.className = 'deleteButton'
        point.id = 'point' + points.length
        point.className = 'center'
        point.appendChild(deleteButton)
        point.appendChild(document.createTextNode(temporaryCoordinates.lat().toString() + temporaryCoordinates.lng().toString()))
    }
    else{
        var myDiv = document.getElementById('selfLocalization')
        document.getElementById('selfLocalizationCoordinates').remove()
        myDiv.style.backgroundColor = 'rgba(112, 198, 6, 0.1)'
        myDiv.style.borderColor = 'rgba(112, 198, 6, 1)'
        point.id = 'selfLocalizationCoordinates'
        point.appendChild(document.createTextNode(variable.lat+' '+variable.lng))
    }
    point.className = 'center'
    myDiv.appendChild(point)
}



function addMarker(){
    const svgMarker = {
        path:
            "M 14 11 l 2 -4 l -8 0 l 4 8 z M 12 2.016 q 2.906 0 4.945 2.039 t 2.039 4.945 q 0 1.453 -0.727 3.328 t -1.758 3.516 t -2.039 3.07 t -1.711 2.273 l -0.75 0.797 q -0.281 -0.328 -0.75 -0.867 t -1.688 -2.156 t -2.133 -3.141 t -1.664 -3.445 t -0.75 -3.375 q 0 -2.906 2.039 -4.945 t 4.945 -2.039 z",
        fillColor: "blue",
        fillOpacity: 0.6,
        strokeWeight: 0,
        rotation: 0,
        scale: 2,
        anchor: new google.maps.Point(15, 30),
    };
    let newMarker = new google.maps.Marker({
        position: temporaryCoordinates,
        map: globmap,
        icon: svgMarker,
    });
    currentWindow.close();
    return newMarker
}



function infoWindowMechanism(map){
    //                                          INFO WINDOW
    //Create the initial InfoWindow.
    let infoWindow = new google.maps.InfoWindow({
        content: "Kliknij na mapie, by dodać punkt!",
        position: myLatlng,
    });
    infoWindow.open(map);
    //Configure the click listener.
    map.addListener("click", (mapsMouseEvent) => {
        // Close the current InfoWindow.
        infoWindow.close();
        // Create a new InfoWindow.
        infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,
        });
        //temporaryCoordinates = [mapsMouseEvent.latLng.lat().toString(), mapsMouseEvent.latLng.lng().toString()]
        temporaryCoordinates = infoWindow.position
        infoWindow.setContent(
            'Szerokość: ' + temporaryCoordinates.lat().toString() + '<br />' + 'Długość: ' + temporaryCoordinates.lng().toString() + '<br /><br />' + '<div class="center" id="dodaj"><button onclick="pointConfirm()">Potwierdź</button> </div>'
        );
        infoWindow.open(map);
        currentWindow = infoWindow
    });
}



function selfLocalize(map){
    let infoWindow = new google.maps.Marker()
    //                                 SELFLOCALIZE
    const locationButton = document.createElement("button");
    locationButton.textContent = "Zlokalizuj";
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    const svgMarker = {
                        path:
                            "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                        fillColor: "green",
                        fillOpacity: 0.6,
                        strokeWeight: 0,
                        rotation: 0,
                        scale: 2,
                        anchor: new google.maps.Point(15, 30),
                    };
                    infoWindow.setIcon(svgMarker)
                    infoWindow.setPosition(pos);
                    //infoWindow.setContent("Location found.");
                    infoWindow.setMap(map)
                    //infoWindow.open(map);
                    map.setCenter(pos);
                    pointConfirm(pos, map)
                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter());
                }
            );
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation ?
            "Error: The Geolocation service failed." :
            "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}



function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: myLatlng,
    });
    globmap = map

    infoWindowMechanism(map)
    selfLocalize(map)
}

