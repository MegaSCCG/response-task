let points = 0;
let responseCount = 0;
let scheduleType = 'FR5'; // Change this to 'FR5', 'VR5', 'FI30', 'VI30', etc.
let nextReinforcement = 5;
let timeLimit = 60000; // 1 minute in milliseconds
let startTime = null;
let responseTimes = [];
let stimulusInterval;

// Function to show stimulus
function showStimulus() {
    document.getElementById("stimulusButton").style.visibility = "visible";
}

// Function to hide stimulus after click
function hideStimulus() {
    document.getElementById("stimulusButton").style.visibility = "hidden";
}

// Function to handle stimulus click
document.getElementById("stimulusButton").addEventListener("click", function() {
    responseCount++;
    if (scheduleType === 'FR5' && responseCount >= nextReinforcement) {
        points++;
        responseCount = 0; // Reset for the next cycle
        document.getElementById("pointsDisplay").innerText = `Points: ${points}`;
    }
    // Record the time of the response
    responseTimes.push(new Date().getTime() - startTime);
    hideStimulus();
});

// Function to start the task
function startTask() {
    startTime = new Date().getTime();
    stimulusInterval = setInterval(showStimulus, 3000); // Show stimulus every 3 seconds
    setTimeout(endTask, timeLimit); // End task after 1 minute
}

// Function to end the task and show the cumulative graph
function endTask() {
    clearInterval(stimulusInterval);
    document.getElementById("stimulusButton").style.visibility = "hidden";
    drawGraph();
}

// Function to draw cumulative response graph using Chart.js
function drawGraph() {
    let cumulativeResponses = [];
    for (let i = 0; i < responseTimes.length; i++) {
        cumulativeResponses.push(i + 1);
    }

    let ctx = document.getElementById('responseChart').getContext('2d');
    let responseChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: responseTimes.map(time => (time / 1000).toFixed(1) + 's'),
            datasets: [{
                label: 'Cumulative Responses',
                data: cumulativeResponses,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (seconds)'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cumulative Responses'
                    }
                }
            }
        }
    });
}

// Start the task when the page loads
window.onload = startTask;