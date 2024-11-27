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
          targetWord.style.visibility = 'visible';
          clickedWord.remove();
        }, 1000);

        targetWord.classList.add("show");
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
        console.log(popupCont.classList)
        setTimeout(() => {
          [...hiddenMessage.children].forEach((span) => {
            span.style.visibility = 'visible';
            span.style.opacity = 1;
          });
        }, 1000);
      });
    }
  }
});

noButton.addEventListener('mouseenter', () => {
  const randomX = Math.floor(Math.random() * 200 - 100); // Random X position
  const randomY = Math.floor(Math.random() * 200 - 100); // Random Y position

  noButton.style.setProperty('--x', `${randomX}px`);
  noButton.style.setProperty('--y', `${randomY}px`);
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