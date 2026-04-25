    renderBikeBestEffortHistory(bestEffortTests);
    renderBikeLowCadenceHistory(lowCadenceTests);
    renderBikeCHOHistory(choTests);
    renderBikeTrainingZonesHistory(trainingZonesTests);
    renderBikeLT1OGCHistory(lt1ogcTests);

    // Update main metric cards from most recent tests
    updateBikeMetricCards();

  } catch (error) {
    console.error('Error loading bike test histories:', error);
  }
}

// ===== RENDER FUNCTIONS =====
function renderBikeCPHistory(tests) {
  const tbody = document.getElementById('bikeCPHistoryBody');
  if (!tbody) return;

  if (!tests || tests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No test history. Use Toolkit to calculate.</td></tr>';
    return;
  }

  tbody.innerHTML = tests.map(test => `
    <tr>
      <td>${formatDate(test.test_date)}</td>
      <td><strong>${test.cp_watts} W</strong></td>
      <td>${test.w_prime || '---'} J</td>
      <td><small>${test.test_data ? JSON.stringify(test.test_data).substring(0, 50) + '...' : '---'}</small></td>
      <td><span class="badge bg-secondary">${test.source}</span></td>
      <td>
        <button class="btn-icon-small" onclick="editBikeCPTest(${test.id})" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-icon-small" onclick="deleteBikeTest('bike-cp', ${test.id})" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function renderBikeZonesHistory(tests) {
  const tbody = document.getElementById('bikeZonesHistoryBody');
  if (!tbody) return;

  if (!tests || tests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No zone calculations. Use Toolkit.</td></tr>';
    return;
  }

  tbody.innerHTML = tests.map(test => `
    <tr>
      <td>${formatDate(test.test_date)}</td>
      <td><strong>${test.cp_watts} W</strong></td>
      <td>${test.lt1_watts || '---'} W</td>
      <td>${test.ogc_watts || '---'} W</td>
      <td><button class="btn btn-sm btn-link" onclick="viewBikeZones(${test.id})">View Zones</button></td>
      <td><span class="badge bg-secondary">${test.source}</span></td>
      <td>
        <button class="btn-icon-small" onclick="deleteBikeTest('bike-zones', ${test.id})" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function renderBikeVO2History(tests) {
  const tbody = document.getElementById('bikeVO2HistoryBody');
  if (!tbody) return;

  if (!tests || tests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No VO₂ prescriptions. Use Toolkit.</td></tr>';
    return;
  }

  tbody.innerHTML = tests.map(test => `
    <tr>
      <td>${formatDate(test.test_date)}</td>
      <td><strong>${test.cp_watts} W</strong></td>
      <td>${test.w_prime || '---'} J</td>
      <td>${test.pvo2max_watts || '---'} W</td>
      <td><button class="btn btn-sm btn-link" onclick="viewVO2Protocols(${test.id})">View Protocols</button></td>
      <td><span class="badge bg-secondary">${test.source}</span></td>
      <td>
        <button class="btn-icon-small" onclick="deleteBikeTest('bike-vo2', ${test.id})" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function renderBikeBestEffortHistory(tests) {
  const tbody = document.getElementById('bikeBestEffortHistoryBody');
  if (!tbody) return;

  if (!tests || tests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No best effort data. Use Toolkit.</td></tr>';
    return;
  }

  tbody.innerHTML = tests.map(test => `
    <tr>
      <td>${formatDate(test.test_date)}</td>
      <td><strong>${test.cp_watts} W</strong></td>
      <td>${test.w_prime || '---'} J</td>
      <td><button class="btn btn-sm btn-link" onclick="viewIntervalTargets(${test.id})">View Targets</button></td>
      <td><span class="badge bg-secondary">${test.source}</span></td>
      <td>
        <button class="btn-icon-small" onclick="deleteBikeTest('bike-best-effort', ${test.id})" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function renderBikeLowCadenceHistory(tests) {
  const tbody = document.getElementById('bikeLowCadenceHistoryBody');
  if (!tbody) return;

  if (!tests || tests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No low cadence data. Use Toolkit.</td></tr>';
    return;
  }

  tbody.innerHTML = tests.map(test => `
    <tr>
      <td>${formatDate(test.test_date)}</td>
      <td><strong>${test.cp_watts} W</strong></td>
      <td>${test.target_cadence_low || '---'} - ${test.target_cadence_high || '---'} rpm</td>
      <td><button class="btn btn-sm btn-link" onclick="viewPowerTargets(${test.id})">View Targets</button></td>
      <td><span class="badge bg-secondary">${test.source}</span></td>
      <td>
        <button class="btn-icon-small" onclick="deleteBikeTest('bike-low-cadence', ${test.id})" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function renderBikeCHOHistory(tests) {
  const tbody = document.getElementById('bikeCHOHistoryBody');
  if (!tbody) return;

  if (!tests || tests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No CHO burn data. Use Toolkit.</td></tr>';
    return;
  }

  tbody.innerHTML = tests.map(test => `
    <tr>
      <td>${formatDate(test.test_date)}</td>
      <td>${test.duration_minutes || '---'} min</td>
      <td><strong>${test.power_watts} W</strong></td>
      <td>${test.total_kj || '---'} kJ</td>
      <td>${test.cho_grams || '---'} g</td>
      <td><span class="badge bg-secondary">${test.source}</span></td>
      <td>
        <button class="btn-icon-small" onclick="deleteBikeTest('bike-cho', ${test.id})" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function renderBikeTrainingZonesHistory(tests) {
  const tbody = document.getElementById('bikeTrainingZonesHistoryBody');
  if (!tbody) return;

  if (!tests || tests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No training zones. Use Toolkit.</td></tr>';
    return;
  }

  tbody.innerHTML = tests.map(test => `
    <tr>
      <td>${formatDate(test.test_date)}</td>
      <td><strong>${test.bike_cp || '---'} W</strong></td>
      <td>${test.run_cp || '---'} W</td>
      <td><button class="btn btn-sm btn-link" onclick="viewHRZones(${test.id})">View Zones</button></td>
      <td><span class="badge bg-secondary">${test.source}</span></td>
      <td>
        <button class="btn-icon-small" onclick="deleteBikeTest('bike-training-zones', ${test.id})" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function renderBikeLT1OGCHistory(tests) {
  const tbody = document.getElementById('bikeLT1OGCHistoryBody');
  if (!tbody) return;

  if (!tests || tests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No LT1/OGC analysis. Use Toolkit.</td></tr>';
    return;
  }

  tbody.innerHTML = tests.map(test => `
    <tr>
      <td>${formatDate(test.test_date)}</td>
      <td><strong>${test.cp_watts} W</strong></td>
      <td>${test.lt1_watts || '---'} W</td>
      <td>${test.ogc_watts || '---'} W</td>
      <td>${test.lt1_hr || '---'} bpm</td>
      <td>${test.ogc_hr || '---'} bpm</td>
      <td><span class="badge bg-secondary">${test.source}</span></td>
      <td>
        <button class="btn-icon-small" onclick="deleteBikeTest('bike-lt1-ogc', ${test.id})" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// ===== UPDATE METRIC CARDS =====
function updateBikeMetricCards() {
  if (!currentAthlete) return;

  // Update CP card
  if (currentAthlete.bike_cp) {
    document.getElementById('bikeCPValue').textContent = currentAthlete.bike_cp;
    document.getElementById('bikeCPSource').textContent = currentAthlete.bike_cp_source || 'Manual';
    if (currentAthlete.bike_cp_updated_at) {
      document.getElementById('bikeCPUpdated').textContent = 'Updated: ' + formatDate(currentAthlete.bike_cp_updated_at);
    }
  }

  // Update W' card
  if (currentAthlete.bike_w_prime) {
    document.getElementById('bikeWPrimeValue').textContent = currentAthlete.bike_w_prime;
    document.getElementById('bikeWPrimeSource').textContent = 'Calculated';
  }

  // Update Power @ VO2max card
  if (currentAthlete.bike_pvo2max) {
    document.getElementById('bikePVO2Value').textContent = currentAthlete.bike_pvo2max;
    document.getElementById('bikePVO2Source').textContent = 'Calculated';
  }

  // Update LT1 card with % of CP
  if (currentAthlete.bike_lt1_watts) {
    document.getElementById('bikeLT1Value').textContent = currentAthlete.bike_lt1_watts;
    if (currentAthlete.bike_cp) {
      const percent = Math.round((currentAthlete.bike_lt1_watts / currentAthlete.bike_cp) * 100);
      document.getElementById('bikeLT1Percent').textContent = `(${percent}% of CP)`;
    }
    document.getElementById('bikeLT1Source').textContent = 'LT1/OGC Test';
  }

  // Update OGC card with % of CP
  if (currentAthlete.bike_ogc_watts) {
    document.getElementById('bikeOGCValue').textContent = currentAthlete.bike_ogc_watts;
    if (currentAthlete.bike_cp) {
      const percent = Math.round((currentAthlete.bike_ogc_watts / currentAthlete.bike_cp) * 100);
      document.getElementById('bikeOGCPercent').textContent = `(${percent}% of CP)`;
    }
    document.getElementById('bikeOGCSource').textContent = 'LT1/OGC Test';
  }
}

// ===== HELPER FUNCTIONS =====
function toggleBikeCPEdit() {
  const form = document.getElementById('bikeCPEditForm');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

async function saveBikeCPManual() {
  const cp = parseInt(document.getElementById('bikeCPInput').value);
  if (!cp || cp <= 0) {
    alert('Please enter a valid CP value');
    return;
  }

  try {
    const response = await fetch(`/api/athlete-profile/${window.athleteId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bike_cp: cp,
        bike_cp_source: 'manual',
        bike_cp_updated_at: new Date().toISOString()
      })
    });

    if (response.ok) {
      alert('✅ CP updated successfully!');
      loadAthleteProfile(window.athleteId);
      toggleBikeCPEdit();
    } else {
      alert('❌ Failed to update CP');
    }
  } catch (error) {
    console.error('Error saving CP:', error);
    alert('❌ Error saving CP');
  }
}

async function deleteBikeTest(calculatorType, testId) {
  if (!confirm('Are you sure you want to delete this test?')) return;

  try {
    const response = await fetch(`/api/athlete-profile/${window.athleteId}/test-history/${testId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ calculator_type: calculatorType })
    });

    if (response.ok) {
      alert('✅ Test deleted successfully!');
      loadBikeTestHistories();
    } else {
      alert('❌ Failed to delete test');
    }
  } catch (error) {
    console.error('Error deleting test:', error);
    alert('❌ Error deleting test');
  }
}

// Placeholder functions for modal/detail views
function viewBikeZones(testId) {
  alert('Zone details view coming soon! Test ID: ' + testId);
}

function viewVO2Protocols(testId) {
  alert('VO₂ protocols view coming soon! Test ID: ' + testId);
}

function viewIntervalTargets(testId) {
  alert('Interval targets view coming soon! Test ID: ' + testId);
}

function viewPowerTargets(testId) {
  alert('Power targets view coming soon! Test ID: ' + testId);
}

function viewHRZones(testId) {
  alert('HR zones view coming soon! Test ID: ' + testId);
}

// Add manual test placeholders
function addBikeCPTestManual() {
  alert('Manual CP test entry coming soon!');
}

function addBikeZonesTestManual() {
  alert('Manual zones test entry coming soon!');
}

function addBikeVO2TestManual() {
  alert('Manual VO₂ test entry coming soon!');
}

function addBikeBestEffortManual() {
  alert('Manual best effort entry coming soon!');
}

function addBikeLowCadenceManual() {
  alert('Manual low cadence entry coming soon!');
}

function addBikeCHOManual() {
  alert('Manual CHO burn entry coming soon!');
}

function addBikeTrainingZonesManual() {
  alert('Manual training zones entry coming soon!');
}

function addBikeLT1OGCManual() {
  alert('Manual LT1/OGC entry coming soon!');
}

// Other edit toggles
function toggleBikeWPrimeEdit() {
  alert('W\' editing coming soon!');
}

function toggleBikePVO2Edit() {
  alert('Power @ VO₂max editing coming soon!');
}

function toggleBikeLT1Edit() {
  alert('LT1 editing coming soon!');
}

function toggleBikeOGCEdit() {
  alert('OGC editing coming soon!');
}
</script>

<style>
/* Metric Cards */
.metric-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.metric-header h4 {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-main {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
}

.metric-unit {
  font-size: 14px;
  color: #6b7280;
}

.metric-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #9ca3af;
}

.metric-percent {
  font-size: 14px;
  color: #6b7280;
  margin-left: 8px;
}

.btn-icon {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 14px;
}

.btn-icon:hover {
  color: #111827;
}

/* Edit Form */
.edit-form-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.edit-form-card h5 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

/* History Section */
.history-section {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.history-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table thead {
  background: #f9fafb;
}

.history-table th {
  padding: 12px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e5e7eb;
}

.history-table td {
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
}

.btn-icon-small {
  background: none;
  border: none;
  color: #6b7280;
