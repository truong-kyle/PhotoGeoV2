# PhotoMapper v2.0
Refactored improved version of the 2023 SpaceApps Project <br>
**Website:** https://spaceninjas.onrender.com (May be a little slow to initiate due to render tier)

## What's different?
* In the original project, due to time constraints most of the code was written in the front-end
* Includes a new toggle between normal map and wildfire mode (developing a photomap generator underneath)
* New security update: uses .env file to access APIs rather than an external .js file
* New Layout: items are positioned horizontally to avoid screen scrolling

## Known Bugs/Issues
* Missing photo pin dropping
* Missing "normal" mode
* iOS users cannot upload photos directly to the webserver due to security issues
* When uploading some photos, both the "No Geotag" and "No fire data" message show up
