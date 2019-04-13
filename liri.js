
require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var request = require('request');
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);



var command = process.argv[2];
var query = process.argv[3];






function switchCase() {

    switch (command) {

        case 'concert':
            bandsInTown(query);
            break;

        case 'spotify':
            spotSong(query);
            break;

        case 'movie':
            movieInfo(query);
            break;

        case 'do-what-it-says':
            getRandom();
            break;

        default:
            logIt("Invalid Instruction");
            break;

    }
};


//------------------  Bands in town Function  ----------------------->
function bandsInTown(query) {

    var bandName = query;
    var queryUrl = "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp";


    request(queryUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var response = JSON.parse(body);
            // console.log(response);

            for (i = 0; i < response.length; i++) {
                var dTime = response[i].datetime;
                var month = dTime.substring(5, 7);
                var year = dTime.substring(0, 4);
                var day = dTime.substring(8, 10);
                var dateForm = month + "/" + day + "/" + year

                logIt("\n---------------------------------------------------\n");

                logIt("Artist: " + response[i].lineup);
                logIt("Date: " + dateForm);
                logIt("Name: " + response[i].venue.name);
                logIt("City: " + response[i].venue.city);
                if (response[i].venue.region !== "") {
                    logIt("Country: " + response[i].venue.region);
                }
                logIt("Country: " + response[i].venue.country);
                logIt("\n---------------------------------------------------\n");

            }
        }
    });
}
//------------------------   End Band in Town function-------------->



//--------------------- Spotify Song Function ----------------------->
function spotSong(query) {


    var searchTrack;
    if (query === undefined) {
        searchTrack = "The Sign ace of base";
    } else {
        searchTrack = query;
    }

    spotify.search({
        type: 'track',
        query: searchTrack
    }, function (error, data) {
        if (error) {
            logIt('Error occurred: ' + error);
            return;
        } else {
            logIt("\n---------------------------------------------------\n");
            logIt("Artist: " + data.tracks.items[0].artists[0].name);
            logIt("Song: " + data.tracks.items[0].name);
            logIt("Preview: " + data.tracks.items[0].preview_url);
            logIt("Album: " + data.tracks.items[0].album.name);
            logIt("\n---------------------------------------------------\n");

        }
    });
};

//---------------------End of Spotify Song Function ----------------------->



//-------------------- Movie Info (OMDB) Function ----------------------->
function movieInfo(query) {


    var findMovie;
    if (query === undefined) {
        findMovie = "Mr. Nobody";
    } else {
        findMovie = query;
    };

    var queryUrl = "http://www.omdbapi.com/?t=" + findMovie + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (err, res, body) {
        var response = JSON.parse(body);
        if (!err && res.statusCode === 200) {
            logIt("\n---------------------------------------------------\n");
            logIt("Title: " + response.Title);
            logIt("Release Year: " + response.Year);
            logIt("IMDB Rating: " + response.imdbRating);
            logIt("Rotten Tomatoes Rating: " + response.Ratings[1].Value);
            logIt("Country: " + response.Country);
            logIt("Language: " + response.Language);
            logIt("Plot: " + response.Plot);
            logIt("Actors: " + response.Actors);
            logIt("\n---------------------------------------------------\n");
        }
    });
};
//---------------------End of Movie Info Function ----------------------->


//---------------------Get Random Function ----------------------->
function getRandom() {
    fs.readFile('random.txt', "utf8", function (error, data) {

        if (error) {
            return logIt(error);
        }

        console.log(data + "test");


        var dataArr = data.split(",");

        console.log(dataArr + "test2");

        if (dataArr[0] === "spotify") {
            var songcheck = dataArr[1].trim().slice(0, -5);
            spotSong(songcheck);
            console.log(songcheck);
        }
        else if (dataArr[0] === "concert") {
            if (dataArr[1].charAt(1) === "'") {
                var dLength = dataArr[1].length - 1;
                var data = dataArr[1].substring(2, dLength);
                console.log(data);
                bandsInTown(data);
            }
            else {
                var bandName = dataArr[1].trim();
                console.log(bandName);
                bandsInTown(bandName);
            }

        }
        else if (dataArr[0] === "movie") {
            var movie_name = dataArr[1].trim().slice(1, -1);
            movieInfo(movie_name);
        }

    });

};

//---------------------End Get Random Function ----------------------->



//----------------------Log it Function------------------------->

function logIt(dataToLog) {

    console.log(dataToLog);

    fs.appendFile('log.txt', dataToLog + '\n', function (err) {

        if (err) return logIt('Error logging data to file: ' + err);
    });
}

//----------------------End Log it Function------------------------->


switchCase();