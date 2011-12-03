var GreenRoom = function(sp) {
  this._sp = sp;
};

GreenRoom.prototype.init = function() {
  this.updatePageWithTrackDetails();

  this._sp.trackPlayer.addEventListener("playerStateChanged", function (event) {

    // Only update the page if the track changed
    if (event.data.curtrack == true) {
      this.updatePageWithTrackDetails();
    }
  });
};

GreenRoom.prototype.updatePageWithTrackDetails = function() {
  var header = document.getElementById("header");

  // This will be null if nothing is playing.
  var playerTrackInfo = this._sp.trackPlayer.getNowPlayingTrack();

  if (!playerTrackInfo) {
    header.innerText = "Nothing playing!";
  } else {
    var track = playerTrackInfo.track;
    header.innerText = track.name + " from the album " + track.album.name + " by " + track.album.artist.name + ".";
  }
};

GreenRoom.prototype.searchGoogleForSpotify = function() {
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

exports.GreenRoom = GreenRoom;
