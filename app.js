let points = 0;
let responseCount = 0;
let scheduleType = 'FR5'; // Change this to 'FR5', 'VR5', 'FI30', 'VI30', etc.
let nextReinforcement = 5;
let timeLimit = 60000; // 1 minute in milliseconds
let startTime = null;
let responseTimes = [];
let reinforcerTimes = []; // Array to store times of reinforcement delivery

// Function to handle button clicks
document.getElementById("clickButton").addEventListener("click", function() {
    responseCount++;

    // Record the time of the response (accurately timestamped from start of task)
    let currentTime = new Date().getTime() - startTime;
    responseTimes.push(currentTime); // Push the exact response time into responseTimes

    // Check for reinforcement delivery
    if (scheduleType === 'FR5' && responseCount >= nextReinforcement) {
        points++;
        responseCount = 0; // Reset for the next cycle
        document.getElementById("pointsDisplay").innerText = `Points: ${points}`;

        // Record the time of reinforcement delivery
        reinforcerTimes.push(currentTime); // Record the actual reinforcement delivery time
    }
});

// Function to start the task
function startTask() {
    startTime = new Date().getTime(); // Capture the start time of the task
    setTimeout(endTask, timeLimit); // End task after 1 minute
}

// Function to end the task and show the cumulative graph
function endTask() {
    drawGraph();
}

// Function to draw cumulative response graph using Chart.js
function drawGraph() {
    let cumulativeResponses = [];
    for (let i = 0; i < responseTimes.length; i++) {
        cumulativeResponses.push(i + 1); // Cumulative response count
    }

    // Create an array of scatter plot points for reinforcer markers
    let reinforcerMarkers = reinforcerTimes.map((time) => {
        // Find the index in responseTimes that corresponds to the reinforcer time
        let responseIndex = responseTimes.findIndex(responseTime => responseTime >= time);
        return {
            x: (time / 1000).toFixed(1), // Reinforcer time in seconds
            y: responseIndex + 1 // The corresponding cumulative response count
        };
    });

    // Create the cumulative response line chart
    let ctx = document.getElementById('responseChart').getContext('2d');
    let responseChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: responseTimes.map(time => (time / 1000).toFixed(1)), // Time points in seconds
            datasets: [
                {
                    label: 'Cumulative Responses',
                    data: cumulativeResponses,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                },
                {
                    // Dataset for reinforcer markers (scatter plot)
                    label: 'Reinforcer Delivery',
                    data: reinforcerMarkers,
                    backgroundColor: 'red',
                    borderColor: 'red',
                    type: 'scatter',
                    pointStyle: 'rectRot', // Rotated rectangle markers
                    pointRadius: 6,
                    showLine: false // Ensure no lines are drawn for reinforcers
                }
           

// Start the task when the page loads
window.onload = startTask;
