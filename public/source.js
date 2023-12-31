let view, firemap, map, firemode;
firemode = document.getElementById("flame");

window.onload = fetch("/apis/arcgis")
  .then((response) => response.json())
  .then((data) =>initMap(data.arcgisApiKey))
  .catch((error) => console.error("Error fetching API key:", error));

document
  .getElementById("imageInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const imagePreview = document.getElementById("imagePreview");
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
      };

      reader.readAsDataURL(file);
    }
  });

function initMap(api) {
  require([
    "esri/config",
    "esri/WebMap",
    "esri/Map",
    "esri/views/MapView",
  ], function (esriConfig, WebMap, Map, MapView) {
    esriConfig.apiKey = api;

    firemap = new WebMap({
      portalItem: {
        // id for webmap
        id: "b7f7248553d84c37b8c823eff8562407",
      },
    });

    blankmap = new Map({
      basemap: "arcgis/topographic",
    });

    view = new MapView({
      map: firemap,
      center: [-79.41866, 43.678352], // Longitude, latitude
      zoom: 5, // Zoom level
      container: "mapDiv",
    });
  });
}

function toggleFire() {
  if (firemode.style.display == "none") {
    firemode.style.display = "inline-block";
    view.map = firemap; 
    document.getElementById("clickme").style.color = "orange";
    document.getElementById("clickme").title = "Click to switch to Normal Mode";
    document.getElementById("uploadButton").textContent = "Search for Hotspots";
    document.getElementById("clickme").textContent = "Wildfire Mode";
  } else {
    firemode.style.display = "none";
    view.map = blankmap;
    document.getElementById("uploadButton").textContent = "Upload to Photo Map";
    document.getElementById("clickme").textContent = "Normal Mode";
    document.getElementById("clickme").style.color = "lightblue";
    document.getElementById("clickme").title =
      "Click to switch to Wildfire Mode";
  }
}

function updateMap(lat, lon) {
  view.goTo({
    center: [lon, lat],
    zoom: 15,
  });
}

function uploadImage() {
  const formData = new FormData();
  const imageInput = document.getElementById("imageInput");
  formData.append("photo", imageInput.files[0]);
  fetch("/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("result").textContent = data.message;
      if (firemode.style.display == "inline-block") {
        checkFires();
      } else {
        fetch("/getloc")
          .then((response) => response.json())
          .then((data) => {
            updateMap(data.lat, data.lon);
            document.getElementById(
              "fireResult"
            ).textContent = `Photo taken at ${data.lat.toFixed(5)}, ${data.lon.toFixed(5)}`;
          });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("result").textContent = "No geotag data found";
      document.getElementById("fireResult").textContent = "";
    });
}

function checkFires() {
  fetch("/checkfire")
    .then((response) => response.json())
    .then((data) => {
      if (data.dataLat && data.dataLon) {
        updateMap(data.dataLat, data.dataLon);
        document.getElementById(
          "fireResult"
        ).textContent = `Fire detected near hotspot ${data.dataLat}, ${data.dataLon}`;
      } else {
        document.getElementById("fireResult").textContent = data.message;
      }
    });
}

function helpOff() {
  document.getElementById("help").style.display = "none";
}

function helpOn() {
  document.getElementById("help").style.display = "block";
}

function openMenu() {
  if (document.getElementById("menuList").style.visibility == "visible") {
    document.getElementById("menuList").style.visibility = "hidden";
    document.getElementById("menuList").style.opacity = 0;
    document.getElementById("menuIcon").style.opacity = 1;
  } else {
    document.getElementById("menuList").style.visibility = "visible";
    document.getElementById("menuIcon").style.opacity = 0.7;
    document.getElementById("menuList").style.opacity = 1;
  }
}
