const hiddenMessage = document.getElementById('hiddenMessage');
const wordContainer = document.getElementById('wordContainer');

const popupCont = document.querySelector('.popupContainer');
const popup = document.getElementById('popup');
const noButton = document.getElementById('noButton');
const yesButton = document.getElementById('yesButton');
let timeoutId;

// Track the revealed key words
let revealedCount = 0;

wordContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('word')) {
    const isKeyWord = e.target.dataset.key === 'true';
    if (isKeyWord) {
      const wordText = e.target.textContent;
      const targetWord = [...hiddenMessage.children].find(
        (span) => span.dataset.key === wordText
      );

      if (targetWord) {
        // Get the target position of the hidden word
        e.target.style.boxShadow = 'none';
        e.target.style.background = 'transparent';
        const rect = targetWord.getBoundingClientRect();

        // Get the position of the clicked word
        const clickedWord = e.target;
        const clickedRect = clickedWord.getBoundingClientRect();

        // Calculate the position difference
        const diffX = rect.left - clickedRect.left - 20;
        const diffY = rect.top - clickedRect.top - 8;

        // Move the clicked word to the target word's position
        clickedWord.style.position = 'absolute';
        clickedWord.style.left = `${clickedRect.left}px`;
        clickedWord.style.top = `${clickedRect.top}px`;
        clickedWord.style.transition = 'transform 1s ease-in-out';

        // Animate the movement
        setTimeout(() => {
          clickedWord.style.transform = `translate(${diffX}px, ${diffY}px)`;
        }, 10);

        // Once the animation is complete, reveal the word and update the styles
        setTimeout(() => {
          // targetWord.style.visibility = 'visible';
          clickedWord.remove();
          targetWord.classList.add("show");
        }, 1000);

        revealedCount++;
      }
    } else {
      // Make dummy word vanish
      e.target.style.boxShadow = '0 0 20px rgba(255, 50, 50, 0.7)';
      e.target.classList.add('shake'); // Add the shake class
      setTimeout(() => {
        e.target.classList.remove('shake'); // Remove the class after animation ends
      }, 500);
      e.target.classList.add('vanish');
      setTimeout(() => {
        e.target.remove();
      }, 1000);
    }

    // Check if all key words are revealed
    const totalKeyWords = hiddenMessage.querySelectorAll('.hidden-word[data-key]').length;
    if (revealedCount === totalKeyWords) {
      // Run the remaining code to reveal the hidden message
      document.querySelector('.divider').classList.add('vanish');
      [...wordContainer.querySelectorAll('.word[data-key="false"]')].forEach((dummy) => {
        dummy.classList.add('vanish');
        setTimeout(() => dummy.remove(), 500);
      });
      
      setTimeout(() => {
        hiddenMessage.classList.add('revealed');
        popupCont.classList.add("show")
      }, 1000);
      
      yesButton.addEventListener('click', () => {
        popupCont.classList.add('hide');
        audio.play();
        setTimeout(() => {
          init();
          [...hiddenMessage.children].forEach((span) => {
            span.style.visibility = 'visible';
            span.style.opacity = 1;
          });
        }, 1500);
      });
    }
  }
});

const positions = [
  { x: 110, y: 30 },
  { x: 110, y: -90 },
  { x: -50, y: -90 },
  { x: -220, y: 30 },
  { x: -220, y: -90 }
];
const audio = document.getElementById('backgroundMusic');
let currentX = null;
let currentY = null;

noButton.addEventListener('mouseenter', () => {
  let randomIndex;
  let newPosition;
  
  // Keep picking a new position until it's different from the current one
  do {
    randomIndex = Math.floor(Math.random() * positions.length);
    newPosition = positions[randomIndex];
  } while (newPosition.x === currentX && newPosition.y === currentY);
  
  // Update the CSS variables
  currentX = newPosition.x;
  currentY = newPosition.y;
  
  noButton.style.setProperty('--x', `${currentX}px`);
  noButton.style.setProperty('--y', `${currentY}px`);
  noButton.classList.add('smooth-move');
  
  clearTimeout(timeoutId);
});

noButton.addEventListener('mouseleave', () => {
  // Set a timeout to bring the button back after 5 seconds
  timeoutId = setTimeout(() => {
    noButton.style.setProperty('--x', 0);
    noButton.style.setProperty('--y', 0);
  }, 2000); // 5 seconds of inactivity before resetting
});

var canvas;
var stage;
var container;
var captureContainers;
var captureIndex;

function init() {
	// create a new stage and point it at our canvas:
	canvas = document.getElementById("testCanvas");
	stage = new createjs.Stage(canvas);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	var w = canvas.width;
	var h = canvas.height;

	container = new createjs.Container();
	stage.addChild(container);

	captureContainers = [];
	captureIndex = 0;

	// create a large number of slightly complex vector shapes, and give them random positions and velocities:
	for (var i = 0; i < 150; i++) {
		var heart = new createjs.Shape();
		heart.graphics.beginFill(createjs.Graphics.getHSL(330 + Math.random() * 30, 30 + Math.random() * 30, 80 + Math.random() * 10));
    // heart.graphics.beginFill(createjs.Graphics.getHSL(330 + Math.random() * 30, 50 + Math.random() * 30, 75 + Math.random() * 10));
    // heart.graphics.beginFill(createjs.Graphics.getHSL(Math.random() * 30 - 45, 100, 50 + Math.random() * 30));
		heart.graphics.moveTo(0, -12).curveTo(1, -20, 8, -20).curveTo(16, -20, 16, -10).curveTo(16, 0, 0, 12);
		heart.graphics.curveTo(-16, 0, -16, -10).curveTo(-16, -20, -8, -20).curveTo(-1, -20, 0, -12);
		heart.y = -100;

		container.addChild(heart);
	}

	for (i = 0; i < 100; i++) {
		var captureContainer = new createjs.Container();
		captureContainer.cache(0, 0, w, h);
		captureContainers.push(captureContainer);
	}

	// start the tick and point it at the window so we can do some work before updating the stage:
	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.on("tick", tick);
}

function tick(event) {
	var w = canvas.width;
	var h = canvas.height;
	var l = container.numChildren;

	captureIndex = (captureIndex + 1) % captureContainers.length;
	stage.removeChildAt(0);
	var captureContainer = captureContainers[captureIndex];
	stage.addChildAt(captureContainer, 0);
	captureContainer.addChild(container);

	for (var i = 0; i < l; i++) {
		 var heart = container.getChildAt(i);

		 if (heart.y < -50) {
			  heart._x = Math.random() * w;
			  heart.y = h * (1 + Math.random()) + 50;
			  heart.perX = (1 + Math.random() * 2) * h;
			  heart.offX = Math.random() * h;
			  heart.ampX = heart.perX * 0.1 * (0.15 + Math.random());
			  heart.velY = -Math.random() * 4 - 2; // INCREASED SPEED
			  heart.scale = Math.random() * 2 + 1;
			  heart._rotation = Math.random() * 40 - 20;
			  heart.alpha = Math.random() * 0.75 + 0.05;
			  heart.compositeOperation = Math.random() < 0.33 ? "lighter" : "source-over";
		 }

		 var int = (heart.offX + heart.y) / heart.perX * Math.PI * 2;
		 heart.y += heart.velY * heart.scaleX / 2;
		 heart.x = heart._x + Math.cos(int) * heart.ampX;
		 heart.rotation = heart._rotation + Math.sin(int) * 30;
	}

	captureContainer.updateCache("source-over");
	stage.update(event);
}

