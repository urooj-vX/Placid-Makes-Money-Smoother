
const principalSlider = document.getElementById('principal');
const rateSlider = document.getElementById('rate');
const timeSlider = document.getElementById('time');

const principalValue = document.getElementById('principal-value');
const rateValue = document.getElementById('rate-value');
const timeValue = document.getElementById('time-value');

const principalSummary = document.getElementById('principal-summary');
const interestSummary = document.getElementById('interest-summary');
const totalSummary = document.getElementById('total-summary');

// Chart.js SetUp 
const ctx = document.getElementById('interestChart').getContext('2d');
const interestChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Principal', 'Interest'],
        datasets: [{
            data: [0, 0], // Initial values
            backgroundColor: ['#4e73df', '#1cc88a'],
            borderWidth: 1,
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
        }
    }
});

// Growth-chart
const growthCtx = document.getElementById('growthChart').getContext('2d');
const growthChart = new Chart(growthCtx, {
    type: 'line',  
    data: {
        labels: [], // sample years, make it dynamic if needed
        datasets: [{
            label: 'Yearly Growth (₹)',
            data: [10500, 11000, 11500, 12000, 12500], // sample data
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4, // smooth curves
            pointRadius: 5,
            pointBackgroundColor: '#2563eb'
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});


function updateValues() {

    // Converting Values into Numbers:
    const principal = parseFloat(principalSlider.value);
    const rate = parseFloat(rateSlider.value);
    const time = parseFloat(timeSlider.value);

    // Calculating the interest and total
    const interest = (principal * rate * time) / 100;
    const total = principal + interest;

    // Update slider number display
    principalValue.textContent = principal;
    rateValue.textContent = rate;
    timeValue.textContent = time;

    // Update summary section
    principalSummary.textContent = principal;
    interestSummary.textContent = interest.toFixed(2);
    totalSummary.textContent = total.toFixed(2);

    // Update chart data
    interestChart.data.datasets[0].data = [principal, interest];
    interestChart.update();

    // Calculate yearly totals
    const yearlyTotals = [];
    for (let i = 1; i <= time; i++) {
        const yearInterest = (principal * rate * i) / 100;
        yearlyTotals.push(principal + yearInterest);
    }

    growthChart.data.labels = yearlyTotals.map((_, i) => `Year ${i + 1}`);
    growthChart.data.datasets[0].data = yearlyTotals;
    growthChart.update();

}

// Whenever slider is moved, update the values
principalSlider.addEventListener('input', updateValues);
rateSlider.addEventListener('input', updateValues);
timeSlider.addEventListener('input', updateValues);

// Initial call so values show up when page loads
updateValues();

// Downloading Report

document.getElementById('downloadBtn').addEventListener('click', () => {
    const report = `
--- SIMPLE INTEREST REPORT ---
Principal: ₹${principalSlider.value}
Rate: ${rateSlider.value}%
Time: ${timeSlider.value} years
Interest Earned: ₹${interestSummary.textContent}
Total Amount: ₹${totalSummary.textContent}
------------------------------
`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'SimpleInterestReport.txt';
    a.click();

    URL.revokeObjectURL(url);
});
