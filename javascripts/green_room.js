var Arrrrr = function(sp) {
  this._sp = sp;
  this._playerApi = {
    models: sp.require("sp://import/scripts/api/models"),
    views:  sp.require("sp://import/scripts/api/views")
  };
};

Arrrrr.prototype.init = function() {
  $.getJSON('http://lolhost:4567/pirates', function(d){
    var pirates = d.pirates;
    var pul=$('#pirates');
    pirates.
      sort(function(a,b){return b.downloads - a.downloads;}).
      forEach(function(pirate) {
        pul.append($('<li>'+pirate.name+': '+pirate.downloads+'</li>'));
    });
  })
  
//  this.loadPlaylist();
//  this.updatePageWithTrackDetails();

  this._sp.trackPlayer.addEventListener("playerStateChanged", function (event) {
    // Only update the page if the track changed
    if (event.data.curtrack == true) {
//      this.updatePageWithTrackDetails();
    }
  });
};

Arrrrr.prototype.updatePageWithTrackDetails = function() {
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

Arrrrr.prototype.loadPlaylist = function() {
  var m = this._playerApi.models,
  v = this._playerApi.views;

  var tpl = new m.Playlist();
  var tplPlayer = new v.Player();
  var tempList = new v.List(tpl);
  tpl.add(m.Track.fromURI("spotify:track:4z4t4zEn4ElVPGmDWCzRQf"));
  tpl.add(m.Track.fromURI("http://open.spotify.com/track/7E8JGVhbwWgAQ1DtfatQEl"));
  tplPlayer.track = tpl.get(0);
  tplPlayer.context = tpl;

  $(tempList.node).addClass("sp-light");
  $('#playlist').append(tempList.node);
};

exports.Arrrrr = Arrrrr;
