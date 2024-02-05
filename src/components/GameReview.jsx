import React from 'react';

function GameReview({ history }) {
    return (
        <div>
            {history.map((entry, index) => (
                <div key={index}>
                    <p>After guess {index + 1}, you had {entry.possibleWords} possible words left.</p>
                </div>
            ))}
        </div>
    );
}

export default GameReview;
