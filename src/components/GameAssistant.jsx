import React, { useState, useCallback } from 'react';
import wordList from '../data/wordlist.json';
import InputForm from './InputForm';
import SuggestionsDisplay from './SuggestionsDisplay';
import GameReview from './GameReview';

function GameAssistant() {
    const [possibleWords, setPossibleWords] = useState([...wordList]);
    const [gameHistory, setGameHistory] = useState([]); 

    const countUniqueLetters = word => {
        const uniqueLetters = new Set(word);
        return uniqueLetters.size;
    };

    const updatePossibleWords = useCallback((greens, yellows, greys, currentGuess) => {
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
        const possibleWordsCount = filteredWords.length;
        setGameHistory(history => [...history, { guess: currentGuess, possibleWords: possibleWordsCount }]);
        filteredWords.sort((a, b) => countUniqueLetters(b) - countUniqueLetters(a));
        setPossibleWords(filteredWords);
        return possibleWordsCount;
    }, []);

    const resetGame = () => {
        setPossibleWords([...wordList]);
        setGameHistory([]); 
    };

    return (
        <div>
            <h2 className='heading'>Wordle Assistant</h2>
            <InputForm onUpdate={updatePossibleWords} onReset={resetGame} />
            <SuggestionsDisplay possibleWords={possibleWords} />
            <GameReview history={gameHistory} /> 
        </div>
    );
}

export default GameAssistant;
