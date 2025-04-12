const incomeSlider = document.getElementById('annualIncome');
const deductionSlider = document.getElementById('deductions');

const incomeValue = document.getElementById('income-value');
const deductionValue = document.getElementById('deduction-value');

const taxableSummary = document.getElementById('taxable-summary');
const taxSummary = document.getElementById('tax-summary');
const postTaxSummary = document.getElementById('posttax-summary');

const ctx = document.getElementById('taxChart').getContext('2d');
const taxChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Tax', 'Post-Tax Income'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#ef4444', '#10b981'],
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

function calculateTax(income) {
  // Basic tax slabs (example for Old Regime India - FY 2023-24)
  if (income <= 250000) return 0;
  if (income <= 500000) return (income - 250000) * 0.05;
  if (income <= 1000000) return 12500 + (income - 500000) * 0.2;
  return 112500 + (income - 1000000) * 0.3;
}

function updateTax() {
  const income = parseInt(incomeSlider.value);
  const deductions = parseInt(deductionSlider.value);

  const taxable = Math.max(income - deductions, 0);
  const tax = calculateTax(taxable);
  const postTax = income - tax;

  // Update values
  incomeValue.textContent = income;
  deductionValue.textContent = deductions;
  taxableSummary.textContent = taxable;
  taxSummary.textContent = tax.toFixed(2);
  postTaxSummary.textContent = postTax.toFixed(2);

  // Update chart
  taxChart.data.datasets[0].data = [tax, postTax];
  taxChart.update();
}

[incomeSlider, deductionSlider].forEach(slider =>
  slider.addEventListener('input', updateTax)
);

updateTax();

document.getElementById('downloadBtn').addEventListener('click', () => {
  const report = `
--- INCOME TAX REPORT ---
Annual Income: ₹${incomeSlider.value}
Deductions: ₹${deductionSlider.value}
Taxable Income: ₹${taxableSummary.textContent}
Estimated Tax: ₹${taxSummary.textContent}
Post-Tax Income: ₹${postTaxSummary.textContent}
-------------------------
`;

  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'IncomeTaxReport.txt';
  a.click();

  URL.revokeObjectURL(url);
});
