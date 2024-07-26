// Function to calculate Z-Score
export function ZScore(value, mean, stdDev) {
    return (value - mean) / stdDev;
}

// Function to normalize data
export async function normalizeData(data) {
    console.log('Data to Normalize:', data);
    console.log('Type of Data:', typeof data);
    console.log('Is Data an Array:', Array.isArray(data));
    
    if (!Array.isArray(data)) {
        throw new Error('Data must be an array');
    }

    if (data.length === 0) {
        throw new Error('Data array must not be empty');
    }

    const mean = await getMean(data);
    const stdDev = await getStandardDeviation(data);

    if (stdDev === 0) {
        throw new Error('Standard deviation is zero, normalization is not possible');
    }

    return data.map(value => ZScore(value, mean, stdDev));
}

async function getMean(data) {
    console.log('Data for Mean Calculation:', data);
    const sum = data.reduce((total, value) => total + value, 0);
    return sum / data.length;
}

async function getStandardDeviation(data) {
    const mean = await getMean(data);
    console.log('Mean for Standard Deviation Calculation:', mean);
    const variance = data.reduce((total, value) => total + Math.pow(value - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
}
