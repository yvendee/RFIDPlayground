const reader = document.getElementById('reader');
const cards = document.querySelectorAll('.card');
const resetBtn = document.getElementById('resetBtn');
const cardsContainer = document.getElementById('cardsContainer');

const initialPositions = [];

const cardInfo = {
  card1: { name: '00001', section: 'A', status: 'IN' },
  card2: { name: '00002', section: 'A', status: 'IN' },
  card3: { name: '00003', section: 'A', status: 'IN' },
  card4: { name: '00004', section: 'A', status: 'IN' },
  card5: { name: '00005', section: 'A', status: 'IN' }
};

function setInitialPositions() {
  const containerRect = cardsContainer.getBoundingClientRect();
  const centerX = containerRect.width / 2;

  const cardWidth = 100;
  const spacing = 20;
  const totalWidth = (cards.length * cardWidth) + ((cards.length - 1) * spacing);
  const startX = centerX - (totalWidth / 2);

  cards.forEach((card, index) => {
    const left = startX + (cardWidth + spacing) * index;
    const top = 0;
    card.style.left = left + 'px';
    card.style.top = top + 'px';
    initialPositions[index] = { left, top };
  });
}

let draggingCard = null;

cards.forEach(card => {
  card.addEventListener('mousedown', () => {
    draggingCard = card;
  });

  card.addEventListener('touchstart', () => {
    draggingCard = card;
  });
});

document.addEventListener('mouseup', () => {
  draggingCard = null;
});

document.addEventListener('touchend', () => {
  draggingCard = null;
});

document.addEventListener('mousemove', (e) => {
  if (draggingCard) {
    const containerRect = cardsContainer.getBoundingClientRect();
    draggingCard.style.left = (e.clientX - containerRect.left - draggingCard.offsetWidth / 2) + 'px';
    draggingCard.style.top = (e.clientY - containerRect.top - draggingCard.offsetHeight / 2) + 'px';
    checkCollision(draggingCard);
  }
});

document.addEventListener('touchmove', (e) => {
  if (draggingCard && e.touches.length > 0) {
    const containerRect = cardsContainer.getBoundingClientRect();
    draggingCard.style.left = (e.touches[0].clientX - containerRect.left - draggingCard.offsetWidth / 2) + 'px';
    draggingCard.style.top = (e.touches[0].clientY - containerRect.top - draggingCard.offsetHeight / 2) + 'px';
    checkCollision(draggingCard);
  }
});

function checkCollision(card) {
  const cardRect = card.getBoundingClientRect();
  const readerRect = reader.getBoundingClientRect();

  if (
    cardRect.left < readerRect.right &&
    cardRect.right > readerRect.left &&
    cardRect.top < readerRect.bottom &&
    cardRect.bottom > readerRect.top
  ) {
    const info = cardInfo[card.id];
    alert(`${card.innerText} detected by RFID Reader!`);

    // Send API request
    fetch('http://152.42.247.62:9000/log_karen_attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(info)
    }).then(res => res.json())
      .then(data => {
        console.log('API Response:', data);
      }).catch(err => {
        console.error('API Error:', err);
      });

    const cardIndex = parseInt(card.id.replace('card', '')) - 1;
    card.style.left = initialPositions[cardIndex].left + 'px';
    card.style.top = initialPositions[cardIndex].top + 'px';
    draggingCard = null;
  }
}

resetBtn.addEventListener('click', () => {
  cards.forEach((card, index) => {
    card.style.left = initialPositions[index].left + 'px';
    card.style.top = initialPositions[index].top + 'px';
  });
});

window.addEventListener('resize', setInitialPositions);
setInitialPositions();
