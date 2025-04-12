const basicSlider = document.getElementById('basic');
const hraSlider = document.getElementById('hra');
const rentSlider = document.getElementById('rent');
const citySelect = document.getElementById('city');

const basicValue = document.getElementById('basic-value');
const hraValue = document.getElementById('hra-value');
const rentValue = document.getElementById('rent-value');

const hraSummary = document.getElementById('hra-summary');
const exemptedSummary = document.getElementById('exempted-summary');
const taxableSummary = document.getElementById('taxable-summary');

const ctx = document.getElementById('hraChart').getContext('2d');
const hraChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Exempted HRA', 'Taxable HRA'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#34d399', '#f87171'],
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

function updateHRA() {
  const basic = parseFloat(basicSlider.value);
  const hra = parseFloat(hraSlider.value);
  const rent = parseFloat(rentSlider.value);
  const city = citySelect.value;

  basicValue.textContent = basic;
  hraValue.textContent = hra;
  rentValue.textContent = rent;

  const hraAnnual = hra * 12;
  hraSummary.textContent = hraAnnual.toFixed(2);

  const rentExcess = Math.max(rent - 0.1 * basic, 0) * 12;
  const metroExempt = 0.5 * basic * 12;
  const nonMetroExempt = 0.4 * basic * 12;

  const exempt = Math.min(hraAnnual, rentExcess, city === 'metro' ? metroExempt : nonMetroExempt);
  const taxable = hraAnnual - exempt;

  exemptedSummary.textContent = exempt.toFixed(2);
  taxableSummary.textContent = taxable.toFixed(2);

  hraChart.data.datasets[0].data = [exempt, taxable];
  hraChart.update();
}

[basicSlider, hraSlider, rentSlider, citySelect].forEach(input =>
  input.addEventListener('input', updateHRA)
);

updateHRA();

document.getElementById('downloadBtn').addEventListener('click', () => {
  const report = `
--- HRA CALCULATION REPORT ---
Basic Salary: ₹${basicSlider.value}
HRA Received: ₹${hraSlider.value}
Rent Paid: ₹${rentSlider.value}
City Type: ${citySelect.value}
Exempted HRA: ₹${exemptedSummary.textContent}
Taxable HRA: ₹${taxableSummary.textContent}
------------------------------
`;

  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'HRAReport.txt';
  a.click();

  URL.revokeObjectURL(url);
});
