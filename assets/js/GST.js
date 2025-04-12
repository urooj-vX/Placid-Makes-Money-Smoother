const amountSlider = document.getElementById('amount');
const gstRateSlider = document.getElementById('gstRate');

const amountValue = document.getElementById('amount-value');
const gstRateValue = document.getElementById('gstRate-value');

const originalSummary = document.getElementById('original-summary');
const gstSummary = document.getElementById('gst-summary');
const totalSummary = document.getElementById('total-summary');

const ctx = document.getElementById('gstChart').getContext('2d');
const gstChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Original Price', 'GST Amount'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#6366f1', '#f59e0b'],
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

function updateGST() {
  const amount = parseFloat(amountSlider.value);
  const gstRate = parseFloat(gstRateSlider.value);

  const gstAmount = (amount * gstRate) / 100;
  const total = amount + gstAmount;

  amountValue.textContent = amount;
  gstRateValue.textContent = gstRate;

  originalSummary.textContent = amount.toFixed(2);
  gstSummary.textContent = gstAmount.toFixed(2);
  totalSummary.textContent = total.toFixed(2);

  gstChart.data.datasets[0].data = [amount, gstAmount];
  gstChart.update();
}

[amountSlider, gstRateSlider].forEach(slider =>
  slider.addEventListener('input', updateGST)
);

updateGST();

document.getElementById('downloadGSTBtn').addEventListener('click', () => {
  const report = `
--- GST REPORT ---
Original Price: ₹${amountSlider.value}
GST Rate: ${gstRateSlider.value}%
GST Amount: ₹${gstSummary.textContent}
Total Price (incl. GST): ₹${totalSummary.textContent}
------------------
`;

  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'GST_Report.txt';
  a.click();

  URL.revokeObjectURL(url);
});
