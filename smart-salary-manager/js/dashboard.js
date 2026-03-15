// ===== DASHBOARD LOGIC =====

let salaryChart = null;

function initDashboard() {
  const salary = getSalary();
  if (salary) document.getElementById('salaryInput').value = salary;
  renderDashboard(salary);
}

function renderDashboard(salary) {
  const alloc = getAllocation();
  const amounts = CATEGORIES.map(c => ((alloc[c] / 100) * salary));

  // Update stat cards
  CATEGORIES.forEach((cat, i) => {
    const el = document.getElementById('stat_' + cat);
    if (el) el.textContent = fmt(amounts[i]);
  });

  // Update or create chart
  const ctx = document.getElementById('salaryChart').getContext('2d');
  if (salaryChart) salaryChart.destroy();
  salaryChart = buildDonut(ctx, CATEGORIES, amounts, COLOR_VALUES);
}

function applySalary() {
  const val = parseFloat(document.getElementById('salaryInput').value);
  if (!val || val <= 0) return alert('Please enter a valid salary.');
  localStorage.setItem('ssm_salary', val);
  renderDashboard(val);
}
