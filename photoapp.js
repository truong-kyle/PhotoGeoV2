const express = require('express');
const dotenv = require('dotenv');
const exif = require('exif').ExifImage;
const multer = require('multer');
const fetch  = require('node-fetch');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public'));

app.get('/apis/arcgis', (req, res) => {
    res.send ({arcgisApiKey: process.env.ARCGIS
    });
});

app.get('/apis/firms', (req, res) => {
    res.send ({firmsApiKey: process.env.NASA_FIRMS})
});

app.get('/mapmode'), (req, res) => {
    firemode = true;
    console.log("firemode");
    res.send("Hello")
}

async function getFire(x, y){
    try {
      const response = await fetch(process.env.NASA_FIRMS);
      const csvData = await response.text();
      
      const rows = csvData.split("\n");
      const headers = rows[0].split(",");
      const data = rows.slice(1).map(row => {
        const values = row.split(",");
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index];
          return obj;
        }, {});
      });
  
      for (let item of data) {
        const dataLat = parseFloat(item.latitude);
        const dataLon = parseFloat(item.longitude);
        if (Math.abs(dataLat - x) < 0.2 && Math.abs(dataLon - y) < 0.2) {
          return { dataLat, dataLon };
        }
      }
      return null;
  
    } catch (error) {
      console.error("Error fetching or processing data:", error);
      return null;
    }
  }
  
  app.post('/upload', upload.single('photo'), async (req, res) => {
      try {
          new exif({ image: req.file.buffer }, async (error, exifData) => {
              if (error) {
                  return res.send('Error: ' + error.message);
              }
              
              const gps = exifData.gps;
              if (gps.GPSLatitude && gps.GPSLongitude) {
                  let lat = gps.GPSLatitude[0] + gps.GPSLatitude[1]/60 + gps.GPSLatitude[2]/3600;
                  let lon = gps.GPSLongitude[0] + gps.GPSLongitude[1]/60 + gps.GPSLongitude[2]/3600;
                  if (gps.GPSLatitudeRef == "S") lat = -lat;
                  if (gps.GPSLongitudeRef == "W") lon = -lon;
                  
                  const fireData = await getFire(lat, lon);
                  if (fireData) {
                      res.json(fireData);
                  } else {
                      res.send('No fire data found near the location.');
                  }
              } else {
                  res.send('No geotag data found.');
              }
          });
      } catch (e) {
          res.send('Error processing image.');
      }
  });
  
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
