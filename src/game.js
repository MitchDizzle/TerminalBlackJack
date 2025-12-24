import { Deck } from './deck.js';
import { Statistics } from './statistics.js';
import chalk from 'chalk';

export class BlackJackGame {
  constructor(numberOfDecks = 1) {
    this.deck = new Deck(numberOfDecks);
    this.statistics = new Statistics();
    this.playerHand = [];
    this.dealerHand = [];
    this.gameActive = true;
    this.lastResult = ' ';
  }

  calculateHandValue(hand) {
    let value = 0;
    let aces = 0;

    for (const card of hand) {
      const cardValue = card.getValue();
      value += cardValue;
      if (card.rank === 'A') aces++;
    }

    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }

    return value;
  }

  displayScoreboard() {
    const decksRemaining = (this.deck.getRemainingCards() / 52).toFixed(1);
    const trueCount = this.statistics.calculateTrueCount(parseFloat(decksRemaining));
    const runningCount = this.statistics.runningCount;

    console.log(chalk.cyan('═══════════════════════════════════════════════════════════════════'));
    console.log(chalk.bold('  TERMINAL BLACKJACK'));
    console.log(chalk.cyan('═══════════════════════════════════════════════════════════════════'));
    console.log(
      chalk.yellow(`  Cards: ${this.deck.getRemainingCards()}/${this.deck.getTotalCards()}`) +
      chalk.gray(' | ') +
      chalk.green(`W: ${this.statistics.gamesWon}`) +
      chalk.gray(' | ') +
      chalk.red(`L: ${this.statistics.gamesLost}`) +
      chalk.gray(' | ') +
      chalk.blue(`T: ${this.statistics.gamesTied}`) +
      chalk.gray(' | ') +
      chalk.magenta(`Win Rate: ${this.statistics.getWinRate()}%`)
    );
    console.log(
      chalk.yellow(`  Hi-Lo: `) +
      chalk.white(`R ${runningCount > 0 ? '+' : ''}${runningCount}`) +
      chalk.gray(' / ') +
      chalk.white(`T ${trueCount > 0 ? '+' : ''}${trueCount}`) +
      chalk.gray(' | ') +
      chalk.yellow(`BJ: ${this.statistics.blackjacks}`) +
      chalk.gray(' | ') +
      chalk.yellow(`Busts: P:${this.statistics.busts} D:${this.statistics.dealerBusts}`)
    );
    console.log(chalk.cyan('═══════════════════════════════════════════════════════════════════'));
  }

  displayHand(hand, hideFirst = false, label = 'Hand') {
    if (hideFirst) {
      return `${label}: ${chalk.bgGray('??')} ${hand.slice(1).map(c => c.toString()).join(' ')}`;
    } else {
      const value = this.calculateHandValue(hand);
      return `${label}: ${hand.map(c => c.toString()).join(' ')} ${chalk.gray(`(${value})`)}`;
    }
  }

  redrawScreen(message = '') {
    console.clear();
    this.displayScoreboard();
    console.log('');
    console.log(this.displayHand(this.dealerHand, this.gameInProgress, 'Dealer'));
    console.log(this.displayHand(this.playerHand, false, 'Player'));
    console.log('');
    console.log(this.lastResult);
    if (message) {
      console.log('');
      console.log(message);
    }
  }

  isBlackjack(hand) {
    return this.calculateHandValue(hand) === 21;
  }

  dealInitialCards() {
    this.playerHand = [];
    this.dealerHand = [];

    this.playerHand.push(this.deck.dealCard());
    this.dealerHand.push(this.deck.dealCard());
    this.playerHand.push(this.deck.dealCard());
    this.dealerHand.push(this.deck.dealCard());

    for (const card of [...this.playerHand, ...this.dealerHand]) {
      this.statistics.updateCount(card);
    }
  }

  async playerTurn(getSingleKey) {
    this.gameInProgress = true;

    while (true) {
      const playerValue = this.calculateHandValue(this.playerHand);

      if (playerValue > 21) {
        this.gameInProgress = false;
        this.redrawScreen(chalk.red.bold('PLAYER BUSTS!'));
        await this.sleep(1500);
        return 'bust';
      }

      if (playerValue === 21) {
        this.gameInProgress = false;
        this.redrawScreen(chalk.green.bold('PLAYER HAS 21!'));
        await this.sleep(1500);
        return 'stand';
      }

      this.redrawScreen(chalk.yellow('Press (H) to Hit, (S) to Stand, or (Q) to Quit'));

      const action = await getSingleKey();
      const choice = action.toLowerCase();

      if (choice === 'h') {
        const card = this.deck.dealCard();
        this.playerHand.push(card);
        this.statistics.updateCount(card);
        this.redrawScreen(chalk.cyan(`Drew: ${card.toString()}`));
        await this.sleep(800);
      } else if (choice === 's') {
        this.gameInProgress = false;
        return 'stand';
      } else if (choice === 'x') {
        // Hidden shuffle command
        this.redrawScreen(chalk.magenta.bold('🎴 Secret shuffle activated! 🎴'));
        await this.sleep(1000);
        await this.forceShuffle();
        this.redrawScreen(chalk.green('Deck reshuffled! Continue playing...'));
        await this.sleep(1500);
      } else if (choice === 'q') {
        this.gameActive = false;
        console.clear();
        this.displayScoreboard();
        console.log('');
        console.log(chalk.cyan.bold('Thanks for playing Terminal BlackJack!'));
        console.log('');
        process.exit(0);
      }
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async dealerTurn() {
    this.gameInProgress = false;
    this.redrawScreen(chalk.yellow.bold("DEALER'S TURN"));
    await this.sleep(1000);

    while (this.calculateHandValue(this.dealerHand) < 17) {
      const card = this.deck.dealCard();
      this.dealerHand.push(card);
      this.statistics.updateCount(card);
      this.redrawScreen(chalk.cyan(`Dealer draws: ${card.toString()}`));
      await this.sleep(1200);
    }

    const dealerValue = this.calculateHandValue(this.dealerHand);
    if (dealerValue > 21) {
      this.redrawScreen(chalk.red.bold('DEALER BUSTS!'));
      this.statistics.recordDealerBust();
      await this.sleep(1500);
      return 'bust';
    }

    this.redrawScreen(chalk.yellow(`Dealer stands at ${dealerValue}`));
    await this.sleep(1500);
    return 'stand';
  }

  async determineWinner() {
    const playerValue = this.calculateHandValue(this.playerHand);
    const dealerValue = this.calculateHandValue(this.dealerHand);
    const playerBlackjack = this.isBlackjack(this.playerHand);
    const dealerBlackjack = this.isBlackjack(this.dealerHand);

    if (playerBlackjack && dealerBlackjack) {
      this.lastResult = chalk.blue.bold('⚖  PUSH - Both have Blackjack!');
      this.statistics.recordTie();
    } else if (playerBlackjack) {
      this.lastResult = chalk.green.bold('★  BLACKJACK! YOU WIN! ★');
      this.statistics.recordWin(true);
    } else if (dealerBlackjack) {
      this.lastResult = chalk.red.bold('✖  Dealer Blackjack - You Lose');
      this.statistics.recordLoss();
    } else if (playerValue > dealerValue) {
      this.lastResult = chalk.green.bold('✓  YOU WIN!');
      this.statistics.recordWin();
    } else if (playerValue < dealerValue) {
      this.lastResult = chalk.red.bold('✖  YOU LOSE');
      this.statistics.recordLoss();
    } else {
      this.lastResult = chalk.blue.bold('⚖  PUSH (Tie)');
      this.statistics.recordTie();
    }
  }

  async performShuffleAnimation(customText = null) {
    const totalSteps = 30;

    // Colorful shuffle text with suit symbols
    const shuffleText = customText ||
      (chalk.red('♥') +
      chalk.gray('♠') +
      chalk.magenta.bold('  Shuffling deck - 25% cards remaining  ') +
      chalk.red('♦') +
      chalk.gray('♣'));

    // Calculate actual text length (without ANSI color codes)
    // Strip ANSI codes to get the real visible character count
    const plainText = shuffleText.replace(/\u001b\[[0-9;]*m/g, '');
    const textLength = plainText.length;

    // Calculate padding to center the progress bar under the text
    // Center the 30-char bar under the text
    const paddingLength = Math.max(0, Math.floor((textLength - totalSteps) / 2));

    for (let d = 0; d <= totalSteps; d++) {
      // Expand from center outward symmetrically
      const filled = d;
      const empty = totalSteps - d;
      const halfEmpty = Math.floor(empty / 2);

      // Color the progress bar based on completion
      let barColor;
      if (d < totalSteps / 3) {
        barColor = chalk.red; // 0-33% red
      } else if (d < (totalSteps * 2) / 3) {
        barColor = chalk.yellow; // 33-66% yellow
      } else {
        barColor = chalk.green; // 66-100% green
      }

      // Create symmetric expanding from center effect
      const leftEmpty = ' '.repeat(halfEmpty);
      const filledBar = '█'.repeat(filled);
      const rightEmpty = ' '.repeat(empty - halfEmpty);

      const bar = barColor(`${leftEmpty}${filledBar}${rightEmpty}`);

      // Use calculated padding for perfect centering
      const padding = ' '.repeat(paddingLength);
      this.lastResult = `${shuffleText}\n${padding}${bar}`;
      this.redrawScreen();
      await this.sleep(80);
    }

    await this.sleep(500);
    // Clear the lastResult after shuffle completes
    this.lastResult = ' ';
    this.deck.reset();
    this.statistics.resetCount();
  }

  async checkShuffle() {
    if (this.deck.shouldShuffle()) {
      await this.performShuffleAnimation();
    }
  }

  async forceShuffle() {
    // Secret shuffle command - shows special message
    const secretText =
      chalk.yellow('♠') +
      chalk.red('♥') +
      chalk.magenta.bold('  🎴 Manual shuffle in progress... 🎴  ') +
      chalk.red('♦') +
      chalk.yellow('♣');

    await this.performShuffleAnimation(secretText);
  }

  async playRound(getSingleKey) {
    await this.checkShuffle();

    this.dealInitialCards();
    this.gameInProgress = true;

    if (this.isBlackjack(this.playerHand)) {
      this.gameInProgress = false;
      if (this.isBlackjack(this.dealerHand)) {
        this.lastResult = chalk.blue.bold('⚖  PUSH - Both have Blackjack!');
        this.statistics.recordTie();
      } else {
        this.lastResult = chalk.green.bold('★  BLACKJACK! YOU WIN! ★');
        this.statistics.recordWin(true);
      }
      this.redrawScreen();
      await this.sleep(2000);
      return;
    }

    if (this.isBlackjack(this.dealerHand)) {
      this.gameInProgress = false;
      this.lastResult = chalk.red.bold('✖  Dealer Blackjack - You Lose');
      this.statistics.recordLoss();
      this.redrawScreen();
      await this.sleep(2000);
      return;
    }

    this.redrawScreen();

    const playerResult = await this.playerTurn(getSingleKey);

    if (playerResult === 'bust') {
      this.lastResult = chalk.red.bold('✖  BUST! YOU LOSE');
      this.statistics.recordLoss(true);
      this.redrawScreen();
      await this.sleep(2000);
      return;
    }

    const dealerResult = await this.dealerTurn();

    if (dealerResult === 'bust') {
      this.lastResult = chalk.green.bold('✓  DEALER BUSTS! YOU WIN!');
      this.statistics.recordWin();
    } else {
      await this.determineWinner();
    }

    this.redrawScreen();
    await this.sleep(2000);
  }

  async start(getSingleKey) {
    while (this.gameActive) {
      await this.playRound(getSingleKey);

      this.redrawScreen(chalk.yellow('Press (Y/H) to play again or (Q) to quit'));

      const action = await getSingleKey();
      const choice = action.toLowerCase();

      if (choice === 'q') {
        this.gameActive = false;
        console.clear();
        this.displayScoreboard();
        console.log('');
        console.log(chalk.cyan.bold('Thanks for playing Terminal BlackJack!'));
        console.log('');
        process.exit(0);
      } else if (choice !== 'y' || choice !== 'h') {
        this.redrawScreen(chalk.red('Invalid choice. Press (Y) or (H) to play again or (Q) to quit'));
        await this.sleep(1000);
      }
      this.lastResult = " ";
    }
  }
}
