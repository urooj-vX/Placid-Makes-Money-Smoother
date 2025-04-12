const monthlySlider = document.getElementById('monthly');
const rateSlider = document.getElementById('rate');
const yearsSlider = document.getElementById('years');

const monthlyValue = document.getElementById('monthly-value');
const rateValue = document.getElementById('rate-value');
const yearsValue = document.getElementById('years-value');

const investmentSummary = document.getElementById('investment-summary');
const returnsSummary = document.getElementById('returns-summary');
const totalSummary = document.getElementById('total-summary');

// Doughnut chart
const ctx = document.getElementById('interestChart').getContext('2d');
const interestChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Investment', 'Returns'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#4e73df', '#1cc88a'],
      borderWidth: 1
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

// Line chart
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

// SIP Calculation
function updateValues() {
  const monthly = parseFloat(monthlySlider.value);
  const rate = parseFloat(rateSlider.value) / 100 / 12;
  const years = parseFloat(yearsSlider.value);
  const months = years * 12;

  const futureValue = monthly * ((Math.pow(1 + rate, months) - 1) * (1 + rate)) / rate;
  const investedAmount = monthly * months;
  const returns = futureValue - investedAmount;

  // Update UI
  monthlyValue.textContent = monthly;
  rateValue.textContent = (rate * 12 * 100).toFixed(1);
  yearsValue.textContent = years;

  investmentSummary.textContent = investedAmount.toFixed(2);
  returnsSummary.textContent = returns.toFixed(2);
  totalSummary.textContent = futureValue.toFixed(2);

  interestChart.data.datasets[0].data = [investedAmount, returns];
  interestChart.update();

  // Yearly growth breakdown
  const yearlyTotals = [];
  for (let y = 1; y <= years; y++) {
    const n = y * 12;
    const fv = monthly * ((Math.pow(1 + rate, n) - 1) * (1 + rate)) / rate;
    yearlyTotals.push(fv);
  }

  growthChart.data.labels = yearlyTotals.map((_, i) => `Year ${i + 1}`);
  growthChart.data.datasets[0].data = yearlyTotals;
  growthChart.update();
}

monthlySlider.addEventListener('input', updateValues);
rateSlider.addEventListener('input', updateValues);
yearsSlider.addEventListener('input', updateValues);

updateValues();

// Download Report
document.getElementById('downloadBtn').addEventListener('click', () => {
  const report = `
--- SIP REPORT ---
Monthly Investment: ₹${monthlySlider.value}
Expected Return: ${rateSlider.value}% p.a.
Time Period: ${yearsSlider.value} years
Total Investment: ₹${investmentSummary.textContent}
Estimated Returns: ₹${returnsSummary.textContent}
Final Value: ₹${totalSummary.textContent}
-------------------
`;

  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'SIPReport.txt';
  a.click();

  URL.revokeObjectURL(url);
});
