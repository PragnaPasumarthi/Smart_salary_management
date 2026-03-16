// ===== DASHBOARD LOGIC =====

let salaryChart = null;

function initDashboard() {
  const salary = getSalary();
  if (salary) document.getElementById('salaryInput').value = salary;
  renderDashboard(salary);
}

function renderDashboard(salary) {
  const alloc = getAllocation();   // always reads fresh from localStorage
  const amounts = CATEGORIES.map(c => ((alloc[c] / 100) * salary));

  // Update stat cards — show both % and ₹ amount
  CATEGORIES.forEach((cat, i) => {
    const amtEl = document.getElementById('stat_' + cat);
    const pctEl = document.getElementById('pct_' + cat);
    if (amtEl) amtEl.textContent = fmt(amounts[i]);
    if (pctEl) pctEl.textContent = alloc[cat] + '%';
  });

  // Update chart data in-place if it exists, else create it
  if (salaryChart) {
    salaryChart.data.datasets[0].data = amounts;
    salaryChart.update();
  } else {
    const ctx = document.getElementById('salaryChart').getContext('2d');
    salaryChart = buildDonut(ctx, CATEGORIES, amounts, COLOR_VALUES);
  }
}

function applySalary() {
  const val = parseFloat(document.getElementById('salaryInput').value);
  if (!val || val <= 0) return alert('Please enter a valid salary.');
  localStorage.setItem('ssm_salary', val);
  renderDashboard(val);
}

// Re-render whenever allocation is saved from the Allocation page (same tab)
window.addEventListener('storage', (e) => {
  if (e.key === 'ssm_allocation' || e.key === 'ssm_salary') {
    renderDashboard(getSalary());
  }
});
