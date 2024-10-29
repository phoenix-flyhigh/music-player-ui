(() => {
  let artistData = [];
  let albumData = [];
  let chartsData = [];
  let initialNumberOfImagesToFit = 0;
  let currentTrackToPlay = new Audio();
  let TOTAL_TRACKS = 3;
  const container = document.getElementById("main-content");
  let trackdata = [];
  let currentTrackId = 0;

  const getNumberOfImagesToFitContainer = () => {
    const containerWidth = container.offsetWidth;
    const imageWidth = 240;
    const margin = 20;

    const numberOfImages = Math.floor(containerWidth / (imageWidth + margin));
    return numberOfImages;
  };

  fetch("/artists")
    .then((res) => res.json())
    .then((data) => {
      artistData = data;

      if (!initialNumberOfImagesToFit) {
        initialNumberOfImagesToFit = getNumberOfImagesToFitContainer();
      }
      showArtists(
        artistData.slice(
          0,
          Math.min(initialNumberOfImagesToFit, artistData.length)
        )
      );
    });

  fetch("/albums")
    .then((res) => res.json())
    .then((data) => {
      albumData = data;
      if (!initialNumberOfImagesToFit) {
        initialNumberOfImagesToFit = getNumberOfImagesToFitContainer();
      }
      showAlbums(
        albumData.slice(
          0,
          Math.min(initialNumberOfImagesToFit, albumData.length)
        )
      );
    });

  fetch("/charts")
    .then((res) => res.json())
    .then((data) => {
      chartsData = data;
      if (!initialNumberOfImagesToFit) {
        initialNumberOfImagesToFit = getNumberOfImagesToFitContainer();
      }
      showCharts(
        chartsData.slice(
          0,
          Math.min(initialNumberOfImagesToFit, chartsData.length)
        )
      );
    });

  const showArtists = (artistData) => {
    const artistSection = document.getElementById("popular-artists");
    const fragment = document.createDocumentFragment();

    artistData.forEach((artist) => {
      const element = document.createElement("div");
      element.classList.add(
        "flex",
        "flex-col",
        "gap-2",
        "card",
        "p-4",
        "rounded-md",
        "relative"
      );
      element.innerHTML = `
            <img
                src=${artist.url}
                class="w-24 h-24 min-w-16 min-h-16 rounded-full"
                alt=${artist.name}
            />
            <p class="m-0 text-lg">${artist.name}</p>
            <span class="text-lightgray">Artist</span>
            <button id="play-btn" class="absolute flex justify-center items-center p-3 bottom-1-3 play-btn hide right-4 bg-green rounded-lg">
                <img src="assets/play.svg" class="" alt="browse" />
            </button>
        `;

      fragment.appendChild(element);
    });
    artistSection.appendChild(fragment);
  };

  const showAlbums = (albumData) => {
    const albumSection = document.getElementById("popular-albums");
    const fragment = document.createDocumentFragment();

    albumData.forEach((album) => {
      const element = document.createElement("div");
      element.classList.add(
        "flex",
        "flex-col",
        "gap-2",
        "card",
        "p-4",
        "rounded-sm",
        "relative"
      );
      element.innerHTML = `
            <img
                src=${album.url}
                class="w-24 h-24 min-w-16 min-h-16"
                alt=${album.name}
            />
            <p class="m-0 text-lg">${album.name}</p>
            <span class="text-lightgray">${album.artist}</span>
            <button id="play-btn" class="absolute flex justify-center items-center p-3 bottom-1-4 play-btn hide right-6 bg-green rounded-lg">
                <img src="assets/play.svg" class="" alt="browse" />
            </button>
        `;

      fragment.appendChild(element);
    });
    albumSection.appendChild(fragment);
  };

  const showCharts = (chartsData) => {
    const chartsSection = document.getElementById("featured-charts");
    const fragment = document.createDocumentFragment();

    chartsData.forEach((chart) => {
      const element = document.createElement("div");
      element.classList.add(
        "flex",
        "flex-col",
        "gap-2",
        "card",
        "p-4",
        "rounded-sm",
        "relative",
        "justify-center",
        "items-center"
      );
      element.innerHTML = `
            <img
                src=${chart.url}
                class="w-24 h-24 min-w-16 min-h-16"
                alt=${chart.name}
            />
            <p class="max-w-24 text-lightgray">Your daily update of he most played tracks right now</p>
            <button id="play-btn" class="absolute flex justify-center items-center p-3 bottom-1-3 play-btn hide right-6 bg-green rounded-lg">
                <img src="assets/play.svg" class="" alt="browse" />
            </button>
        `;

      fragment.appendChild(element);
    });
    chartsSection.appendChild(fragment);
  };

  const adjustVisibleImages = () => {
    const numberOfImages = getNumberOfImagesToFitContainer();
    showArtists(
      artistData.slice(0, Math.min(numberOfImages, artistData.length))
    );
    showAlbums(albumData.slice(0, Math.min(numberOfImages, albumData.length)));
    showCharts(
      chartsData.slice(0, Math.min(numberOfImages, chartsData.length))
    );
  };

  window.addEventListener("resize", adjustVisibleImages);

  const footer = document.querySelector(".footer");
  const player = document.querySelector(".player");
  const loader = document.querySelector(".loader");
  const previewBtn = document.getElementById("preview");

  const showMusicPlayer = async () => {
    footer.style.display = "none";
    loader.style.display = "flex";

    await fetch("/tracks")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        loader.style.display = "none";
        player.style.display = "flex";
        trackdata = data.items;
        showTrackDetails();
      })
      .catch(() => {
        console.error("failed to get tracks");
      });
  };

  previewBtn?.addEventListener("click", showMusicPlayer);

  const playBtn = document.getElementById("play-btn");
  const pauseBtn = document.getElementById("pause-btn");

  const showTrackPlayStatus = (statusBtn) => {
    playBtn.classList.add("hidden")
    pauseBtn.classList.add("hidden")
    
    statusBtn.classList.remove("hidden");
    statusBtn.classList.add("flex");
  }

  playBtn?.addEventListener("click", () => {
    if (currentTrackToPlay.src) {
      showTrackPlayStatus(pauseBtn)
      currentTrackToPlay.play();
    }
  });

  pauseBtn?.addEventListener("click", () => {
    if (currentTrackToPlay.src) {
      showTrackPlayStatus(playBtn)
      currentTrackToPlay.pause();
    }
  });

  const showTrackDetails = () => {
    const currentTrack = trackdata[currentTrackId].track;
    const name = document.getElementById("track-name");
    const artist = document.getElementById("track-artist");
    const image = document.getElementById("track-image");

    image.src = currentTrack.album.images[2].url;
    name.innerHTML = currentTrack.name;
    artist.innerHTML = currentTrack.artists[0].name;
    currentTrackToPlay.src = currentTrack.preview_url;
  };

  const getProgress = (e, rect) => {
    const offset = e.clientX - rect.left;
    const percentage = Math.min(Math.max(offset / rect.width, 0), 1);
    return percentage;
  };

  const getSecondsFromTime = (time) => {
    const timeParts = time.split(":");
    const seconds = Number(timeParts[0]) * 60 + Number(timeParts[1]);
    return seconds;
  };

  const convertSecondsToTime = (totalSeconds) => {
    const roundedTimeInSeconds = Math.round(totalSeconds);
    const minutes = Math.floor(roundedTimeInSeconds / 60);
    const seconds = roundedTimeInSeconds % 60;
    let formattedTime = ``;
    minutes < 10
      ? (formattedTime += `0${minutes}`)
      : (formattedTime += `${minutes}`);
    formattedTime += `:`;
    seconds < 10
      ? (formattedTime += `0${seconds}`)
      : (formattedTime += `${seconds}`);
    return formattedTime;
  };

  const trackBar = document.getElementById("track-bar");
  const trackProgress = document.getElementById("track-progress");
  const trackDragger = document.getElementById("track-notch");
  const trackElapsedTime = document.getElementById("elapsed-time");
  const trackTotalTime = document.getElementById("total-time");
  let isDraggingTrack = false;

  const updateTrackProgress = (e) => {
    const rect = trackBar.getBoundingClientRect();
    const percentage = getProgress(e, rect);
    const newWidth = percentage * rect.width;

    trackProgress.style.width = `${newWidth}px`;
    trackDragger.style.left = `${newWidth}px`;

    const totalTime = trackTotalTime.innerHTML;
    const totalDurationInSeconds = getSecondsFromTime(totalTime);
    const elapsedTimeInSeconds = percentage * totalDurationInSeconds;
    const elapsedTime = convertSecondsToTime(elapsedTimeInSeconds);

    trackElapsedTime.innerText = elapsedTime;
    currentTrackToPlay.currentTime = percentage * currentTrackToPlay.duration;
  };

  trackBar.addEventListener("click", updateTrackProgress);

  trackBar.addEventListener("mousedown", (e) => {
    isDraggingTrack = true;
    trackBar.classList.add("dragging-track");
    updateTrackProgress(e);
  });

  trackBar.addEventListener("mouseup", () => {
    isDraggingTrack = false;
    trackBar.classList.remove("dragging-track");
  });

  document.addEventListener("mousemove", (e) => {
    if (isDraggingTrack) {
      updateTrackProgress(e);
    }
  });

  document.addEventListener("mouseup", () => {
    if (isDraggingTrack) {
      isDraggingTrack = false;
      trackBar.classList.remove("dragging-track");
    }
  });

  currentTrackToPlay.addEventListener("timeupdate", () => {
    const percentage =
      currentTrackToPlay.currentTime / currentTrackToPlay.duration;
    const rect = trackBar.getBoundingClientRect();

    const newWidth = percentage * rect.width;

    trackProgress.style.width = `${newWidth}px`;
    trackDragger.style.left = `${newWidth}px`;
    trackElapsedTime.innerText = `${convertSecondsToTime(
      currentTrackToPlay.currentTime
    )}`;
  });

  currentTrackToPlay.addEventListener("ended", () => {
    if (currentTrackId < TOTAL_TRACKS - 1) {
      currentTrackId += 1;
    } else {
      currentTrackId = 0;
    }
    showTrackDetails();
    trackProgress.style.width = `0px`;
    trackDragger.style.left = `0px`;
    trackElapsedTime.innerText = `00:00`;
    if (currentTrackId != 0) {
      currentTrackToPlay.play();
    } else {
      showTrackPlayStatus(playBtn)
    }
  });

  const volumeBtn = document.querySelector("#volume-btn");
  const highVolumeImg = document.querySelector(".high-vol");
  const lowVolumeImg = document.querySelector(".low-vol");
  const zeroVolumeImg = document.querySelector(".zero-vol");

  const volumeBar = document.getElementById("volume-bar");
  const volumeProgress = document.getElementById("volume-progress");
  const volumeNotch = document.getElementById("volume-notch");

  let currentVolumePercentage = 1;
  let previousVolumePercentage = 1;
  const VOLUME_THRESHOLD = 0.7;

  const showVolumeBtn = (element) => {
    highVolumeImg.style.opacity = 0;
    lowVolumeImg.style.opacity = 0;
    zeroVolumeImg.style.opacity = 0;

    element.style.opacity = 1;
  };

  const setVolumeProgress = (percentage) => {
    const volumeBarRect = volumeBar.getBoundingClientRect();

    volumeProgress.classList.remove("w-full");
    volumeProgress.style.width = `${Math.round(
      percentage * volumeBarRect.width
    )}px`;
    volumeNotch.style.left = `${percentage * 100}%`;
  };

  const muteTrack = () => {
    showVolumeBtn(zeroVolumeImg);
    setVolumeProgress(0);
    currentTrackToPlay.volume = 0;
    previousVolumePercentage = currentVolumePercentage;
    currentVolumePercentage = 0;
  };

  const revertVolumeToPrevious = () => {
    currentVolumePercentage = previousVolumePercentage;
    previousVolumePercentage = 0;

    setVolumeProgress(currentVolumePercentage);
    currentTrackToPlay.volume = currentVolumePercentage;

    if (currentVolumePercentage > VOLUME_THRESHOLD) {
      showVolumeBtn(highVolumeImg);
    } else {
      showVolumeBtn(lowVolumeImg);
    }
  };

  volumeBtn.addEventListener("click", () => {
    if (currentVolumePercentage > 0) {
      muteTrack();
    } else {
      revertVolumeToPrevious();
    }
  });

  let isDraggingVolume = false;

  const updateVolumeProgress = (e) => {
    const volumeBarRect = volumeBar.getBoundingClientRect();
    const percentage = getProgress(e, volumeBarRect);

    if (percentage == 0) {
      showVolumeBtn(zeroVolumeImg);
    } else if (percentage > VOLUME_THRESHOLD) {
      showVolumeBtn(highVolumeImg);
    } else {
      showVolumeBtn(lowVolumeImg);
    }
    setVolumeProgress(percentage);
    currentTrackToPlay.volume = percentage;
    currentVolumePercentage = percentage;
  };

  volumeBar.addEventListener("click", updateVolumeProgress);

  volumeBar.addEventListener("mousedown", (e) => {
    isDraggingVolume = true;
    volumeBar.classList.add("dragging-volume");
    updateVolumeProgress(e);
  });

  volumeBar.addEventListener("mouseup", () => {
    isDraggingVolume = false;
    volumeBar.classList.remove("dragging-volume");
  });

  document.addEventListener("mousemove", (e) => {
    if (isDraggingVolume) {
      updateVolumeProgress(e);
    }
  });

  document.addEventListener("mouseup", () => {
    if (isDraggingVolume) {
      isDraggingVolume = false;
      volumeBar.classList.remove("dragging-volume");
    }
  });
})();
