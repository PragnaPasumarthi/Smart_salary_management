// ===== ALLOCATION LOGIC =====

let allocChart = null;

function initAllocation() {
  const alloc = getAllocation();
  const salary = getSalary();

  CATEGORIES.forEach(cat => {
    const slider = document.getElementById('slider_' + cat);
    if (slider) {
      slider.value = alloc[cat];
      updateSliderDisplay(cat, alloc[cat], salary);
    }
  });
  updateTotal();
  renderAllocChart();
}

function updateSliderDisplay(cat, pct, salary) {
  salary = salary || getSalary();
  const valEl = document.getElementById('val_' + cat);
  const amtEl = document.getElementById('amt_' + cat);
  if (valEl) valEl.textContent = pct + '%';
  if (amtEl) amtEl.textContent = fmt((pct / 100) * salary);
}

function onSliderChange(cat) {
  const slider = document.getElementById('slider_' + cat);
  updateSliderDisplay(cat, parseInt(slider.value));
  updateTotal();
  renderAllocChart();   // live chart update on every slider move
}

function updateTotal() {
  let total = 0;
  CATEGORIES.forEach(cat => {
    total += parseInt(document.getElementById('slider_' + cat).value || 0);
  });

  const bar = document.getElementById('totalBar');
  const label = document.getElementById('totalLabel');
  const pct = Math.min(total, 100);

  bar.style.width = pct + '%';
  bar.className = 'progress-bar-fill' + (total > 100 ? ' over' : total === 100 ? ' done' : '');
  label.textContent = total + '%';
  label.className = total > 100 ? 'over' : total === 100 ? 'done' : '';

  document.getElementById('saveAllocBtn').disabled = total !== 100;
}

// Render/update the live donut chart from current slider values
function renderAllocChart() {
  const salary = getSalary();
  const data = CATEGORIES.map(cat => {
    const slider = document.getElementById('slider_' + cat);
    return slider ? ((parseInt(slider.value) / 100) * salary) : 0;
  });

  const ctx = document.getElementById('allocChart').getContext('2d');

  if (allocChart) {
    // Update existing chart data in-place for smooth animation
    allocChart.data.datasets[0].data = data;
    allocChart.update();
  } else {
    allocChart = buildDonut(ctx, CATEGORIES, data, COLOR_VALUES);
  }
}

function saveAllocation() {
  const alloc = {};
  CATEGORIES.forEach(cat => {
    alloc[cat] = parseInt(document.getElementById('slider_' + cat).value);
  });
  // Save to localStorage — dashboard will pick this up on next load / storage event
  localStorage.setItem('ssm_allocation', JSON.stringify(alloc));
  alert('✅ Allocation saved! Dashboard chart updated.');
}
