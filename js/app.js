//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
//var $ = require('jquery');
//var url = "http://statsapi.web.nhl.com/api/v1/game/2016020891/feed/live.json";
var $ = jQuery;


function getScore(gameId)
{
    theUrl = ("http://statsapi.web.nhl.com/api/v1/game/" + gameId + "/feed/live.json");
    //console.log('\n data link: ' + theUrl + '\n')
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
    var awayAbrv = gameData.teams.away.abbreviation;
    var home = gameData.teams.home.name;
    var homeAbrv = gameData.teams.home.abbreviation;
    var boxscore = liveData.boxscore;
    var awayScore = boxscore.teams.away.teamStats.teamSkaterStats.goals;
    var homeScore = boxscore.teams.home.teamStats.teamSkaterStats.goals;
    var status = gameData.status.detailedState;
    if (status != 'Final') {
      //console.log(liveData.linescore);
      status = liveData.linescore.currentPeriodTimeRemaining + " " + liveData.linescore.currentPeriodOrdinal;
    }
    var gameHTML = '<div class="game container-fluid"><div class="row container"><div class="col-md-4 col-sm-4 teams"><div class="team"><img class="logo" src="static/img/logos/'+awayAbrv+'.png" >'+away+' <strong>'+awayScore+'</strong></div><div class="team"><img class="logo" src="static/img/logos/'+homeAbrv+'.png" >'+home+' <strong>'+homeScore+'</strong></div></div>';
    if (time > new Date()) {
      time = time.toISOString().split("T")[1];
      var hours = time.substring(0,2);
      hours = parseInt(hours, 10) + 7;
      time = hours + time.substring(2,5) + " EST";
      gameHTML += '<div class="col-md-3 col-sm-3 status">'+time+'</div></div></div>';
      //$("#scoreboard").append('<p>' + away + " @ " + home + " " + time +  + '</p>');
      // console.log(away + " @ " + home + " " + time + "\n");
    } else {
        //$("#scoreboard").append('<div class="game">' + away + " " + awayScore + " || " + home + " " + homeScore + " - " + status  + '</div>');
        gameHTML += '<div class="col-md-3 col-sm-3 status">'+status+'</div></div></div>';
        console.log(away + " " + awayScore + " || " + home + " " + homeScore + " - " + status  + "\n");
    }
    $("#scoreboard").append(gameHTML);
    return result;
}

function getGames(date) {
    //var date = new Date();
    //var yesterdayDate = date.setDate(date.getDate() -1);
    //console.log(date,yesterdayDate)
    var today = date.toISOString().split("T")[0];
    var month = today;
    console.log("\nNHL Scoreboard: " + today + '\n');
    //var yesterday = (new Date(yesterdayDate)).toISOString().split("T")[0];
    var schedule = "https://statsapi.web.nhl.com/api/v1/schedule?startDate="+today+"&endDate="+today;
    //console.log(today);
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
  });
  return gameIds;
}

function scoreboard(date) {
  var games = getGames(date);
  var gameData = [];
  games.forEach(function(element) {
    gameData.push(getScore(element));
  });
  return gameData;
}

var date = new Date;
var date2 = new Date (date.setDate(date.getDate() -1));
//console.log(scoreboard(date2));
games = scoreboard(date2);
$(document).ready(function() {
    scoreboard(date2);
    games.forEach(function (game) {
        var gameData = game.gameData;
        var away = gameData.teams.away.name;
        var home = gameData.teams.home.name;
        console.log(away + ' VS ' + home);
        //$("#scoreboard").append('<p>' + away + ' VS ' + home + '</p>');
    });
});

// var yesterday = new Date(date.setDate(date.getDate() -1));
// scoreboard(yesterday);
