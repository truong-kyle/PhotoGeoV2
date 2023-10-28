let view, firemap, map, firemode;

  window.onload = fetch('/apis/arcgis')
    .then(response => response.json())
    .then(data => {
        initMap(data.arcgisApiKey);
    })
    .catch(error => console.error('Error fetching API key:', error));

    firemode = document.getElementById("flame");
    firemode.style.display = "none";
    uploadButton = document.getElementById("uploadButton")

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

function initMap(api){
  require(["esri/config", "esri/WebMap", "esri/Map", "esri/views/MapView"], function (
    esriConfig,
    WebMap,
    Map,
    MapView
  ) {
  
    esriConfig.apiKey = api;
  
    firemap = new WebMap({
      portalItem: {
        // id for webmap
        id: "b7f7248553d84c37b8c823eff8562407",
      },
    });

    blankmap = new Map({
      basemap: "arcgis/topographic"
    })
  
    view = new MapView({
      map: blankmap,
      center: [-79.41866, 43.678352], // Longitude, latitude
      zoom: 5, // Zoom level
      container: "viewDiv",
    });
  });
}

function toggleFire(){
  if (firemode.style.display == "none"){
    firemode.style.display = "block";
    view.map = firemap;
    uploadButton.textContent="Search for Hotspots"
  }
  else{
    firemode.style.display = "none";
    view.map = blankmap;
    uploadButton.textContent="Upload to Photo Map"
  }
}

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
      updateMap(data.dataLat, data.dataLon);
      if(data.dataLat && data.dataLon){
        document.getElementById("fireResult").textContent = `Fire detected near hotspot ${data.dataLat}, ${data.dataLon}`
      }
      else{
        document.getElementById("fireResult").textContent = data.message;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("result").textContent = "No geotag data found";
    });
}
