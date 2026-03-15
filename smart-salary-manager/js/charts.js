// ===== SHARED CHART UTILITIES =====

// Category colors used across all charts
const CATEGORY_COLORS = {
  Investment:  '#4f46e5',
  Savings:     '#06b6d4',
  Maintenance: '#10b981',
  Luxury:      '#f59e0b',
  Education:   '#8b5cf6',
  Emergency:   '#ef4444'
};

const CATEGORIES = Object.keys(CATEGORY_COLORS);
const COLOR_VALUES = Object.values(CATEGORY_COLORS);

// Default allocation percentages
const DEFAULT_ALLOC = { Investment:20, Savings:20, Maintenance:30, Luxury:10, Education:10, Emergency:10 };

// Load allocation from localStorage or use defaults
function getAllocation() {
  return JSON.parse(localStorage.getItem('ssm_allocation') || JSON.stringify(DEFAULT_ALLOC));
}

// Load salary from localStorage
function getSalary() {
  return parseFloat(localStorage.getItem('ssm_salary') || '0');
}

// Format currency
function fmt(n) {
  return '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0 });
}

// Build a donut/pie chart
function buildDonut(ctx, labels, data, colors) {
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff' }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { padding: 12, font: { size: 11 } } } },
      cutout: '60%'
    }
  });
}

// Build a bar chart
function buildBar(ctx, labels, data, colors, label = 'Amount') {
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label, data, backgroundColor: colors, borderRadius: 6, borderSkipped: false }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } }
    }
  });
}

// Build a line chart
function buildLine(ctx, labels, datasets) {
  return new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
        x: { grid: { display: false } }
      },
      elements: { line: { tension: 0.4 }, point: { radius: 4 } }
    }
  });
}
