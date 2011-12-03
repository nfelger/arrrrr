sp = getSpotifyApi(1);

exports.init = init;

function init() {
  updatePageWithTrackDetails();

  sp.trackPlayer.addEventListener("playerStateChanged", function (event) {

    // Only update the page if the track changed
    if (event.data.curtrack == true) {
      updatePageWithTrackDetails();
    }
  });
}

function updatePageWithTrackDetails() {
  var header = document.getElementById("header");

  // This will be null if nothing is playing.
  var playerTrackInfo = sp.trackPlayer.getNowPlayingTrack();

  if (!playerTrackInfo) {
    header.innerText = "Nothing playing!";
  } else {
    var track = playerTrackInfo.track;
    header.innerText = track.name + " from the album " + track.album.name + " by " + track.album.artist.name + ".";
  }
}

function searchGoogleForSpotify() {
  var req = new XMLHttpRequest();
  req.open("GET", "https://www.googleapis.com/customsearch/v1?q=spotify", true);

    req.onreadystatechange = function() {
    console.log(req.status);

    if (req.readyState == 4) {
      if (req.status == 200) {
        console.log("Search complete");
      }
    }
  };

  req.send();
}
