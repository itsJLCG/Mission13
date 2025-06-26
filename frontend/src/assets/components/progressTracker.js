import React from 'react';
import { Line } from 'react-chartjs-2';

const ProgressTracker = ({ progressData }) => {
    const data = {
        labels: progressData.map(item => item.date),
        datasets: [
            {
                label: 'Progress',
                data: progressData.map(item => item.progress),
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Progress (%)',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
        },
    };

    return (
        <div className="progress-tracker">
            <h2>Your Progress</h2>
            <Line data={data} options={options} />
        </div>
    );
};

export default ProgressTracker;