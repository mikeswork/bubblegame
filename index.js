var shrinkPx = 4;

var gamePaused = false;
var scoreText;
var speedSlider;
var dotSpeed;
var content;
var moveDotsLoopId;

function bodyLoaded() {
  content = document.getElementById('content');
  scoreText = document.getElementById('score');
  speedSlider = document.getElementById("speedslider");
  dotSpeed = adjustSpeed(speedSlider.value);
  
  var mainLoopId = setInterval(mainLoop, 1000);
  moveDotsLoopId = setInterval(moveDotsLoop, dotSpeed);
}

function startOrPause() {
  var startPauseBtn = document.getElementById("start");
  
  if (gamePaused) {
    gamePaused = false;
    startPauseBtn.innerHTML = "Pause";
  } else {
    gamePaused = true;
    startPauseBtn.innerHTML = "Start";
  }
}

function changeSpeed() {
  dotSpeed = adjustSpeed(speedSlider.value);
  clearInterval(moveDotsLoopId);
  moveDotsLoopId = setInterval(moveDotsLoop, dotSpeed);
}

// Changes to dot speed at lower end of slider (technically higher end since slider is rtl direction)
// are more subtle than at higher end (lower). This function changes the curve to accomodate for this.
function adjustSpeed(sliderValue) {
  // When sliderValue is 10 adjustByX is 0 since the formula divides into 0. When it's 100, due to ternary operator it's also 0.
  // This is exactly what we want since we shouldn't change the slider min and max values (i.e. we want speeds of 10 and 100).
  var adjustByX = (((((sliderValue-10)/100) * 100) / 3) * (sliderValue == 100 ? 0 : 1));
  return sliderValue - adjustByX;
}

function mainLoop() {
  if (!gamePaused)
  { 
    createDot();
  }
}

function createDot() {
  var dot = document.createElement("div");
  dot.className = "dot";
  
  // Randomly determine dot size
  var dotSize = getRandInt(10, 100);
  dot.style.width = dot.style.height = dotSize + "px";

  content.appendChild(dot);
  
  dot.style.left = getRandInt(1, window.innerWidth - dot.clientWidth) + "px";
  dot.style.top = -dot.clientHeight + "px";
  
  dot.addEventListener("click", clickDot);
  function clickDot() {
    if (!gamePaused)
    {
      var currScore = parseInt(scoreText.innerHTML);
    
      var pointsForDot = Math.round(11 - ((dotSize / 100) * 10));
      currScore += pointsForDot;
      scoreText.innerHTML = currScore;
      
      var width = dotSize;
      var height = dotSize;
      var xpos = dot.offsetLeft;
      var ypos = dot.offsetTop;
 
      // Animate dot shrinking before removing it
      var shrinkFuncId = setInterval(shrink, 1);
      function shrink() {
        if (width <= 0) {
          clearInterval(shrinkFuncId);
          content.removeChild(dot);
        } else {
          width -= shrinkPx;
          height -= shrinkPx;
          dot.style.width = width + 'px';
          dot.style.height = height + 'px';
      
          // Shift dot slightly while it's shrinking so that it shrinks to center not upper-left
          ypos += shrinkPx/2;
          xpos += shrinkPx/2;
          dot.style.top = ypos + 'px';
          dot.style.left = xpos + 'px';
        }
      }
    }
  }
  
}

function moveDotsLoop() {
  if (!gamePaused)
  { 
    var dots = content.getElementsByClassName('dot');
    for (var i = 0; i < dots.length; i++)
    {
      var currDot = dots[i];
      
      var newPos = currDot.offsetTop + 1;
      
      currDot.style.backgroundColor = "hsl(" + ((dotSpeed*2.3)-20) + ", 35%, 50%)";
        
      if (newPos > window.innerHeight)
      {
        // Remove dot if it has moved outside window
        content.removeChild(currDot);
      }
      else
      {
        currDot.style.top = newPos + "px";
      } 
    }
  }
}

function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
