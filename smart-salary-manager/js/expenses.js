// ===== EXPENSES LOGIC =====

let expenseChart = null;

function getExpenses() {
  return JSON.parse(localStorage.getItem('ssm_expenses') || '[]');
}

function saveExpenses(list) {
  localStorage.setItem('ssm_expenses', JSON.stringify(list));
}

function initExpenses() {
  renderExpenses();
}

function addExpense() {
  const name = document.getElementById('expName').value.trim();
  const amount = parseFloat(document.getElementById('expAmount').value);
  const category = document.getElementById('expCategory').value;

  if (!name || !amount || amount <= 0) return alert('Please fill in all fields.');

  const list = getExpenses();
  list.push({ id: Date.now(), name, amount, category });
  saveExpenses(list);

  // Reset form
  document.getElementById('expName').value = '';
  document.getElementById('expAmount').value = '';
  renderExpenses();
}

function deleteExpense(id) {
  const list = getExpenses().filter(e => e.id !== id);
  saveExpenses(list);
  renderExpenses();
}

function renderExpenses() {
  const list = getExpenses();
  const tbody = document.getElementById('expTable');
  const total = list.reduce((s, e) => s + e.amount, 0);

  tbody.innerHTML = list.length === 0
    ? '<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">No expenses yet</td></tr>'
    : list.map(e => `
        <tr>
          <td>${e.name}</td>
          <td><span class="badge badge-primary">${e.category}</span></td>
          <td>${fmt(e.amount)}</td>
          <td><button class="btn btn-danger btn-sm" onclick="deleteExpense(${e.id})">Delete</button></td>
        </tr>`).join('');

  document.getElementById('totalExpenses').textContent = fmt(total);
  renderExpenseChart(list);
}

function renderExpenseChart(list) {
  // Group by category
  const grouped = {};
  list.forEach(e => { grouped[e.category] = (grouped[e.category] || 0) + e.amount; });
  const labels = Object.keys(grouped);
  const data = Object.values(grouped);
  const colors = labels.map((_, i) => COLOR_VALUES[i % COLOR_VALUES.length]);

  const ctx = document.getElementById('expenseChart').getContext('2d');
  if (expenseChart) expenseChart.destroy();
  expenseChart = buildBar(ctx, labels, data, colors, 'Expenses');
}
