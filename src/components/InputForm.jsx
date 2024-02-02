import React, { useState, useEffect } from 'react';
import '../styles/InputForm.scss';

function InputForm({ onUpdate, onReset }) {
    const [greens, setGreens] = useState(Array(5).fill(''));
    const [yellowLetters, setYellowLetters] = useState([]);
    const [greys, setGreys] = useState('');

    useEffect(() => {
        const processedYellowLetters = yellowLetters.map(item => ({
            ...item,
            positions: item.positions.split('').filter(pos => pos >= '1' && pos <= '5')
        }));
        onUpdate(greens, processedYellowLetters, greys);
    }, [greens, yellowLetters, greys, onUpdate]);

    const handleGreenChange = (position) => (event) => {
        const newGreens = [...greens];
        newGreens[position] = event.target.value.toLowerCase();
        setGreens(newGreens);
    };

    const addYellowLetter = () => {
        setYellowLetters([...yellowLetters, { letter: '', positions: '' }]);
    };

    const handleYellowLetterChange = (index) => (event) => {
        const updatedYellows = yellowLetters.map((item, idx) =>
            idx === index ? { ...item, letter: event.target.value.toLowerCase() } : item
        );
        setYellowLetters(updatedYellows);
    };

    const handleYellowPositionsChange = (index) => (event) => {
        const updatedYellows = yellowLetters.map((item, idx) =>
            idx === index ? { ...item, positions: event.target.value } : item
        );
        setYellowLetters(updatedYellows);
    };

    const handleGreyChange = (event) => {
        setGreys(event.target.value.toLowerCase());
    };

    const handleReset = () => {
        onReset();
        setGreens(Array(5).fill(''));
        setYellowLetters([]);
        setGreys('');
    };

    return (
        <form className="input-form">
            <div className="input-group">
                <label className="input-label">Green </label>
                {greens.map((green, index) => (
                    <input
                        key={index}
                        type="text"
                        value={green}
                        onChange={handleGreenChange(index)}
                        maxLength={1}
                        className={`green-input ${green ? 'has-letter' : ''}`}
                    />
                ))}
            </div>

            <div className="input-group">
                <label className="input-label">Yellow</label>
                {yellowLetters.map((yellow, index) => (
                    <div key={index} className="yellow-letter-group">
                        <input
                            type="text"
                            value={yellow.letter}
                            onChange={handleYellowLetterChange(index)}
                            maxLength={1}
                            className={`yellow-letter-input ${yellow.letter ? 'has-letter' : ''}`}
                        />
                        <input
                            type="text"
                            value={yellow.positions}
                            onChange={handleYellowPositionsChange(index)}
                            maxLength={5}
                            className={`yellow-positions-input ${yellow.positions ? 'has-letter' : ''}`}
                        />
                    </div>
                ))}
                <button type="button" onClick={addYellowLetter} className="add-yellow-btn">Add Yellow</button>
            </div>

            <div className="input-group">
                <label className="input-label">Grey</label>
                <input
                    type="text"
                    value={greys}
                    onChange={handleGreyChange}
                    className={`grey-input ${greys ? 'has-letter' : ''}`}
                />
            </div>

            <div className="reset-btn-group">
                <button type="button" onClick={handleReset} className="reset-btn">Reset Game</button>
            </div>
        </form>
    );
}

export default InputForm;
