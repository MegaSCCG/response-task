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

    // Record the time of the response (actual time since start of task)
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
    startTime = new Date().getTime();
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

    // Create an array of annotations (vertical lines) for reinforcer times
    let annotations = reinforcerTimes.map((time) => {
        return {
            type: 'line',
            mode: 'vertical',
            scaleID: 'x',
            value: (time / 1000).toFixed(1), // Reinforcer time in seconds
            borderColor: 'red',
            borderWidth: 2, // Thickness of the line
            yMin: 0, // Start tick at the bottom of the y-axis
            yMax: 5, // Shorten the tick to end at y = 5 (1cm length visually on the graph)
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
                }
            ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (seconds)'
                    },
                    ticks: {
                        stepSize: 5, // Force ticks every 5 seconds
                        callback: function(value) {
                            return `${value}s`; // Show time in seconds
                        }
                    },
                    min: 0,
                    max: 60 // Limit the time axis to 60 seconds
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cumulative Responses'
                    }
                }
            },
            plugins: {
                annotation: {
                    annotations: annotations // Add the vertical line annotations for reinforcer markers
                },
                legend: {
                    display: true
                }
            }
        }
    });
}

// Start the task when the page loads
window.onload = startTask;
