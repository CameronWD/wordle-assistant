import React, { useState, useRef, useEffect } from 'react';
import '../styles/InputForm.scss';

function InputForm({ onUpdate, onReset }) {
    const [currentGuess, setCurrentGuess] = useState(Array(5).fill(''));
    const [currentColours, setCurrentColours] = useState(Array(5).fill('grey'));
    const [guesses, setGuesses] = useState([]);
    const inputRefs = useRef([]);

    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, currentGuess.length);
    }, [currentGuess.length]);

    const handleLetterChange = (index) => (event) => {
        const newGuess = [...currentGuess];
        newGuess[index] = event.target.value.toLowerCase();
        setCurrentGuess(newGuess);

        if (newGuess[index].length === 1 && index < currentGuess.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const cycleColour = (index) => {
        if (currentGuess[index] !== '') {
            const nextColour = currentColours[index] === 'grey' ? 'yellow' : currentColours[index] === 'yellow' ? 'green' : 'grey';
            const newColours = [...currentColours];
            newColours[index] = nextColour;
            setCurrentColours(newColours);
        }
    };

    const handleSubmitGuess = () => {
        if (currentGuess.join('').length === 5 && !currentColours.includes('')) {
            const greens = currentColours.map((Colour, idx) => Colour === 'green' ? currentGuess[idx] : '');
            const yellows = currentGuess.reduce((acc, letter, idx) => {
                if (currentColours[idx] === 'yellow') {
                    acc.push({ letter, positions: [idx + 1] });
                }
                return acc;
            }, []);
            const greys = currentGuess.filter((letter, idx) => currentColours[idx] === 'grey');

            const possibleWordsCount = onUpdate(greens, yellows, greys, currentGuess.join(''));
            setGuesses([...guesses, { guess: currentGuess, Colours: currentColours, possibleWords: possibleWordsCount }]);
            setCurrentGuess(Array(5).fill(''));
            setCurrentColours(Array(5).fill('grey'));
        }
    };

    const handleReset = () => {
        onReset();
        setCurrentGuess(Array(5).fill(''));
        setCurrentColours(Array(5).fill('grey'));
        setGuesses([]);
    };

    return (
        <form className="input-form" onSubmit={(e) => e.preventDefault()}>
            {guesses.map((entry, index) => (
                <div key={index} className="guess-entry">
                    <div className="submitted-guess">
                        {entry.guess.map((letter, idx) => (
                            <div key={idx} className={`guess-box ${entry.Colours[idx]}`}>{letter.toUpperCase()}</div>
                        ))}
                    </div>
                    <div className="possible-words-count">
                        Possible words left: {entry.possibleWords}
                    </div>
                </div>
            ))}

            <div className="input-group horizontal" id='current-guess'>
                {currentGuess.map((letter, index) => (
                    <div key={index} className="letter-input">
                        <input
                            type="text"
                            value={letter}
                            onChange={handleLetterChange(index)}
                            maxLength={1}
                            className={`guess-input ${currentColours[index]}`}
                            ref={el => inputRefs.current[index] = el}
                            onClick={() => cycleColour(index)}
                        />
                    </div>
                ))}
            </div>

            <button type="button" onClick={handleSubmitGuess} className="custom-button">Submit Guess</button>
            <button type="button" onClick={handleReset} className="custom-button">Reset Game</button>
        </form>
    );
}

export default InputForm;
