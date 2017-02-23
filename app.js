require('http')
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var htmlparser = require("htmlparser");
var $ = require('jquery')
var url = "http://statsapi.web.nhl.com/api/v1/game/2016020891/feed/live.json";



function getScore(gameId)
{
    theUrl = ("http://statsapi.web.nhl.com/api/v1/game/" + gameId + "/feed/live.json");
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    var result = JSON.parse(xmlHttp.responseText);
    result = JSON.parse(JSON.stringify(result));
    var gameData = JSON.parse(JSON.stringify(result.gameData));
    var liveData = JSON.parse(JSON.stringify(result.liveData));
    var dateTime = gameData.datetime.dateTime;
    var time = new Date(dateTime);
    //console.log(time > new Date());

    var away = gameData.teams.away.name;
    var home = gameData.teams.home.name;
    var boxscore = liveData.boxscore;
    var awayScore = boxscore.teams.away.teamStats.teamSkaterStats.goals;
    var homeScore = boxscore.teams.home.teamStats.teamSkaterStats.goals;
    if (time > new Date()) {
      console.log(away + " @ " + home + " Game Start: " + time + "\n");
    } else {
      console.log(away + " " + awayScore + " || " + home + " " + homeScore + "\n");
    }
}

function getGames() {
    var date = new Date();
    var yesterdayDate = date.setDate(date.getDate() -1);
    //console.log(date,yesterdayDate)
    var today = (new Date()).toISOString().split("T")[0];
    var yesterday = (new Date(yesterdayDate)).toISOString().split("T")[0];
    var schedule = "https://statsapi.web.nhl.com/api/v1/schedule?startDate="+today+"&endDate="+today;
    var scheduleYesterday = "https://statsapi.web.nhl.com/api/v1/schedule?startDate="+yesterday+"&endDate="+yesterday;
    //console.log(scheduleYesterday);
    var gameIds = parseGames(schedule);
    var yesterdayIds = parseGames(scheduleYesterday);
    console.log("Yesterday's Scores:");
    yesterdayIds.forEach(function(element) {
      getScore(element)
    })    //console.log(gameIds);

    return gameIds;

}

function parseGames(schedule) {
  var nhlGames = new XMLHttpRequest();
  nhlGames.open( "GET", schedule, false ); // false for synchronous request
  nhlGames.send( null );
  var doc = JSON.parse(nhlGames.responseText);
  var games = doc.dates[0].games;
  var gameIds = [];
  games.forEach(function(element) {
    gameIds.push(element.gamePk);
  })
  return gameIds;
}

//console.log(getScore(url));
//console.log(getGames());
var games = getGames();
console.log("Todays Games: ");
games.forEach(function(element) {
  getScore(element)
})
