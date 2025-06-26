import React from 'react';

const ChallengeCard = ({ challenge }) => {
    return (
        <div className="challenge-card">
            <h3 className="challenge-title">{challenge.title}</h3>
            <p className="challenge-description">{challenge.description}</p>
            <div className="challenge-progress">
                <span>Progress: {challenge.progress}%</span>
            </div>
            <button className="challenge-button" onClick={() => challenge.onSelect(challenge.id)}>
                Select Challenge
            </button>
        </div>
    );
};

export default ChallengeCard;