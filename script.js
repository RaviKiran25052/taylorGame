const hiddenMessage = document.getElementById('hiddenMessage');
const wordContainer = document.getElementById('wordContainer');

const popupCont = document.querySelector('.popupContainer');
const popup = document.getElementById('popup');
const noButton = document.getElementById('noButton');
const yesButton = document.getElementById('yesButton');
let timeoutId;

function goFullScreen() {
  const element = document.documentElement; // or use a specific element like document.body
  if (element.requestFullscreen) {
    element.requestFullscreen(); // For most browsers
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen(); // For Firefox
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen(); // For Chrome, Safari and Opera
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen(); // For IE/Edge
  }
}

const popupCard = document.getElementById('popupCard');
const overlayContainer = document.getElementById('overlayContainer');

overlayContainer.addEventListener('click', () => {
  popupCard.style.animation = 'fadeOut 1s forwards';

  setTimeout(() => {
    popupCard.style.display = 'none';
    overlayContainer.style.display = 'none';
  }, 1000);
});

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
  for (var i = 0; i < 250; i++) {
    var heart = new createjs.Shape();
    heart.graphics.beginFill(createjs.Graphics.getHSL(330 + Math.random() * 30, 50 + Math.random() * 30, 75 + Math.random() * 10));
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
      heart.velY = -Math.random() * 6 - 4; // INCREASED SPEED
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

function calculateMonthsAndDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const previousMonth = new Date(end.getFullYear(), end.getMonth(), 0); // Last day of the previous month
    days += previousMonth.getDate();
  }

  return { months, days };
}

const today = "2025-02-14";
const startDate = "2024-07-17";
const result = calculateMonthsAndDays(startDate, today);

// Set the value in the HTML element
document.getElementById("duration").textContent = `${result.months} months, ${result.days} days`;

const containerCard = document.querySelector('.container-card');
const buttonToggle = document.getElementById('toggleButton');
const cardGlass = document.getElementById('card');
const newMessageDiv = document.getElementById('main-container');
let isOpen = false;

buttonToggle.addEventListener('click', () => {
  buttonToggle.style.animation = 'none';
  if (!isOpen) {
    cardGlass.style.height = '350px';
    cardGlass.querySelector('.card-text-content').style.opacity = '1';
  } else {
    buttonToggle.style.animation = 'blinking-white-shadow 1.5s infinite';
    cardGlass.style.height = '0';
    cardGlass.querySelector('.card-text-content').style.opacity = '0';
  }
  isOpen = !isOpen;
});

const contactNameInput = document.getElementById('contact-name');

const daySelect = document.getElementById("day");
const monthSelect = document.getElementById("month");
const yearSelect = document.getElementById("year");

const submitButton = document.getElementById('submit-btn');

for (let i = 1; i <= 31; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = i;
  daySelect.appendChild(option);
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
months.forEach((month, index) => {
  const option = document.createElement("option");
  option.value = index + 1;
  option.textContent = month;
  monthSelect.appendChild(option);
});

const currentYear = new Date().getFullYear();
for (let i = currentYear; i >= 2023; i--) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = i;
  yearSelect.appendChild(option);
}

function isInputFilled() {
  return contactNameInput.value.trim() !== '' &&
    daySelect.value !== '' &&
    monthSelect.value !== '' &&
    yearSelect.value !== '';
}

submitButton.addEventListener('mouseenter', () => {
  if (!isInputFilled()) {
    if (submitButton.classList.contains('right-button')) {
      submitButton.classList.remove('right-button');
      submitButton.classList.add('left-button');
    } else {
      submitButton.classList.remove('left-button');
      submitButton.classList.add('right-button');
    }
  }
});

function checkInputAndDate() {
  const name = contactNameInput.value.trim().toLowerCase(); // Convert name input to lowercase
  const selectedDay = parseInt(daySelect.value);
  const selectedMonth = parseInt(monthSelect.value);
  const selectedYear = parseInt(yearSelect.value);

  if ((name === 'taylor swift' || name === 'taylorswift' || name === 'swiftie') && ((selectedDay === 31 && selectedMonth === 5) || (selectedDay === 17 && selectedMonth === 7)) && selectedYear === 2024) {
    buttonToggle.textContent = '🔓';
    buttonToggle.style.border = 'solid 3px green';
    buttonToggle.style.boxShadow = '0 0 15px rgb(0, 255, 0)';
    containerCard.style.opacity = 0;
    setTimeout(() => {
      containerCard.style.display = 'none';
      document.getElementById('overlayContainer').style.display = 'flex';
    }, 1000);


    // After fade out is complete, show the new message
  } else {
    buttonToggle.classList.add('lock'); // Add the lock class
    setTimeout(() => {
      buttonToggle.classList.remove('lock'); // Remove the class after animation ends
    }, 500);
    setTimeout(() => {
      cardGlass.querySelector('.card-text-content').style.opacity = '0';
      cardGlass.style.height = '0';
      contactNameInput.value = '';
      daySelect.value = '';
      monthSelect.value = '';
      yearSelect.value = '';
      isOpen = !isOpen;
    }, 1000);
  }
}

document.getElementById('start-button').addEventListener('click', () => {
  document.getElementById('popupCard').style.animation = 'fadeOut 1s forwards';

  setTimeout(() => {
    document.getElementById('popupCard').style.display = 'none';
    document.getElementById('overlayContainer').style.display = 'none';
  }, 1000);
  setTimeout(() => {
    containerCard.classList.add('fade-out-effect');
    newMessageDiv.classList.remove('hidden-element');
    newMessageDiv.classList.add('fade-in-effect');
    goFullScreen();
  }, 1500);
});

submitButton.addEventListener('click', () => {
  checkInputAndDate();

});
