let map;
let currentQuestion = 0;
let score = 0;
let rectangle = null;

// 5 locations total
const locations = [
    {
        name: "Student Recreation Center",
        bounds: {
            north: 34.240648,
            south: 34.239291,
            east: -118.524703,
            west: -118.525195
        }
    },

    {
        name: "Oviatt Library",
        bounds: {
            north: 34.2404,
            south: 34.2396,
            east: -118.5291,
            west: -118.5304
        }
    },

    {
        name: "Bookstore",
        bounds: {
            north: 34.2379,
            south: 34.2372,
            east: -118.5288,
            west: -118.5298
        }
    },

    {
        name: "Sierra Center",
        bounds: {
            north: 34.2387,
            south: 34.2380,
            east: -118.5312,
            west: -118.5322
        }
    },

    {
        name: "University Student Union",
        bounds: {
            north: 34.2402,
            south: 34.2392,
            east: -118.5262,
            west: -118.5276
        }
    }
];

async function init() {

    await google.maps.importLibrary("maps");

    const mapElement = document.querySelector("gmp-map");

    map = mapElement.innerMap;

    // Disable movement
    map.setOptions({
        disableDefaultUI: true,
        gestureHandling: "none",
        zoomControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        draggable: false,
        keyboardShortcuts: false
    });

    showQuestion();

    // Double click listener
    map.addListener("dblclick", (event) => {
        checkAnswer(event.latLng);
    });
}

function showQuestion() {

    if (currentQuestion >= locations.length) {

        alert(`Quiz Finished!\nYou got ${score} out of ${locations.length} correct.`);

        document.getElementById("question").innerHTML =
            "Quiz Complete!";

        return;
    }

    document.getElementById("question").innerHTML =
        `Double Click On: ${locations[currentQuestion].name}`;
}

function checkAnswer(clickedLatLng) {

    const location = locations[currentQuestion];

    const lat = clickedLatLng.lat();
    const lng = clickedLatLng.lng();

    const bounds = location.bounds;

    // Check if inside rectangle
    const correct =
        lat <= bounds.north &&
        lat >= bounds.south &&
        lng <= bounds.east &&
        lng >= bounds.west;

    if (rectangle) {
        rectangle.setMap(null);
    }

    // Draw rectangle
    rectangle = new google.maps.Rectangle({
        strokeColor: correct ? "#00AA00" : "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        fillColor: correct ? "#00FF00" : "#FF0000",
        fillOpacity: 0.35,
        map,
        bounds: bounds
    });

    if (correct) {
        alert("Correct!");
        score++;
    } else {
        alert("Wrong!");
    }

    document.getElementById("score").innerHTML =
        `Score: ${score}`;

    currentQuestion++;

    setTimeout(() => {
        showQuestion();
    }, 1000);
}

init();