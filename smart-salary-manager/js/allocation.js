// ===== ALLOCATION LOGIC =====

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

function saveAllocation() {
  const alloc = {};
  CATEGORIES.forEach(cat => {
    alloc[cat] = parseInt(document.getElementById('slider_' + cat).value);
  });
  localStorage.setItem('ssm_allocation', JSON.stringify(alloc));
  alert('✅ Allocation saved successfully!');
}
