import React, { useState, useCallback } from 'react';
import wordList from '../data/wordlist.json';
import InputForm from './InputForm';
import SuggestionsDisplay from './SuggestionsDisplay';

function GameAssistant() {
    const [possibleWords, setPossibleWords] = useState([...wordList]);

    const countUniqueLetters = word => {
        const uniqueLetters = new Set(word);
        return uniqueLetters.size;
    };

    const updatePossibleWords = useCallback((greens, yellows, greys) => {
        const filteredWords = wordList.filter(word => {
            for (let i = 0; i < greens.length; i++) {
                if (greens[i] && word[i] !== greens[i]) {
                    return false;
                }
            }
            for (const grey of greys) {
                if (word.includes(grey)) {
                    return false;
                }
            }

            for (const yellow of yellows) {
                const yellowLetter = yellow.letter;
                const yellowPositions = yellow.positions.map(pos => parseInt(pos, 10) - 1);
                if (yellowLetter) {
                    if (!word.includes(yellowLetter)) {
                        return false;
                    }
                    for (const position of yellowPositions) {
                        if (word[position] === yellowLetter) {
                            return false;
                        }
                    }
                }
            }
            return true;
        });

        filteredWords.sort((a, b) => countUniqueLetters(b) - countUniqueLetters(a));
        setPossibleWords(filteredWords);
    }, []);

    const resetGame = () => {
        setPossibleWords([...wordList]);
    };

    return (
        <div>
            <h2 className='heading'>Wordle Assistant</h2>
            <InputForm onUpdate={updatePossibleWords} onReset={resetGame} />
            <SuggestionsDisplay possibleWords={possibleWords} />
        </div>
    );
}

export default GameAssistant;
