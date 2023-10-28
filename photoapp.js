const express = require('express');
const dotenv = require('dotenv');
const exif = require('exif').ExifImage;
const multer = require('multer')


dotenv.config();

const app = express();
const PORT = 3000;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let firemode;

app.use(express.static('public'));

app.get('/api/keys/arcgis', (req, res) => {
    res.send ({arcgisApiKey: process.env.ARCGIS
    });
});

app.get('/mode/fire'), (req, res) => {

}

app.post('/upload', upload.single('photo'), (req, res) => {
    //Uses EXIF.js to scrape photo for geotag information
    try {
        new exif({ image: req.file.buffer }, function (error, exifData) {
            if (error) {
                res.send('Error: ' + error.message);
            } else {
                const gps = exifData.gps;
                if (gps.GPSLatitude && gps.GPSLongitude) {
                    let lat = gps.GPSLatitude[0] + gps.GPSLatitude[1]/60 + gps.GPSLatitude[2]/3600;
                    let lon = gps.GPSLongitude[0] + gps.GPSLongitude[1]/60 + gps.GPSLongitude[2]/3600;
                    //Convert values to negative if necessary
                    if (gps.GPSLatitudeRef == "S") lat = -lat;
                    if (gps.GPSLongitudeRef == "W") lon = -lon;
                    //Return values to HTML page and store them in the console.log
                    res.json({ latitude: lat, longitude: lon });    
                     
                } 
                else {
                    res.send('No geotag data found.');
                }
            }
        });
    } catch (e) {
        res.send('Error processing image.');
    }
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
