require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var fs = require("fs");
var moment = require("moment")

var command = process.argv[2];
var value = process.argv.slice(3).join(" ");

function runSwitch() {
    switch(command) {
        case "concert-this":
        concertThis();
        break;
    
        case "spotify-this-song":
        spotifyThisSong();
        break;
    
        case "movie-this":
        movieThis();
        break;
    
        case "do-what-it-says":
        doWhatItSays();
        break;
    }
}

function concertThis() {
    axios.get("https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp").then(
        function(response) {
            fs.appendFileSync("log.txt", "***************** " + value.toUpperCase() + " *****************" + "\n\n");
            for (i = 0; i < response.data.length; i++) {
                fs.appendFileSync("log.txt", "///////////////// " + "Concert Info" + " /////////////////" + "\n");
                fs.appendFileSync("log.txt", response.data[i].venue.name + "\n");
                fs.appendFileSync("log.txt", response.data[i].venue.city + "\n");
                fs.appendFileSync("log.txt", response.data[i].venue.region + "\n");
                fs.appendFileSync("log.txt", moment(response.data[i].dateTime).format("L") + "\n");
                fs.appendFileSync("log.txt", "///////////////////////////////////////////////\n\n");
            }
            fs.appendFileSync("log.txt", "***************************************************" + "\n\n");
        }
    );
}

function spotifyThisSong() {
    spotify.search({
        type: "track",
        query: value
    }, 
    function (err, data) {
        if(err){

        }
        var songs = data.tracks.items;

        fs.appendFileSync("log.txt", "///////////////// " + "Song Info" + " /////////////////" + "\n");
        fs.appendFileSync("log.txt", songs[0].name + "\n");
        fs.appendFileSync("log.txt", songs[0].external_urls + "\n");
        fs.appendFileSync("log.txt", songs[0].album.name + "\n");
        fs.appendFileSync("log.txt", songs[0].artists[0].name + "\n");
        fs.appendFileSync("log.txt", "///////////////////////////////////////////////\n\n");
    })
}

function movieThis() {
    axios.get("http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy").then(
        function(response) {
            console.log(response);
            let data = response.data;
            let str = [
                "**********MOVIE INFO*********",
                "Movie Title:" + data.Title,
                "Movie Year:" + data.Year,
                "Movie Rating:" + data.Ratings[0].Value,
                "Movie Rating:" + data.Ratings[1].Value,
                "Movie Country:" + data.Country,
                "Movie Language:" + data.Language,
                "Movie Plot:" + data.Plot,
                "Movie Actor:" + data.Actor,
                "*****************************\n"
            ].join("\n");
            fs.appendFile("log.txt", str, function (err) {
                   if (err) {
                       console.log(err)
                   };
                })
        }
    )
    .catch(function (error) {
        if (error.response) {
            console.log("response error")
        }
        else if (error.request) {
            console.log("request error")
        }
        else {
            console.log("error")
        }
    })
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if(err) {
            console.log("error");
        }
    
        command = data.split(",")[0];
        value = data.split(",")[1];

        switch(command) {
            case "concert-this":
            concertThis();
            break;
        
            case "spotify-this-song":
            spotifyThisSong();
            break;
        
            case "movie-this":
            movieThis();
            break;
        
            case "do-what-it-says":
            doWhatItSays();
            break;
        }
    })
}

runSwitch();