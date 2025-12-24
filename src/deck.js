import chalk from 'chalk';

export class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  getValue() {
    if (this.rank === 'A') return 11;
    if (['K', 'Q', 'J'].includes(this.rank)) return 10;
    return parseInt(this.rank);
  }

  getHiLoValue() {
    const value = this.getValue();
    if (value >= 10 || this.rank === 'A') return -1;
    if (value >= 7) return 0;
    return 1;
  }

  toString() {
    const cardStr = `${this.rank}${this.suit}`;
    // Red suits (hearts and diamonds)
    if (this.suit === '♥' || this.suit === '♦') {
      return chalk.bgRedBright(cardStr);
    }
    // Black suits (spades and clubs) - use gray
    return chalk.bgGray(cardStr);
  }
}

export class Deck {
  constructor(numberOfDecks = 1) {
    this.numberOfDecks = numberOfDecks;
    this.cards = [];
    this.dealtCards = [];
    this.initializeDeck();
  }

  initializeDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    this.cards = [];
    this.dealtCards = [];

    for (let d = 0; d < this.numberOfDecks; d++) {
      for (const suit of suits) {
        for (const rank of ranks) {
          this.cards.push(new Card(suit, rank));
        }
      }
    }

    this.shuffle();
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  dealCard() {
    if (this.cards.length === 0) {
      throw new Error('No cards left in deck');
    }
    const card = this.cards.pop();
    this.dealtCards.push(card);
    return card;
  }

  getTotalCards() {
    return this.numberOfDecks * 52;
  }

  getRemainingCards() {
    return this.cards.length;
  }

  getDealtCards() {
    return this.dealtCards.length;
  }

  shouldShuffle() {
    const totalCards = this.getTotalCards();
    const remainingCards = this.getRemainingCards();
    return remainingCards <= totalCards * 0.25;
  }

  reset() {
    this.initializeDeck();
  }
}
