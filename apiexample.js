// initialize page after HTML loads
window.onload = function() {
   closeLightBox();  // close the lightbox because it's initially open in the CSS
   document.getElementById("button").onclick = function () {
     searchTvShows();
   };
   document.getElementById("lightbox").onclick = function () {
     closeLightBox();
   };
} // window.onload


// get data from TV Maze
function searchTvShows() {
  document.getElementById("main").innerHTML = "";
  
  var search = document.getElementById("search").value;  
    
  fetch('http://api.tvmaze.com/search/shows?q=' + search)
    .then(response => response.json())
    .then(data => showSearchResults(data) 
    );
} // window.onload 
 

// change the activity displayed 
function showSearchResults(data) {
  
  // show data from search
  console.log(data); 
  
  // show each tv show from search results in webpage
  for (let tvshow in data) {
    createTVShow(data[tvshow]);
  } // for


} // showSearchResults

// in the json, genres is an array of genres associated with the tv show 
// this function returns a string of genres formatted as a bulleted list
function showGenres(genres) {
   var g;
   var output = "<ul>";
   for (g in genres) {
      output += "<li>" + genres[g] + "</li>"; 
   } // for       
   output += "</ul>";
   return output; 
} // showGenres

// constructs one TV show entry on webpage
function createTVShow (tvshowJSON) {
  
    // get the main div tag
    var elemMain = document.getElementById("main");
    
    // create a number of new html elements to display tv show data
    var elemDiv = document.createElement("div");
    elemDiv.setAttribute("class", "singleShowDiv");
    var elemImage = document.createElement("img");
    elemImage.setAttribute("class", "poster");
    var elemImageDiv = document.createElement("div");
    elemImageDiv.setAttribute("class", "posterDiv");
    
    var elemShowTitle = document.createElement("h2");
    elemShowTitle.classList.add("showtitle"); // add a class to apply css
    
    var elemGenre = document.createElement("div");
    elemGenre.setAttribute("class", "genre");
    var elemRating = document.createElement("div");
    elemRating.setAttribute("class", "rating");
    var elemSummary = document.createElement("div");
    elemSummary.setAttribute("class", "summary");
    
    // add JSON data to elements
    if(tvshowJSON.show.image){
      if(tvshowJSON.show.image.medium){
        elemImage.src = tvshowJSON.show.image.medium;
      }
    }
    if(tvshowJSON.show.name){
      elemShowTitle.innerHTML = tvshowJSON.show.name;
    }
    if(tvshowJSON.show.genres){
      elemGenre.innerHTML = "Genres: " + showGenres(tvshowJSON.show.genres);
    }
    if(tvshowJSON.show.rating.average){
      elemRating.innerHTML = "Rating: " + tvshowJSON.show.rating.average;
    }
    if(tvshowJSON.show.summary){
      elemSummary.innerHTML = tvshowJSON.show.summary;
    }
       
    // add 5 elements to the div tag elemDiv
    elemImageDiv.appendChild(elemImage);
    elemDiv.appendChild(elemShowTitle);  
    elemDiv.appendChild(elemGenre);
    elemDiv.appendChild(elemRating);
    elemDiv.appendChild(elemSummary);
    elemDiv.appendChild(elemImageDiv);
    
    // get id of show and add episode list
    var showId = tvshowJSON.show.id;
    fetchEpisodes(showId, elemDiv);
    
    // add this tv show to main
    elemMain.appendChild(elemDiv);
    
} // createTVShow

// fetch episodes for a given tv show id
function fetchEpisodes(showId, elemDiv) {
     
  console.log("fetching episodes for showId: " + showId);
  
  fetch('http://api.tvmaze.com/shows/' + showId + '/episodes')  
    .then(response => response.json())
    .then(data => showEpisodes(data, elemDiv));
    
} // fetch episodes


// list all episodes for a given showId in an ordered list 
// as a link that will open a light box with more info about
// each episode
function showEpisodes (data, elemDiv) {
  
    // print data from function fetchEpisodes with the list of episodes
    console.log("episodes");
    console.log(data); 
    
    var elemEpisodes = document.createElement("div");  // creates a new div tag
    elemEpisodes.setAttribute("class", "episodeDiv");
    var output = "";
    for (episode in data) {
        output += "<a href='javascript:fetchEpisodeData(" + data[episode].id + ")'>" + data[episode].name + "</a>";
    }
    elemEpisodes.innerHTML = output;
    elemDiv.appendChild(elemEpisodes);  // add div tag to page
        
} // showEpisodes

// open lightbox and display episode info
function showLightBox(data){
     document.getElementById("lightbox").style.display = "block";
     
     // show episode info in lightbox
     document.getElementById("message").innerHTML = "<h3>" + data.name + "</h3>";
     if(data.season){
      document.getElementById("message").innerHTML += "<h7>Season " + data.season + "</h7><br>";
     }
     if(data.number){
      document.getElementById("message").innerHTML += "<h7>Episode " + data.number + "</h7><br>";
     }
     if(data.summary){
      document.getElementById("message").innerHTML += "<h7>" + data.summary + "</h7><br>";
     }
     if(data.image){
      if(data.image.original){
        document.getElementById("message").innerHTML = "<img id=\"episodeImage\" src=\"" + data.image.original + "\" alt=\"episodeimage\"" + "<br>" + document.getElementById("message").innerHTML;
      }
    }
} // showLightBox

 // close the lightbox
 function closeLightBox(){
     document.getElementById("lightbox").style.display = "none";
 } // closeLightBox 


 function fetchEpisodeData(showId) {
     
  console.log("fetching query for episodeID: " + showId);
  
  fetch('http://api.tvmaze.com/episodes/' + showId)  
    .then(response => response.json())
    .then(data => showLightBox(data));
    
} // fetch episodes



