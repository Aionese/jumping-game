document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const doodler = document.createElement('div');
  let doodlerLeftSpace = 40;
  let startPoint = 100;
  let doodlerBootomSpace = startPoint;
  let isGameOver = false;
  let platformCount = 5;
  let platforms = [];
  let isJumping = true;
  let isGoingLeft = false;
  let isGoingRight = false;
  let upTimerId;
  let downTimerId;
  let leftTimerId;
  let rightTimerId; 
  let score = 0;


  //create doodler
  function createDoodler() {
    grid.appendChild(doodler);
    doodler.classList.add('doodler');
    doodlerLeftSpace = platforms[0].left;
    doodler.style.left = doodlerLeftSpace + 'px';
    doodler.style.bottom = doodlerBootomSpace + 'px';
  }

  //create constructor
  class Platform {
    constructor(newPlatBottom) {
      this.bottom = newPlatBottom;
      this.left = Math.random() * 415;
      this.visual = document.createElement('div');

      const visual = this.visual;
      visual.classList.add('platform');
      visual.style.left = this.left + 'px';
      visual.style.bottom = this.bottom + 'px';
      grid.appendChild(visual);
    }
  }

  //create platforms
  function createPlatforms() {
    for(let i = 0; i < platformCount; i++) {
      let platGap = 768 / platformCount;
      let newPlatBottom = 100 + i * platGap;
      let newPlatform = new Platform(newPlatBottom);
      platforms.push(newPlatform);
      console.log(platforms);

    }
  }

  //create the moving platforms
  function movePlatforms() {
    if(doodlerBootomSpace > 50) {
      platforms.forEach(platform => {
        platform.bottom -= 4;
        let visual = platform.visual;
        visual.style.bottom = platform.bottom + 'px';

        if (platform.bottom < 15) {
          let firstPlatform = platforms[0].visual;
          firstPlatform.classList.remove('platform');
          platforms.shift();
          score++;
          console.log(platforms)

          let newPlatform = new Platform(768);
          platforms.push(newPlatform)
        }
      })
    }
  }

  //make the doodler jump
  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(function () {
      doodlerBootomSpace += 20;
      doodler.style.bottom = doodlerBootomSpace + 'px';
      if(doodlerBootomSpace > startPoint + 300) {
        fall();
      }
    }, 20);
  }

  //make the doodler fall
  function fall() {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(function () {
      doodlerBootomSpace -= 4;
      doodler.style.bottom = doodlerBootomSpace + 'px';
      if(doodlerBootomSpace <= 0) {
        gameOver();
      }
      platforms.forEach(platform => {
        if (
          (doodlerBootomSpace >= platform.bottom) &&
          (doodlerBootomSpace <= platform.bottom + 15) &&
          ((doodlerLeftSpace + 60) >= platform.left) &&
          (doodlerLeftSpace <= (platform.left + 85)) &&
          !isJumping) {
            startPoint = doodlerBootomSpace;
            jump();
        }
      })
    }, 20);
  }

  function gameOver() {
    console.log( 'game over');
    isGameOver = true;
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild)
    }
    grid.innerHTML = score;
    clearInterval(downTimerId);
    clearInterval(upTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);

  }

  //Control the doodler with keyboard
  function control(e) {
    if(e.key === 'ArrowLeft') {
      //move to the left 
      moveLeft();
    } else if(e.key === 'ArrowRight') {
      //move to the right of the screen
      moveRight();
    } else if(e.key === 'ArrowUp') {
      //move up the doodler
      moveStraight();
    }
  }

  //move left function
  function moveLeft() {
    if(isGoingRight) {
      clearInterval(rightTimerId);
      // clearInterval(upTimerId);
      // clearInterval(downTimerId);
      isGoingRight = false;
    }
    isGoingLeft = true;
    leftTimerId = setInterval(function () {
      if(doodlerLeftSpace >= 0) {
        doodlerLeftSpace -= 5;
        doodler.style.left = doodlerLeftSpace + 'px'
      } else moveRight();
    }, 20)
  }

  //move right function
  function moveRight() {
    if(isGoingLeft) {
      clearInterval(leftTimerId);
      // clearInterval(upTimerId);
      // clearInterval(downTimerId);
      isGoingLeft = false;
    }
    isGoingRight = true;
    rightTimerId = setInterval(function () {
      if(doodlerLeftSpace <= 440) {
        doodlerLeftSpace += 5;
        doodler.style.left = doodlerLeftSpace + 'px'
      } else moveLeft();
    }, 20)
  }

  //move straight function
  function moveStraight() {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  
  }

  function start() {
    if(!isGameOver) {
      createPlatforms();
      createDoodler();
      setInterval(movePlatforms, 30);
      jump();
      document.addEventListener('keydown', control)
    }
  }
  //attach to button
  start();

  var doodlerPosition = doodler.getBoundingClientRect();
  console.log(doodlerPosition.top, doodlerPosition.right, doodlerPosition.bottom, doodlerPosition.left);
});