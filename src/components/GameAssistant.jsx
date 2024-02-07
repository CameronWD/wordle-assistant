import React, { useState, useCallback, useEffect } from 'react';
import wordList from '../data/wordlist.json';
import InputForm from './InputForm';
import SuggestionsDisplay from './SuggestionsDisplay';
import GameReview from './GameReview';

function GameAssistant() {
    const [possibleWords, setPossibleWords] = useState([...wordList]);
    const [gameHistory, setGameHistory] = useState([]); 
    const [cumulativeGreens, setCumulativeGreens] = useState(Array(5).fill(''));
    const [cumulativeYellows, setCumulativeYellows] = useState({});
    const [cumulativeGreys, setCumulativeGreys] = useState(new Set());

    const countUniqueLetters = word => {
        const uniqueLetters = new Set(word);
        return uniqueLetters.size;
    };

    const updatePossibleWords = useCallback((greens, yellows, greys, currentGuess) => {
        const newCumulativeGreens = cumulativeGreens.map((g, i) => greens[i] || g);
        let newCumulativeYellows = { ...cumulativeYellows };
        yellows.forEach(y => {
            if (!newCumulativeGreens.includes(y.letter)) {
                if (!newCumulativeYellows[y.letter]) {
                    newCumulativeYellows[y.letter] = new Set();
                }
                y.positions.forEach(pos => newCumulativeYellows[y.letter].add(pos));
            }
        });


        let newCumulativeGreys = new Set(cumulativeGreys);
        greys.forEach(grey => {
            if (!newCumulativeGreens.includes(grey) && !Object.keys(newCumulativeYellows).includes(grey)) {
                newCumulativeGreys.add(grey);
            }
        });

        const filteredWords = wordList.filter(word => {
            for (let i = 0; i < newCumulativeGreens.length; i++) {
                if (newCumulativeGreens[i] && word[i] !== newCumulativeGreens[i]) {
                    return false;
                }
            }

            for (const [letter, positions] of Object.entries(newCumulativeYellows)) {
                if (!word.includes(letter) || positions.has(word.indexOf(letter) + 1)) {
                    return false;
                }
            }

            for (const grey of newCumulativeGreys) {
                if (word.includes(grey)) {
                    return false;
                }
            }

            return true;
        });

        setCumulativeGreens(newCumulativeGreens);
        setCumulativeYellows(newCumulativeYellows);
        setCumulativeGreys(newCumulativeGreys);
        console.log(cumulativeGreens, cumulativeYellows, cumulativeYellows)
        setGameHistory(history => [...history, { guess: currentGuess, possibleWords: filteredWords.length }]);
        filteredWords.sort((a, b) => countUniqueLetters(b) - countUniqueLetters(a));
        setPossibleWords(filteredWords);

        return filteredWords.length;
    }, [cumulativeGreens, cumulativeYellows, cumulativeGreys, wordList]);
    
    const resetGame = () => {
        setPossibleWords([...wordList]);
        setGameHistory([]);
        setCumulativeGreens(Array(5).fill(''));
        setCumulativeYellows({});
        setCumulativeGreys(new Set());
    };

    useEffect(() => {
        console.log("Updated cumulativeGreens: ", cumulativeGreens);
        console.log("Updated cumulativeYellows: ", cumulativeYellows);
        console.log("Updated cumulativeGreys: ", cumulativeGreys);
    }, [cumulativeGreens, cumulativeYellows, cumulativeGreys]);

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
