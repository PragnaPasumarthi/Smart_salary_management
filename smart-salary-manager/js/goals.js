// ===== GOALS LOGIC =====

let goalsLineChart = null;

function getGoals() {
  return JSON.parse(localStorage.getItem('ssm_goals') || '[]');
}

function saveGoals(list) {
  localStorage.setItem('ssm_goals', JSON.stringify(list));
}

function initGoals() {
  renderGoals();
  renderGoalsChart();
}

function addGoal() {
  const name = document.getElementById('goalName').value.trim();
  const target = parseFloat(document.getElementById('goalTarget').value);
  const saved = parseFloat(document.getElementById('goalSaved').value) || 0;
  const type = document.getElementById('goalType').value;

  if (!name || !target || target <= 0) return alert('Please fill in all fields.');

  const list = getGoals();
  list.push({ id: Date.now(), name, target, saved, type });
  saveGoals(list);

  document.getElementById('goalName').value = '';
  document.getElementById('goalTarget').value = '';
  document.getElementById('goalSaved').value = '';
  renderGoals();
  renderGoalsChart();
}

function deleteGoal(id) {
  saveGoals(getGoals().filter(g => g.id !== id));
  renderGoals();
  renderGoalsChart();
}

function renderGoals() {
  const list = getGoals();
  const container = document.getElementById('goalsGrid');

  if (list.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted)">No goals yet. Add one above!</p>';
    return;
  }

  container.innerHTML = list.map(g => {
    const pct = Math.min(Math.round((g.saved / g.target) * 100), 100);
    const color = pct >= 100 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--primary)';
    return `
      <div class="goal-card">
        <div style="display:flex;justify-content:space-between;align-items:start">
          <div>
            <h4>${g.name}</h4>
            <div class="meta">${g.type} • Target: ${fmt(g.target)}</div>
          </div>
          <button class="btn btn-danger btn-sm" onclick="deleteGoal(${g.id})">✕</button>
        </div>
        <div class="progress-label">
          <span>Saved: ${fmt(g.saved)}</span>
          <span>${pct}%</span>
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width:${pct}%;background:${color}"></div>
        </div>
      </div>`;
  }).join('');
}

function renderGoalsChart() {
  const list = getGoals();
  // Simulate 6-month savings progress using saved amounts
  const months = ['Jan','Feb','Mar','Apr','May','Jun'];
  const ctx = document.getElementById('goalsChart').getContext('2d');
  if (goalsLineChart) goalsLineChart.destroy();

  if (list.length === 0) return;

  const datasets = list.slice(0, 3).map((g, i) => ({
    label: g.name,
    data: months.map((_, mi) => Math.min(g.saved * ((mi + 1) / 6), g.target)),
    borderColor: COLOR_VALUES[i],
    backgroundColor: COLOR_VALUES[i] + '22',
    fill: true
  }));

  goalsLineChart = buildLine(ctx, months, datasets);
}
