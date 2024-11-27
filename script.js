const hiddenMessage = document.getElementById('hiddenMessage');
const wordContainer = document.getElementById('wordContainer');

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

        // targetWord.style.fontWeight = 'bold'
        // targetWord.style.opacity = 1;
        // targetWord.style.color = "#FF69B4";
        targetWord.classList.add("show")

        // Increment the revealed count
        revealedCount++;
      }
    } else {
      // Make dummy word vanish
      e.target.style.boxShadow = '0 0 20px rgba(255, 50, 50, 0.7)'
      e.target.classList.add('shake'); // Add the shake class
      setTimeout(() => {
        e.target.classList.remove('shake'); // Remove the class after animation ends
      }, 500);
      e.target.classList.add('vanish');
      setTimeout(() => {
        e.target.remove()
      }, 1000);
    }

    // Check if all key words are revealed
    const totalKeyWords = hiddenMessage.querySelectorAll('.hidden-word[data-key]').length;
    if (revealedCount === totalKeyWords) {

      document.querySelector('.divider').classList.add('vanish');
      // Make all remaining dummy words vanish
      [...wordContainer.querySelectorAll('.word[data-key="false"]')].forEach((dummy) => {
        dummy.classList.add('vanish');
        setTimeout(() => dummy.remove(), 500);
      });

      setTimeout(() => {
        hiddenMessage.classList.add('revealed');
      }, 1000);

      // Reveal non-key words in the hidden message
      setTimeout(() => {
        [...hiddenMessage.children].forEach((span) => {
          span.style.visibility = 'visible';
          span.style.opacity = 1;
        });
      }, 3000);
    }
  }
});

const button = document.getElementById('shake-button');

button.addEventListener('click', () => {
  button.classList.add('shake'); // Add the shake class
  setTimeout(() => {
    button.classList.remove('shake'); // Remove the class after animation ends
  }, 500); // Match the duration of the animation
});
