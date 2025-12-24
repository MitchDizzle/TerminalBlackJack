export class Statistics {
  constructor() {
    this.gamesPlayed = 0;
    this.gamesWon = 0;
    this.gamesLost = 0;
    this.gamesTied = 0;
    this.blackjacks = 0;
    this.busts = 0;
    this.dealerBusts = 0;
    this.runningCount = 0;
    this.trueCount = 0;
  }

  recordWin(isBlackjack = false) {
    this.gamesPlayed++;
    this.gamesWon++;
    if (isBlackjack) this.blackjacks++;
  }

  recordLoss(isBust = false) {
    this.gamesPlayed++;
    this.gamesLost++;
    if (isBust) this.busts++;
  }

  recordTie() {
    this.gamesPlayed++;
    this.gamesTied++;
  }

  recordDealerBust() {
    this.dealerBusts++;
  }

  updateCount(card) {
    this.runningCount += card.getHiLoValue();
  }

  calculateTrueCount(decksRemaining) {
    if (decksRemaining <= 0) return 0;
    this.trueCount = Math.round(this.runningCount / decksRemaining);
    return this.trueCount;
  }

  resetCount() {
    this.runningCount = 0;
    this.trueCount = 0;
  }

  getWinRate() {
    if (this.gamesPlayed === 0) return 0;
    return ((this.gamesWon / this.gamesPlayed) * 100).toFixed(2);
  }

  display(decksRemaining) {
    console.log('\n========== STATISTICS ==========');
    console.log(`Games Played: ${this.gamesPlayed}`);
    console.log(`Games Won: ${this.gamesWon}`);
    console.log(`Games Lost: ${this.gamesLost}`);
    console.log(`Games Tied: ${this.gamesTied}`);
    console.log(`Win Rate: ${this.getWinRate()}%`);
    console.log(`Blackjacks: ${this.blackjacks}`);
    console.log(`Player Busts: ${this.busts}`);
    console.log(`Dealer Busts: ${this.dealerBusts}`);
    console.log('--------------------------------');
    console.log(`Hi-Lo Running Count: ${this.runningCount > 0 ? '+' : ''}${this.runningCount}`);
    console.log(`Hi-Lo True Count: ${this.calculateTrueCount(decksRemaining) > 0 ? '+' : ''}${this.trueCount}`);
    console.log('================================\n');
  }
}
