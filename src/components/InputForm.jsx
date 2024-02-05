import React, { useState, useRef, useEffect } from 'react';
import '../styles/InputForm.scss';

function InputForm({ onUpdate, onReset }) {
    const [currentGuess, setCurrentGuess] = useState(Array(5).fill(''));
    const [currentColors, setCurrentColors] = useState(Array(5).fill('grey'));
    const [guesses, setGuesses] = useState([]);
    const inputRefs = useRef([]);

    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, currentGuess.length);
    }, [currentGuess.length])

    const handleLetterChange = (index) => (event) => {
        const newGuess = [...currentGuess];
        newGuess[index] = event.target.value.toLowerCase();
        setCurrentGuess(newGuess);

        if(newGuess[index].length === 1 && index < currentGuess.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleColorChange = (index) => (event) => {
        const newColors = [...currentColors];
        newColors[index] = event.target.value;
        setCurrentColors(newColors);
    };

    const handleSubmitGuess = () => {
        if (currentGuess.join('').length === 5 && !currentColors.includes('')) {
            const greens = currentGuess.map((letter, idx) => currentColors[idx] === 'green' ? letter : '').filter(Boolean);
            const yellowLetters = currentGuess.map((letter, idx) => currentColors[idx] === 'yellow' ? letter : '').filter(Boolean);
            const greys = currentGuess.filter((letter, idx) => currentColors[idx] === 'grey');

            const yellows = yellowLetters.map(letter => ({
                letter,
                positions: currentGuess.reduce((acc, curr, idx) => {
                    if (curr === letter && currentColors[idx] !== 'green') {
                        acc.push(idx + 1);
                    }
                    return acc;
                }, [])
            }));

            const possibleWordsCount = onUpdate(greens, yellows, greys, currentGuess.join(''));
            setGuesses([...guesses, { guess: currentGuess, colors: currentColors, possibleWords: possibleWordsCount }]);
            setCurrentGuess(Array(5).fill(''));
            setCurrentColors(Array(5).fill('grey'));
        }
    };

    const handleReset = () => {
        onReset();
        setCurrentGuess(Array(5).fill(''));
        setCurrentColors(Array(5).fill('grey'));
        setGuesses([]);
    };

    return (
        <form className="input-form" onSubmit={(e) => e.preventDefault()}>
            {guesses.map((entry, index) => (
                <div key={index} className="guess-entry">
                    <div className="submitted-guess">
                        {entry.guess.map((letter, idx) => (
                            <div key={idx} className={`guess-box ${entry.colors[idx]}`}>{letter.toUpperCase()}</div>
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
                            className="guess-input"
                            ref={el => inputRefs.current[index] = el}
                        />
                    </div>
                ))}
            </div>

            <div className="input-answer-group horizontal" id='colors'>
                {currentColors.map((color, index) => (
                    <div key={index} className="color-selection">
                        <select
                            value={color}
                            onChange={handleColorChange(index)}
                            className="color-select"
                        >
                            <option value="green">Green</option>
                            <option value="yellow">Yellow</option>
                            <option value="grey">Grey</option>
                        </select>
                    </div>
                ))}
            </div>

            <button type="button" onClick={handleSubmitGuess} className="custom-button">Submit Guess</button>
            <button type="button" onClick={handleReset} className="custom-button">Reset Game</button>
        </form>
    );
}

export default InputForm;
