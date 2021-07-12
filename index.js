class Hangman {
  // STATE 
  attemptsCont = 7;
  wordToGuess = "";
  wordArray = [];
  saidLetters = [];
  wordStatus;
  guessed = [];

  // NAMED ELEMENTS
  feedback = document.getElementById("feedback");
  attemptsSpan = document.getElementById('remaining-attempts');
  wordToGuessSpace = document.getElementById('word-to-guess');
  chosenLetters = document.getElementById("chosen-letters");
  imageToShow = document.getElementById('img');

  // METHODS
  // Pick a word to guess
  onChooseAWord() {
    const words = ["camion", "avioneta", "helicoptero", "locomotora", "tractor", "transatlantico", "cayuco"];
    const randomNum = Math.floor(Math.random() * words.length);
    const wordToShow = words.filter((word, i) => i === randomNum).join('');
    console.log("wordtoshow", wordToShow);
    this.wordToGuess = wordToShow;
    console.log("wordToGuess", this.wordToGuess)
  };

  // Paint the hidden word lines and guessed letters
  onPaintHiddenWord() {
    this.wordToGuessSpace.innerHTML = "";
    this.wordStatus = this.wordArray.map(element => (this.guessed.indexOf(element) >= 0 ? element : "_"));
    this.wordStatus.forEach(letter => {
      const wordLetter = document.createElement('span');
      wordLetter.setAttribute("class", "wordLetter");
      wordLetter.setAttribute("name", letter);
      wordLetter.innerHTML = letter;
      this.wordToGuessSpace.appendChild(wordLetter);
    });
  };

  // New word to guess
  onCreateWordToGuess() {
    this.wordToGuess.split('').forEach(letter => {
      this.wordArray.push(letter);
      this.onPaintHiddenWord();
    });
  };

  // Show the hidden word for the first time
  onShowWordToGuess() {
    this.onChooseAWord();
    this.onCreateWordToGuess();
  };

  // Set feedback sentence
  setFeedback(sentence) {
    this.feedback.innerHTML = sentence;
  };

  // Check if the letter has already been chosen and show chosen letters
  onCheckLetter(letter) {
    this.saidLetters.indexOf(letter) !== -1
      ? this.setFeedback("YOU'VE ALREADY GUESSED THIS LETTER. DON'T YOU LIKE ANY OTHERS?")
      : this.saidLetters.push(letter);
    this.chosenLetters.innerHTML = this.saidLetters;
  };

  // Create keyboard with eligible letters
  onCreateKeys() {
    let keys = "abcdefghijklmnopqrstuvwxyz".split('').map(letter =>
      `
      <button
        type="button"
        class="key"
        id='` + letter + `'
        >
        ` + letter + `
        </button>
      `).join('');
    document.getElementById('keyboard').innerHTML = keys;
    document.querySelectorAll(".key").forEach(item => item.addEventListener("click", (e) => this.onHandleGuess(item.id)));
  };

  // Check if the whole word has been guessed
  onCheckIfWin() {
    if (this.wordStatus.indexOf("_") === -1) {
      this.setFeedback("CONGRATS, YOU SAVED THE HANGMAN'S LIFE ! HE WILL GET OVER IT :D");
      this.onDisableKeys();
    }
  };

  // Disable keyboard keys when the game is over
  onDisableKeys() {
    const keys = document.querySelectorAll(".key");
    keys.forEach(key => key.setAttribute("disabled", "true"));
  };

  // Guess a letter
  onHandleGuess(letter) {
    // Has the letter been chosen yet?
    if (this.saidLetters.indexOf(letter) !== -1) {
      this.setFeedback("YOU'VE ALREADY CHOSEN THIS LETTER. DON'T YOU LIKE ANY OTHERS?")
    } else {
      this.saidLetters.push(letter);
      // Is the letter part of the word to guess ?
      if (this.wordToGuess.indexOf(letter) === -1) {
        this.setFeedback("WRONG LETTER !");
        //cambiar imágenes
        if (this.attemptsCont > 1) {
          setTimeout(() => this.setFeedback("TRY AGAIN, DON'T BE SHY! XP"), 1000);
          this.attemptsCont--;
        } else if (this.attemptsCont === 1) {
          this.attemptsCont--;
          this.setFeedback(
            `YOU DID YOUR BEST BUT THE GUY IS DEAD. THE WORD WAS -- ` + this.wordToGuess.toUpperCase() + ` -- `
          );
          // disable letters keys
          this.onDisableKeys();
        }
      } else {
        this.guessed.push(letter);
        this.setFeedback("GOOD HIT! KEEP GUESSING ;)");
        this.onPaintHiddenWord();
      };
      // Show remaining attempts, chosen letters and the propper image
      this.attemptsSpan.innerHTML = this.attemptsCont;
      this.chosenLetters.innerHTML = this.saidLetters;
      this.imageToShow.src = `./images/` + this.attemptsCont + `.png`;
    }
    this.onCheckIfWin();
  };

  // Set all the values to their initial state
  onRestartAttempts() {
    this.attemptsCont = 7;
    this.attemptsSpan.innerHTML = this.attemptsCont;
  };

  onRestartChosenLetters() {
    this.saidLetters = [];
    this.chosenLetters.innerHTML = "";
  };

  onSetInitialValues() {
    const self = this;
    this.wordToGuessSpace.innerHTML = "";
    this.wordArray = [];
    this.attemptsCont = 7;
    this.guessed = [];
    this.wordStatus = null;
    this.onRestartAttempts();
    this.onRestartChosenLetters();
    this.setFeedback("GUESS THE WORD !");
    this.imageToShow.src = "./images/7.png";
  };

  // Initialize game
  initializeGame() {
    this.onSetInitialValues();
    this.onCreateKeys();
    this.onShowWordToGuess();
  };

  // Restart game
  restart() {
    let button = document.getElementById("new");
    button.addEventListener("click", (e) => this.initializeGame());
  };
};

const hangman = new Hangman();
hangman.initializeGame();
hangman.restart();