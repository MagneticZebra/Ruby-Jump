let board;
let boardWidth = 750; // board width
let boardHeight = 250; // board height
let context;

let rubyWidth = 85; // Ruby width
let rubyHeight = 100; // Ruby height
let rubyX = 50; // x position of Ruby
let rubyY = boardHeight - rubyHeight;
let rubyImg;

let ruby = {
  x: rubyX,
  y: rubyY,
  width: rubyWidth,
  height: rubyHeight,
};

let carArray = [];

// widths of obstacles
let car1Width = 140;
let car2Width = 130;
let car3Width = 90;

let carHeight = 60; // height of obstacles
let carX = 700;
let carY = boardHeight - carHeight;

let car1Img;
let car2Img;
let car3Img;

let velocityX = -10; // speed of obstacles
let velocityY = 0;
let gravity = 0.4; // gravity applied on Ruby

let gameOver = false;
let score = 0; // start off with 0 cash

let gameStarted = false;

// Event listener for start and restart game
document.addEventListener("keydown", function (event) {
  if (event.code === "Space" && !gameStarted) {
    gameStarted = true;
    startGame();
  } else if (event.code === "Space" && gameOver) {
    resetGame();
  }
});

// Called when the game starts
function startGame() {
  img = new Image();
  img.src =
    "https://storage.googleapis.com/msgsndr/ctWaKCFlerymUvyeL9wq/media/657df366a08dc5481c02fa82.jpeg";

  var backgroundMusic = document.getElementById("backgroundMusic");
  backgroundMusic.play();

  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;

  context = board.getContext("2d");

  // Ruby image
  rubyImg = new Image();
  rubyImg.src =
    "https://storage.googleapis.com/msgsndr/ctWaKCFlerymUvyeL9wq/media/657bccead28f4cf1a92ca36f.png";
  rubyImg.onload = function () {
    context.drawImage(rubyImg, ruby.x, ruby.y, ruby.width, ruby.height);
  };

  img.onload = function () {
    context.drawImage(img, 0, 0, board.width, board.height);
  };

  // Car 1 image
  car1Img = new Image();
  car1Img.src =
    "https://storage.googleapis.com/msgsndr/ctWaKCFlerymUvyeL9wq/media/657bcceaa08dc5c5b9f373ac.png";

  // Car 2 image
  car2Img = new Image();
  car2Img.src =
    "https://storage.googleapis.com/msgsndr/ctWaKCFlerymUvyeL9wq/media/657bccead28f4ce42c2ca370.png";

  // Car 2 image
  car3Img = new Image();
  car3Img.src =
    "https://storage.googleapis.com/msgsndr/ctWaKCFlerymUvyeL9wq/media/657bccead28f4c1bb82ca36e.png";

  // Cash bag image
  cashBagImg = new Image();
  cashBagImg.src =
    "https://storage.googleapis.com/msgsndr/ctWaKCFlerymUvyeL9wq/media/657df14e5a248f622c7bca58.png";

  requestAnimationFrame(update);
  setInterval(placeCar, 1000);
  document.addEventListener("keydown", moveRuby);
}

// Updating variables during the game
function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }

  context.clearRect(0, 0, board.width, board.height);

  velocityY += gravity;
  ruby.y = Math.min(ruby.y + velocityY, rubyY);
  context.drawImage(rubyImg, ruby.x, ruby.y, ruby.width, ruby.height);

  for (let i = 0; i < carArray.length; i++) {
    let car = carArray[i];
    car.x += velocityX;

    context.drawImage(car.img, car.x, car.y, car.width, car.height);

    // Collision deteciton
    if (detectCollision(ruby, car)) {
      gameOver = true;
      rubyImg.src =
        "https://storage.googleapis.com/msgsndr/ctWaKCFlerymUvyeL9wq/media/657bccea5a248fa3da6ba5a8.png"; // changes to dead Ruby
      rubyImg.onload = function () {
        context.drawImage(rubyImg, ruby.x, ruby.y, ruby.width, ruby.height);
      };
      var backgroundMusic = document.getElementById("backgroundMusic");
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }
  }

  drawCashBags();

  context.fillStyle = "white";
  context.font = "20px courier";
  score++;
  context.fillText("Cash: $" + score.toString(), 5, 20); // displays cash
}

// Moving ruby
function moveRuby(e) {
  if (gameOver) {
    return;
  }

  if ((e.code == "Space" || e.code == "ArrowUp") && ruby.y == rubyY) {
    velocityY = -10.5; // adjusts how high ruby jumps
  }
}

// Placing obstacles
function placeCar() {
  if (gameOver) {
    return;
  }

  let car = {
    img: null,
    x: carX,
    y: carY,
    width: null,
    height: carHeight,
  };

  let placeCarChance = Math.random();

  if (placeCarChance > 0.9) {
    car.img = car3Img;
    car.width = car3Width;
    carArray.push(car);
  } else if (placeCarChance > 0.7) {
    car.img = car2Img;
    car.width = car2Width;
    carArray.push(car);
  } else if (placeCarChance > 0.5) {
    car.img = car1Img;
    car.width = car1Width;
    carArray.push(car);
  }

  if (carArray.length > 5) {
    carArray.shift();
  }
}

// Determines if a collision occurs
function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// Placing cash bags
function drawCashBags() {
  var score1 = Math.floor(score);
  var maxBags = 3; // Maximum number of bags to display
  var bagSpacing = 40; // Spacing between bags
  var bagSize = 30; // Size of the cash bag image

  for (var i = 0; i < Math.min(score1, maxBags); i++) {
    if (i == 0 && score >= 1000) {
      context.drawImage(
        cashBagImg,
        boardWidth - (i + 1.7) * bagSpacing,
        10,
        bagSize,
        bagSize
      );
      context.fillText("Program Affiliate", 300, 20);
      score = score + 200;
    } else if (i == 1 && score >= 300000) {
      context.clearRect(300, 0, 220, 40);
      context.drawImage(
        cashBagImg,
        boardWidth - (i + 1.7) * bagSpacing,
        10,
        bagSize,
        bagSize
      );
      context.fillText("Dropservicing", 300, 20);
      score = score + 300;
    } else if (i == 2 && score >= 1000000) {
      context.clearRect(300, 0, 200, 40);
      context.drawImage(
        cashBagImg,
        boardWidth - (i + 1.7) * bagSpacing,
        10,
        bagSize,
        bagSize
      );
      context.fillText("Marketing Agency", 300, 20);
      score = score + 400;
    }
  }
}

// Reset game funtion
function resetGame() {
  carArray = [];
  velocityY = 0;
  gameOver = false;
  score = 0;

  ruby.y = rubyY;
  rubyImg.src =
    "https://storage.googleapis.com/msgsndr/ctWaKCFlerymUvyeL9wq/media/657bccead28f4cf1a92ca36f.png";

  rubyImg.onload = function () {
    context.drawImage(rubyImg, ruby.x, ruby.y, ruby.width, ruby.height);
  };

  // resets background music
  var backgroundMusic = document.getElementById("backgroundMusic");
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  backgroundMusic.play();
}
