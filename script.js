const suits = ['♦', '♥', '♣', '♠'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let deck = [];
let playerHand = [];
let dealerHand = [];

function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
}

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function getCardValue(card) {
  if (['J', 'Q', 'K'].includes(card.value)) return 10;
  if (card.value === 'A') return 11;
  return parseInt(card.value);
}

function calculateScore(hand) {
  let score = 0;
  let aces = 0;

  for (let card of hand) {
    score += getCardValue(card);
    if (card.value === 'A') aces++;
  }

  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }

  return score;
}

function startGame() {
  createDeck();
  shuffleDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  updateUI(false);
  document.getElementById('status').textContent = 'Game started. Your move!';
}

function hit() {
  playerHand.push(deck.pop());
  updateUI(false);

  if (calculateScore(playerHand) > 21) {
    endGame("You busted! Dealer wins.");
  }
}

function stand() {
  while (calculateScore(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }

  updateUI(true);
  determineWinner();
}

function determineWinner() {
  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  if (dealerScore > 21) {
    endGame("Dealer busted! You win!");
  } else if (playerScore > dealerScore) {
    endGame("You win!");
  } else if (dealerScore > playerScore) {
    endGame("Dealer wins!");
  } else {
    endGame("It's a tie!");
  }
}

function endGame(message) {
  document.getElementById('status').textContent = message;
  updateUI(true);
}

// 🧩 SPRITE SHEET MAPPING FUNCTION
function getCardPosition(value, suit) {
  const valueOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const suitOrder = ['♦', '♥', '♣', '♠']; // top to bottom

  const col = valueOrder.indexOf(value);
  const row = suitOrder.indexOf(suit);

  const x = col * 64;
  const y = row * 89;

  return `-${x}px -${y}px`;
}

// 🖼️ UPDATE UI FUNCTION
function updateUI(showDealer = false) {
  const playerHandDiv = document.getElementById('player-hand');
  const dealerHandDiv = document.getElementById('dealer-hand');

  playerHandDiv.innerHTML = '';
  dealerHandDiv.innerHTML = '';

  for (let card of playerHand) {
    const div = document.createElement('div');
    div.className = 'card';
    div.style.backgroundPosition = getCardPosition(card.value, card.suit);
    playerHandDiv.appendChild(div);
  }

  dealerHand.forEach((card, index) => {
    const div = document.createElement('div');
    div.className = 'card';
    if (showDealer || index === 0) {
      div.style.backgroundPosition = getCardPosition(card.value, card.suit);
    } else {
      div.style.backgroundColor = 'black'; // placeholder for back of card
    }
    dealerHandDiv.appendChild(div);
  });

  const dealerScore = showDealer ? calculateScore(dealerHand) : '??';
  document.getElementById('status').textContent += ` (Player: ${calculateScore(playerHand)}, Dealer: ${dealerScore})`;
}
