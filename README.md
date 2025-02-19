# PhotoMapper v2.0
Refactored and improved version of the 2023 SpaceApps Project <br>
**Website:** https://spaceninjas.onrender.com (May be a little slow to initiate due to render tier) <br>
**UPDATE:** https://www.asc-csa.gc.ca/eng/news/articles/2023/2023-12-21-space-apps-challenge-2023-congratulations-to-the-winners.asp

## Description
This was my first proper project that I decided to take a lead on. I'm very proud of what I've managed to accomplish with it.
<b>Wildfire Mode 🔥:</b> Users are able to upload photos to the webapp, and using data provided by NASA's Fire Information and Resource Management System (FIRMS), compares the photo's location tag to a map of hotspots, built using the ARCgis for JavaScript SDK. Through this, users are able to determine if there photo was taken in an area at risk of a fire within the last 24 hours. <br>
<br>
<b>Normal Mode:</b> The photos taken can also be uploaded to a standard map, where the user is able to see the exact location of where the photo was taken.

### What's different?
* In the original project, due to time constraints most of the code was written in the front-end
* Includes a new toggle between normal map and wildfire mode (developing a photomap generator underneath)
* New security update: uses .env file to access APIs rather than an external .js file
* New Layout: items are positioned horizontally to avoid screen scrolling

### Known Bugs/Issues
* Missing photo pin dropping
* iOS users cannot upload photos directly to the webserver due to security issues
* When uploading some photos, both the "No Geotag" and "No fire data" message show up

### Potential Improvements
* Use the timestamp on the photo, to determine if the photo was taken after the time reported on the hotspot, to prevent false information.
* Add the ability to store multiple photo locations, to allow the user to go back and view where their photos were taken.
* Add some sort of machine learning to determine given coordinates, if user is in an area for a potential hotspot
