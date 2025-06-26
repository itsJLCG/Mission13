function calculateCarbonSavings(challengesCompleted) {
    const carbonPerChallenge = 0.5; // Example value in tons
    return challengesCompleted * carbonPerChallenge;
}

function calculateWaterUsage(challengesCompleted) {
    const waterPerChallenge = 100; // Example value in liters
    return challengesCompleted * waterPerChallenge;
}

function displayEcoMetrics(challengesCompleted) {
    const carbonSavings = calculateCarbonSavings(challengesCompleted);
    const waterUsage = calculateWaterUsage(challengesCompleted);

    return {
        carbonSavings: carbonSavings.toFixed(2),
        waterUsage: waterUsage.toFixed(2)
    };
}

export { calculateCarbonSavings, calculateWaterUsage, displayEcoMetrics };