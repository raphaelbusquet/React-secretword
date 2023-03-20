// Estilos
import './App.css';

// React
import {useCallback, useEffect, useState} from 'react';

// Data
import {wordsList} from './data/words';

// Components
import StartScreen from './components/StartScreen/StartScreen'; 
import GameScreen from './components/GameScreen/GameScreen';
import EndScreen from './components/EndScreen/EndScreen';

// GameStages
const stages = [
  {id: 1, name: 'start'},
  {id: 2, name: 'game'},
  {id: 3, name: 'end'}
]

const guessedQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord ] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);
  
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessedQty);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    // Pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // Pick a random word 
    const word = words[category][Math.floor(Math.random() * words[category].length)]; 


    return {word, category};
  }, [words]);


  // Starts the Game
  const startGame = useCallback(() => {

    // Clear all letters
    clearLetterStages();

    // Pick word and pick category
    const {word, category} = pickWordAndCategory();


    // Create an array of letters and set to LowerCase
    let wordLetters = word.split('');

    wordLetters = wordLetters.map((l) => l.toLowerCase());


    // Fill the states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);


    setGameStage(stages[1].name);
  }, [pickWordAndCategory])

  // Process the letter input
  const verifyLetter = (letter) => {
    
    const normalizedLetter = letter.toLowerCase()

    // Check if the letter is already been used

    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }

    // Push guessed letter or remove a guess

    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [...actualGuessedLetters, normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => 
      [...actualWrongLetters, 
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStages = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  // Check if the game is over 
  useEffect(() => {

    // Check if the game is over
    if (guesses <= 0) {
      // Reset all stages
      clearLetterStages();

      setGameStage(stages[2].name);

    }
  }, [guesses])

  // Check win condition
  useEffect(() => {

    const uniqueLetters = [...new Set(letters)];

    // Win condition
    if (guessedLetters.length === uniqueLetters.length) {
      // Add score
      setScore((actualScore) => actualScore += 100);

      // Restart game with a new word
      startGame();
    }

  }, [guessedLetters, letters, startGame]) // <= Ambiente de monitoramento

  // Retarts the game
  const retry = () => {
    setScore(0);
    setGuesses(guessedQty);

    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame}/>}
      {gameStage === 'game' && (
        <GameScreen 
       verifyLetter={verifyLetter}
       pickedWord={pickedWord} 
       pickedCategory={pickedCategory} 
       letters={letters}
       guessedLetters={guessedLetters}
       wrongLetters={wrongLetters}
       guesses={guesses}
       score={score}
       />)
      }
      {gameStage === 'end' && <EndScreen retry={retry} score={score} />}
    </div>
  );
}

export default App;
