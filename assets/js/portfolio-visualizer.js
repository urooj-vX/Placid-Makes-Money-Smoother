const stocksSlider = document.getElementById('stocks');
const bondsSlider = document.getElementById('bonds');
const cashSlider = document.getElementById('cash');

const stocksValue = document.getElementById('stocks-value');
const bondsValue = document.getElementById('bonds-value');
const cashValue = document.getElementById('cash-value');

const stocksSummary = document.getElementById('stocks-summary');
const bondsSummary = document.getElementById('bonds-summary');
const cashSummary = document.getElementById('cash-summary');

const ctx = document.getElementById('allocationChart').getContext('2d');
const allocationChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Stocks', 'Bonds', 'Cash'],
    datasets: [{
      data: [50, 30, 20],
      backgroundColor: ['#4e73df', '#1cc88a', '#f6c23e'],
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

function updatePortfolio() {
  const stocks = parseInt(stocksSlider.value);
  const bonds = parseInt(bondsSlider.value);
  const cash = parseInt(cashSlider.value);

  const total = stocks + bonds + cash;
  if (total !== 100) {
    // Normalize values to sum to 100
    const scale = 100 / total;
    allocationChart.data.datasets[0].data = [stocks * scale, bonds * scale, cash * scale];
  } else {
    allocationChart.data.datasets[0].data = [stocks, bonds, cash];
  }

  // Update display
  stocksValue.textContent = stocks;
  bondsValue.textContent = bonds;
  cashValue.textContent = cash;

  stocksSummary.textContent = stocks;
  bondsSummary.textContent = bonds;
  cashSummary.textContent = cash;

  allocationChart.update();
}

[stocksSlider, bondsSlider, cashSlider].forEach(slider =>
  slider.addEventListener('input', updatePortfolio)
);

updatePortfolio();

document.getElementById('downloadBtn').addEventListener('click', () => {
  const report = `
--- PORTFOLIO ALLOCATION ---
Stocks: ${stocksSlider.value}%
Bonds: ${bondsSlider.value}%
Cash: ${cashSlider.value}%
----------------------------
`;
  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'PortfolioReport.txt';
  a.click();

  URL.revokeObjectURL(url);
});
