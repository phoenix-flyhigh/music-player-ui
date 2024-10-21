console.log("logged");
let artistData = []
let albumData = []
let chartsData = []
let initialNumberOfImagesToFit = 0;

const container = document.getElementById("main-content")

const getNumberOfImagesToFitContainer = () => {
    const containerWidth = container.offsetWidth
    const imageWidth = 240 
    const margin = 20

    const numberOfImages = Math.floor(containerWidth / (imageWidth + margin))
    return numberOfImages;
}

fetch("/artists").then((res) => res.json()) .then((data) => {
    console.log("artist data", data)
    artistData = data

    if(!initialNumberOfImagesToFit){
        initialNumberOfImagesToFit = getNumberOfImagesToFitContainer()
    }
    showArtists(artistData.slice(0, Math.min(initialNumberOfImagesToFit, artistData.length)))
})

fetch("/albums").then((res) => res.json()) .then((data) => {
    console.log("album data", data)
    albumData = data
    if(!initialNumberOfImagesToFit){
        initialNumberOfImagesToFit = getNumberOfImagesToFitContainer()
    }
    showAlbums(albumData.slice(0, Math.min(initialNumberOfImagesToFit, albumData.length)))
})

fetch("/charts").then((res) => res.json()) .then((data) => {
    console.log("charts data", data)
    chartsData = data
    if(!initialNumberOfImagesToFit){
        initialNumberOfImagesToFit = getNumberOfImagesToFitContainer()
    }
    showCharts(chartsData.slice(0, Math.min(initialNumberOfImagesToFit, chartsData.length)))
})

const showArtists = (artistData) => {
    const artistSection = document.getElementById("popular-artists")
    artistData.forEach(artist => {
        const element = document.createElement("div")
        element.classList.add("flex", "flex-col", "gap-2", "card", "p-4", "rounded-md", "relative")
        element.innerHTML = `
            <img
                src=${artist.url}
                class="w-24 h-24 min-w-16 min-h-16 rounded-full"
                alt=${artist.name}
            />
            <p class="m-0 text-lg">${artist.name}</p>
            <span class="text-lightgray">Artist</span>
            <button id="play-btn" class="absolute flex justify-center items-center p-3 bottom-1-3 play-btn hidden right-4 bg-green rounded-lg">
                <img src="assets/play.svg" class="" alt="browse" />
            </button>
        `;
        
        artistSection.appendChild(element)
    })
}

const showAlbums = (albumData) => {
    const albumSection = document.getElementById("popular-albums")
    albumData.forEach(album => {
        const element = document.createElement("div")
        element.classList.add("flex", "flex-col", "gap-2", "card", "p-4", "rounded-sm", "relative")
        element.innerHTML = `
            <img
                src=${album.url}
                class="w-24 h-24 min-w-16 min-h-16"
                alt=${album.name}
            />
            <p class="m-0 text-lg">${album.name}</p>
            <span class="text-lightgray">${album.artist}</span>
            <button id="play-btn" class="absolute flex justify-center items-center p-3 bottom-1-4 play-btn hidden right-6 bg-green rounded-lg">
                <img src="assets/play.svg" class="" alt="browse" />
            </button>
        `;
        
        albumSection.appendChild(element)
    })
}

const showCharts = (chartsData) => {
    const chartsSection = document.getElementById("featured-charts")
    chartsData.forEach(chart => {
        const element = document.createElement("div")
        element.classList.add("flex", "flex-col", "gap-2", "card", "p-4", "rounded-sm", "relative", "justify-center",  "items-center")
        element.innerHTML = `
            <img
                src=${chart.url}
                class="w-24 h-24 min-w-16 min-h-16"
                alt=${chart.name}
            />
            <p class="max-w-24 text-lightgray">Your daily update of he most played tracks right now</p>
            <button id="play-btn" class="absolute flex justify-center items-center p-3 bottom-1-3 play-btn hidden right-6 bg-green rounded-lg">
                <img src="assets/play.svg" class="" alt="browse" />
            </button>
        `;
        
        chartsSection.appendChild(element)
    })
}

const adjustVisibleImages = () => {
    const numberOfImages =getNumberOfImagesToFitContainer()
    showArtists(artistData.slice(0, Math.min(numberOfImages, artistData.length)))
    showAlbums(albumData.slice(0, Math.min(numberOfImages, albumData.length)))
    showCharts(chartsData.slice(0, Math.min(numberOfImages, chartsData.length)))
}

window.addEventListener("resize", adjustVisibleImages)
