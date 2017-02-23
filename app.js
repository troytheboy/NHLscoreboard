var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
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
    var away = gameData.teams.away.name;
    var home = gameData.teams.home.name;
    var boxscore = liveData.boxscore;
    var awayScore = boxscore.teams.away.teamStats.teamSkaterStats.goals;
    var homeScore = boxscore.teams.home.teamStats.teamSkaterStats.goals;
    if (time > new Date()) {
      time = time.toISOString().split("T")[1];
      var hours = time.substring(0,2);
      hours = parseInt(hours, 10) + 7;
      time = hours + time.substring(2,5) + " EST";
      console.log(away + " @ " + home + " " + time + "\n");
    } else {
      console.log(away + " " + awayScore + " || " + home + " " + homeScore + "\n");
    }
    return result;
}

function getGames(date) {
    //var date = new Date();
    //var yesterdayDate = date.setDate(date.getDate() -1);
    //console.log(date,yesterdayDate)
    var today = date.toISOString().split("T")[0];
    //var yesterday = (new Date(yesterdayDate)).toISOString().split("T")[0];
    var schedule = "https://statsapi.web.nhl.com/api/v1/schedule?startDate="+today+"&endDate="+today;
    console.log(today);
    //var scheduleYesterday = "https://statsapi.web.nhl.com/api/v1/schedule?startDate="+yesterday+"&endDate="+yesterday;
    //console.log(scheduleYesterday);
    var gameIds = parseGames(schedule);
    //var yesterdayIds = parseGames(scheduleYesterday);
    // console.log("Yesterday's Scores:");
    // yesterdayIds.forEach(function(element) {
    //   getScore(element)
    // })    //console.log(gameIds);

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

function scoreboard(date) {
  var games = getGames(date);
  var gameData = [];
  games.forEach(function(element) {
    gameData.push(getScore(element));
  });
}

var date = new Date;
scoreboard(date);
// var yesterday = new Date(date.setDate(date.getDate() -1));
// scoreboard(yesterday);
