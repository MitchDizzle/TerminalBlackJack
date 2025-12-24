import readline from 'readline';
import { BlackJackGame } from './src/game.js';

async function getSingleKey() {
  return new Promise(resolve => {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();

    const onData = (buffer) => {
      const char = buffer.toString('utf8');

      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      process.stdin.pause();
      process.stdin.removeListener('data', onData);

      // Handle Ctrl+C
      if (char === '\u0003') {
        process.exit();
      }

      resolve(char);
    };

    process.stdin.on('data', onData);
  });
}

async function question(query) {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(query, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  process.title = "Terminal Blackjack";
  console.clear();
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('                    WELCOME TO TERMINAL BLACKJACK');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('');
  console.log('This game includes Hi-Lo card counting:');
  console.log('  • Low cards (2-6): +1  |  Neutral (7-9): 0  |  High (10-A): -1');
  console.log('  • Running Count (R): Raw total since shuffle');
  console.log('  • True Count (T): Running count ÷ decks remaining');
  console.log('');
  console.log('Track the count at the top of the screen during play!');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('');

  const deckCountInput = await question('How many decks would you like to play with? 1-8 (Press Enter for default: 1): ');
  let deckCount = deckCountInput.trim() === '' ? 1 : parseInt(deckCountInput);

  if (isNaN(deckCount) || deckCount < 1 || deckCount > 8) {
    console.log('Invalid number of decks. Using default: 1 deck.');
    deckCount = 1;
  }

  console.clear();
  console.log(`Starting game with ${deckCount} deck(s)...\n`);

  const game = new BlackJackGame(deckCount);
  await game.start(getSingleKey);
}

main();
