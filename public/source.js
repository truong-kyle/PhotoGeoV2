let view, apiKey;

  fetch('/api/keys/arcgis')
    .then(response => response.json())
    .then(data => {
        apiKey = data.arcgisApiKey;
        // Use your API key here
    })
    .catch(error => console.error('Error fetching API key:', error));

require(["esri/config", "esri/WebMap", "esri/views/MapView"], function (
  esriConfig,
  WebMap,
  MapView
) {

  esriConfig.apiKey = apiKey;

  var map = new WebMap({
    portalItem: {
      // id for webmap
      id: "b7f7248553d84c37b8c823eff8562407",
    },
  });

  view = new MapView({
    map: map,
    center: [-79.41866, 43.678352], // Longitude, latitude
    zoom: 5, // Zoom level
    container: "viewDiv",
  });
});

function updateMap(lat, lon) {
  view.goTo({
    center: [lon, lat],
    zoom: 13,
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
      document.getElementById("result").textContent = `Geotag data stored`;
      updateMap(data.latitude, data.longitude);
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("result").textContent = "No geotag data found";
    });
}
