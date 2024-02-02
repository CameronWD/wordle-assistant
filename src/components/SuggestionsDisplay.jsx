import React from 'react';
import '../styles/SuggestionsDisplay.scss';

function SuggestionsDisplay({ possibleWords }) {
    return (
        <div>
            <h3 className="suggestions-title">The possibilities...</h3>
            <div className="suggestions-container">
                {possibleWords.map((word, index) => (
                    <div key={index} className="word-card">
                        {word}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SuggestionsDisplay;
