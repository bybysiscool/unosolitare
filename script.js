const colors = ["red", "blue", "green", "yellow"];
const numbers = [...Array(10).keys(), ...Array(10).keys()];
const specialCards = ["Skip", "Reverse", "Draw Two"];
const deck = [];
let playerHand = [];
let discardPile = [];
let chosenColor = null;
let drawCount = 0;
const maxDraws = 3; // Limit consecutive draws

// Create and shuffle deck
function createDeck() {
    deck.length = 0;
    colors.forEach(color => {
        numbers.forEach(num => deck.push({ color, value: num }));
        specialCards.forEach(type => deck.push({ color, value: type }));
    });

    for (let i = 0; i < 4; i++) {
        deck.push({ color: "wild", value: "Wild" });
        deck.push({ color: "wild", value: "Wild Draw Four" });
    }

    shuffle(deck);
}

// Shuffle function with animation
function shuffle(array) {
    let deckElement = document.getElementById("deck");
    deckElement.classList.add("shuffling");

    setTimeout(() => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        deckElement.classList.remove("shuffling");
    }, 1000);
}

// Start game
function startGame() {
    createDeck();
    playerHand.length = 0;
    discardPile.length = 0;
    drawCount = 0;

    for (let i = 0; i < 7; i++) {
        playerHand.push(deck.pop());
    }

    discardPile.push(deck.pop());
    updateUI();
}

// Draw card with animation
function drawCard() {
    if (deck.length === 0) return;
    if (drawCount >= maxDraws) {
        alert("You can't draw more than 3 cards in a row!");
        return;
    }

    let newCard = deck.pop();
    playerHand.push(newCard);
    drawCount++;

    let cardDiv = document.createElement("div");
    cardDiv.classList.add("card", "back");
    cardDiv.innerText = "1つ";
    document.getElementById("deck").appendChild(cardDiv);

    setTimeout(() => {
        cardDiv.remove();
        updateUI();
    }, 500);
}

// Play a card
function playCard(index) {
    let card = playerHand[index];
    let topCard = discardPile[discardPile.length - 1];

    if (card.color === "wild") {
        document.getElementById("color-picker").classList.remove("hidden");
        discardPile.push(playerHand.splice(index, 1)[0]);
        updateUI();
    } else if (card.color === topCard.color || card.value === topCard.value || chosenColor === card.color) {
        discardPile.push(playerHand.splice(index, 1)[0]);
        chosenColor = null;
        drawCount = 0;
        updateUI();
    } else {
        alert("Invalid move! You can only play matching colors or numbers.");
    }
}

// Set color for Wild card
function setColor(color) {
    chosenColor = color;
    document.getElementById("color-picker").classList.add("hidden");
    updateUI();
}

// Update UI
function updateUI() {
    let discardPileDiv = document.getElementById("discard-pile");
    let topCard = discardPile[discardPile.length - 1];
    discardPileDiv.innerHTML = `<div class="card ${topCard.color}">${topCard.value}</div>`;

    let playerHandDiv = document.getElementById("player-hand");
    playerHandDiv.innerHTML = "Your Hand:";
    playerHand.forEach((card, index) => {
        let cardDiv = document.createElement("div");
        cardDiv.classList.add("card", card.color);
        cardDiv.innerText = card.value;
        cardDiv.onclick = () => playCard(index);
        playerHandDiv.appendChild(cardDiv);
    });

    if (playerHand.length === 0) {
        alert("You won!");
        document.getElementById("restart").classList.remove("hidden");
    }
}

// Restart Game
function restartGame() {
    document.getElementById("restart").classList.add("hidden");
    startGame();
}

// Start the game
startGame();
