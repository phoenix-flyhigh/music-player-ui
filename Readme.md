# Music player - Frontend

This is a landing page ui clone of music streaming platform - Spotify (only for learning purposes) 

Built using html, css, js and statically rendered using express server

## Features

- Includes a basic "seek and play" track player that plays a queue with random tracks picked using spotify-api. Click on <b><i>See preview</i></b> to view this player
- Created utility classes in css to reuse across the codebase
- Refer this [Get Started with Spotify Api](https://developer.spotify.com/documentation/web-api) to get client credentials

## Steps to get started
1. Run below command to install all dependencies of this project

    `
    npm install
    `
1. Check if nodemon is installed. If not run 

    `
    npm i -g nodemon
    `
1. Start the application with

    `
    npm start
    `
1. To get the tracks to be played, get the client credentils and put them in a .env file. Required keys are

    `
    SPOTIFY_CLIENT_ID
    `

    `
    SPOTIFY_CLIENT_SECRET
    `