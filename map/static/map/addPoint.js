var temporaryCoordinates = ''
var points = []
var selfLocalizationCoordinates

function pointConfirm(variable) {
    var point = document.createElement('p')
    if (variable === undefined) {
        var myDiv = document.getElementById('points')
        var deleteButton = document.createElement('button')
        deleteButton.onclick = function () {
            point.remove()
        }
        deleteButton.appendChild(document.createTextNode('x'))
        deleteButton.className = 'deleteButton'
        point.id = 'point' + points.length
        point.className = 'center'
        point.appendChild(deleteButton)
        point.appendChild(document.createTextNode(temporaryCoordinates))
        addMarker()
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

// function buttonCreate(){
//     var myDiv = document.getElementById('dodaj')
//     var pointConfirmButton = document.createElement("button")
//     pointConfirmButton.id = 'pointConfirm'
//     pointConfirmButton.appendChild(document.createTextNode('Potwierdź'))
//     myDiv.appendChild(pointConfirmButton)
//     alert(temporaryCoordinates)
// }


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation ?
            "Error: The Geolocation service failed." :
            "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}

function addMarker(map){
    new google.maps.Marker({
        position: temporaryCoordinates,
        map: map,
    });
}

function initMap() {
    const myLatlng = { lat: 52.229676, lng: 21.012229 };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: myLatlng,
    });

    //                                          INFO WINDOW
    //Create the initial InfoWindow.
    let infoWindow = new google.maps.InfoWindow({
        content: "Kliknij na mapie, by dodać punkt!",
        position: myLatlng,
    });
    infoWindow.open(map);

    // Configure the click listener.
    map.addListener("click", (mapsMouseEvent) => {
        // Close the current InfoWindow.
        infoWindow.close();
        // Create a new InfoWindow.
        infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,
        });

        temporaryCoordinates = [mapsMouseEvent.latLng.lat().toString(), mapsMouseEvent.latLng.lng().toString()]

        infoWindow.setContent(
            'Szerokość: ' + temporaryCoordinates[0] + '<br />' + 'Długość: ' + temporaryCoordinates[1] + '<br /><br />' + '<div class="center" id="dodaj"><button onclick="pointConfirm()">Potwierdź</button> </div>'
        );

        infoWindow.open(map);
    });

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
                    infoWindow.setPosition(pos);
                    infoWindow.setContent("Location found.");
                    infoWindow.open(map);
                    map.setCenter(pos);
                    pointConfirm(pos)
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