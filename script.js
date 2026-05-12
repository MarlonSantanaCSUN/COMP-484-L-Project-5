let map;
let currentQuestion = 0;
let score = 0;
let rectangles = [];
let startTime;
let timerInterval;

// 5 locations total
const locations = [
    {
        name: "Student Recreation Center—G4",
        bounds: {
            north: 34.240648,
            south: 34.239291,
            east: -118.524703,
            west: -118.525195
        }
    },

    {
        name: "	Arbor Grill—D5",
        bounds: {
            north: 34.241319,
            south: 34.241036,
            east: -118.529556,
            west: -118.529787
        }
    },

    {
        name: "	Bookstein Hall—C5",
        bounds: {
            north: 34.242473,
            south: 34.241417,
            east: -118.530038,
            west: -118.531102
        }
    },

    {
        name: "Sierra Tower—C3",
        bounds: {
            north: 34.239142,
            south: 34.238435,
            east: -118.530110,
            west: -118.530258
        }
    },

    {
        name: "University Student Union",
        bounds: {
            north: 34.240293,
            south: 34.239791,
            east: -118.526748,
            west: -118.527267
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
        keyboardShortcuts: false,

        styles: [ // Hide labels, points of interest, and other distractions
            {
                featureType: "all",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            },
            {
                featureType: "poi",
                elementType: "all",
                stylers: [{ visibility: "off" }]
            },
        ]

    });

    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);

    showQuestion();

    // Double click listener
    map.addListener("dblclick", (event) => {
        checkAnswer(event.latLng);
    });
}

function showQuestion() { // Show current question

    if (currentQuestion >= locations.length) {

        clearInterval(timerInterval);
        const finalTime =
        Math.floor((Date.now() - startTime) / 1000);

        alert(`Quiz Finished!\n` + `You got ${score} out of ${locations.length} correct.\n` + `Time: ${finalTime} seconds`);

        document.getElementById("question").innerHTML =
            "Quiz Complete!";

        return;
    }

    document.getElementById("question").innerHTML =
        `Double Click On: ${locations[currentQuestion].name}`;
}

function checkAnswer(clickedLatLng) { // Check if clicked location is correct

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

    // Draw rectangle
    const rectangle = new google.maps.Rectangle({
        strokeColor: correct ? "#00AA00" : "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        fillColor: correct ? "#00FF00" : "#FF0000",
        fillOpacity: 0.35,
        map,
        bounds: bounds
    });
    
    // Store rectangle to remove later
    rectangles.push(rectangle);

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

function updateTimer() {

    const currentTime = Date.now();

    const elapsedSeconds =
        Math.floor((currentTime - startTime) / 1000);

    const minutes =
        Math.floor(elapsedSeconds / 60);

    const seconds =
        elapsedSeconds % 60;

    document.getElementById("timer").innerHTML =
        `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}