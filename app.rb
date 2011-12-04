require 'rubygems'
require 'sinatra'
require 'httparty'

class MB
  include HTTParty
  base_uri 'musicbrainz.org'
end

get '/pirates' do
  headers({
    'Access-Control-Allow-Origin' => '*',
    'Access-Control-Allow-Credentials' => 'false',
    'Access-Control-Max-Age' => '86400',
    'Access-Control-Allow-Methods' => 'POST, GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers' => 'Accept, Content-Type, X-Requested-With',
  })
  content_type('application/javascript')

  IO.read('pirates.json')
end

get '/latest_release' do
  MB.get('/ws/2/release', :query => {:artist => '9c9f1380-2516-4fc9-a3e6-f9f61941d090'})
  ''
end

def update_most_pirated
  arrrrrtists = JSON.load(IO.read('arrrrrtists.json'))['response']['entities'].map{|a| {'name' => a["name"], 'mbid' => a['summary']['ids']['musicbrainz']}}.select{|a| a['mbid'] }

  as= arrrrrtists
  File.open('pirates.json','a') do |f|
    while(artist = as.shift) 
      puts "LEFT: #{as.size}" 
      dls = nil
      res = JSON.load(`curl http://api.semetric.com/artist/musicbrainz:#{artist["mbid"]}/downloads/bittorrent?token=6feca490a6994b37b476a43404ce94d8`)
      next if !res["success"] || res['response']['data'].length < 7
      dls = res["response"]["data"][-7..-1].inject{|a,b|a+b}
      next unless dls
      literalspidres = `curl -s '#{'http://ws.audioscrobbler.com/2.0/?method=artist.getPlaylinks&mbid%5B%5D=' + artist['mbid']+'&api_key=b25b959554ed76058ac220b7b2e0a026&format=json'}'`
      puts literalspidres.inspect
      next if literalspidres == "\"\"\n" || literalspidres.empty?
      spidres = JSON.load(literalspidres)
      next if spidres["error"]
      spid = spidres["spotify"]["artist"]["externalids"]["spotify"] 
      next unless spid
      f << artist.merge({:downloads=>dls, :spid => spid}).to_json
      f << ','
    end
  end
  'ok'
end

