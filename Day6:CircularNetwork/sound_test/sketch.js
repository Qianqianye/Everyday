// var song;

// function setup() {
//   song = loadSound('mio-mix-baby-bass.mp3');
// }

// function mousePressed() {
//   if ( song.isPlaying() ) { // .isPlaying() returns a boolean
//     song.stop();

//   } else {
//     song.play();
//   }
// }

// function play(){
//        var audio = document.getElementById("mio-mix-baby-bass.mp3");
//        audio.play();
//                  }


var playMode = 'sustain';
var sample;

function setup() {
  createCanvas(710,50);
  soundFormats('mp3', 'ogg');
  sample = loadSound('mio-mix-baby-bass.mp3');
}


function mouseClicked() {
  sample.play();
}
function keyPressed(k) {
    togglePlayMode();
}





//     }
// }