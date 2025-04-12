const principalSlider = document.getElementById('principal');
const rateSlider = document.getElementById('rate');
const timeSlider = document.getElementById('time');

const principalValue = document.getElementById('principal-value');
const rateValue = document.getElementById('rate-value');
const timeValue = document.getElementById('time-value');

const principalSummary = document.getElementById('principal-summary');
const interestSummary = document.getElementById('interest-summary');
const totalSummary = document.getElementById('total-summary');

// Chart setup
const ctx = document.getElementById('interestChart').getContext('2d');
const interestChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Principal', 'Interest'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#4e73df', '#1cc88a'],
      borderWidth: 1,
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
});

// Growth chart
const growthCtx = document.getElementById('growthChart').getContext('2d');
const growthChart = new Chart(growthCtx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Yearly Growth (₹)',
      data: [],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
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
  const principal = parseFloat(principalSlider.value);
  const rate = parseFloat(rateSlider.value);
  const time = parseFloat(timeSlider.value);

  const total = principal * Math.pow(1 + rate / 100, time);
  const interest = total - principal;

  principalValue.textContent = principal;
  rateValue.textContent = rate;
  timeValue.textContent = time;

  principalSummary.textContent = principal.toFixed(2);
  interestSummary.textContent = interest.toFixed(2);
  totalSummary.textContent = total.toFixed(2);

  interestChart.data.datasets[0].data = [principal, interest];
  interestChart.update();

  const yearlyTotals = [];
  for (let i = 1; i <= time; i++) {
    yearlyTotals.push(principal * Math.pow(1 + rate / 100, i));
  }

  growthChart.data.labels = yearlyTotals.map((_, i) => `Year ${i + 1}`);
  growthChart.data.datasets[0].data = yearlyTotals;
  growthChart.update();
}

principalSlider.addEventListener('input', updateValues);
rateSlider.addEventListener('input', updateValues);
timeSlider.addEventListener('input', updateValues);

updateValues();

// Download report
document.getElementById('downloadBtn').addEventListener('click', () => {
  const report = `
--- COMPOUND INTEREST REPORT ---
Principal: ₹${principalSlider.value}
Rate: ${rateSlider.value}%
Time: ${timeSlider.value} years
Interest Earned: ₹${interestSummary.textContent}
Total Amount: ₹${totalSummary.textContent}
--------------------------------
  `;

  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'CompoundInterestReport.txt';
  a.click();

  URL.revokeObjectURL(url);
});
