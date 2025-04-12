const purchaseSlider = document.getElementById('purchase');
const saleSlider = document.getElementById('sale');
const durationSlider = document.getElementById('duration');

const purchaseValue = document.getElementById('purchase-value');
const saleValue = document.getElementById('sale-value');
const durationValue = document.getElementById('duration-value');

const purchaseSummary = document.getElementById('purchase-summary');
const saleSummary = document.getElementById('sale-summary');
const gainSummary = document.getElementById('gain-summary');

const ctx = document.getElementById('gainChart').getContext('2d');
const gainChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Purchase Price', 'Capital Gain'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#10b981', '#f97316'],
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

function updateGains() {
  const purchase = parseFloat(purchaseSlider.value);
  const sale = parseFloat(saleSlider.value);
  const duration = parseInt(durationSlider.value);

  const gain = Math.max(sale - purchase, 0);

  purchaseValue.textContent = purchase;
  saleValue.textContent = sale;
  durationValue.textContent = duration;

  purchaseSummary.textContent = purchase.toFixed(2);
  saleSummary.textContent = sale.toFixed(2);
  gainSummary.textContent = gain.toFixed(2);

  gainChart.data.datasets[0].data = [purchase, gain];
  gainChart.update();
}

[purchaseSlider, saleSlider, durationSlider].forEach(slider =>
  slider.addEventListener('input', updateGains)
);

updateGains();

document.getElementById('downloadBtn').addEventListener('click', () => {
  const report = `
--- CAPITAL GAINS REPORT ---
Purchase Price: ₹${purchaseSlider.value}
Sale Price: ₹${saleSlider.value}
Holding Period: ${durationSlider.value} years
Capital Gain: ₹${gainSummary.textContent}
----------------------------
`;

  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'CapitalGainsReport.txt';
  a.click();

  URL.revokeObjectURL(url);
});
