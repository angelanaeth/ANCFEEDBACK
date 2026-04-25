// RUN TAB FUNCTIONS - Load and render test history for all 6 run calculators

async function loadRunTestHistories() {
  if (!window.athleteId) {
    console.log('⚠️ No athleteId found');
    return;
  }

  try {
    // Load all 6 run test histories in parallel
    await Promise.all([
      loadRunCSHistory(),
      loadRunBestEffortHistory(),
      loadRunPaceZonesHistory(),
      loadRunVO2History(),
      loadRunCHOHistory(),
      loadRunTrainingZonesHistory()
    ]);

    // Update metric cards with latest data
    updateRunMetricCards();
    
  } catch (error) {
    console.error('❌ Error loading run test histories:', error);
  }
}

// Update run metric cards with latest values
function updateRunMetricCards() {
  if (!currentAthlete) return;
  
  // Update CS metric
  const csValue = document.getElementById('run-cs-value');
  const csSource = document.getElementById('run-cs-source');
  const csUpdated = document.getElementById('run-cs-updated');
  
  if (currentAthlete.run_cs_seconds) {
    const minutes = Math.floor(currentAthlete.run_cs_seconds / 60);
    const seconds = Math.round(currentAthlete.run_cs_seconds % 60);
    csValue.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    csSource.textContent = currentAthlete.run_cs_source || 'Manual';
    csUpdated.textContent = currentAthlete.run_cs_updated ? new Date(currentAthlete.run_cs_updated).toLocaleDateString() : '';
  }
  
  // Update D' metric
  const dprimeValue = document.getElementById('run-dprime-value');
  const dprimeSource = document.getElementById('run-dprime-source');
  const dprimeUpdated = document.getElementById('run-dprime-updated');
  
  if (currentAthlete.run_d_prime) {
    dprimeValue.textContent = Math.round(currentAthlete.run_d_prime);
    dprimeSource.textContent = currentAthlete.run_d_prime_source || 'Manual';
    dprimeUpdated.textContent = currentAthlete.run_d_prime_updated ? new Date(currentAthlete.run_d_prime_updated).toLocaleDateString() : '';
  }
  
  // Update vVO2max metric
  const vvo2Value = document.getElementById('run-vvo2-value');
  const vvo2Source = document.getElementById('run-vvo2-source');
  const vvo2Updated = document.getElementById('run-vvo2-updated');
  
  if (currentAthlete.run_vvo2max_seconds) {
    const minutes = Math.floor(currentAthlete.run_vvo2max_seconds / 60);
    const seconds = Math.round(currentAthlete.run_vvo2max_seconds % 60);
    vvo2Value.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    vvo2Source.textContent = 'Calculator';
    vvo2Updated.textContent = currentAthlete.run_cs_updated ? new Date(currentAthlete.run_cs_updated).toLocaleDateString() : '';
  }
}

// 1. Critical Speed History
async function loadRunCSHistory() {
  try {
    const response = await axios.get(`/api/athlete-profile/${window.athleteId}/test-history/run-cs`);
    renderRunCSHistory(response.data.tests || []);
  } catch (error) {
    console.error('Error loading run CS history:', error);
  }
}

function renderRunCSHistory(tests) {
  const tbody = document.getElementById('run-cs-history-tbody');
  if (!tbody) return;
  
  if (!tests || tests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No CS tests saved yet</td></tr>';
    return;
  }
  
  tbody.innerHTML = tests.map(test => {
    const csFormatted = test.cs_pace_formatted || formatPace(test.cs_pace_seconds);
    const dPrime = Math.round(test.d_prime || 0);
    return `
      <tr>
        <td>${formatDate(test.test_date)}</td>
        <td>${csFormatted} /mile</td>
        <td>${dPrime} m</td>
        <td>${test.test_type || 'Manual'}</td>
        <td>${test.source || 'Calculator'}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="deleteRunTest('run-cs', ${test.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// 2. Best Effort Pace History
async function loadRunBestEffortHistory() {
  try {
    const response = await axios.get(`/api/athlete-profile/${window.athleteId}/test-history/run-best-effort`);
    renderRunBestEffortHistory(response.data.tests || []);
  } catch (error) {
    console.error('Error loading run best effort history:', error);
  }
}

function renderRunBestEffortHistory(tests) {
  const tbody = document.getElementById('run-best-effort-history-tbody');
  if (!tbody) return;
  
  if (!tests || tests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No best effort tests saved yet</td></tr>';
    return;
  }
  
  tbody.innerHTML = tests.map(test => {
    const csFormatted = test.cs_pace_formatted || formatPace(test.cs_pace_seconds);
    const dPrime = Math.round(test.d_prime || 0);
    const intervals = JSON.parse(test.intervals || '[]');
    const intervalCount = intervals.length;
    return `
      <tr>
        <td>${formatDate(test.test_date)}</td>
        <td>${csFormatted} /mile</td>
        <td>${dPrime} m</td>
        <td>${intervalCount} intervals</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="deleteRunTest('run-best-effort', ${test.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// 3. Run Pace Zones History
async function loadRunPaceZonesHistory() {
  try {
    const response = await axios.get(`/api/athlete-profile/${window.athleteId}/test-history/run-pace-zones`);
    renderRunPaceZonesHistory(response.data.tests || []);
  } catch (error) {
    console.error('Error loading run pace zones history:', error);
  }
}

function renderRunPaceZonesHistory(tests) {
  const tbody = document.getElementById('run-pace-zones-history-tbody');
  if (!tbody) return;
  
  if (!tests || tests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No pace zones saved yet</td></tr>';
    return;
  }
  
  tbody.innerHTML = tests.map(test => {
    const csFormatted = formatPace(test.cs_pace_seconds);
    const zones = JSON.parse(test.zones || '[]');
    const zoneCount = zones.length;
    return `
      <tr>
        <td>${formatDate(test.test_date)}</td>
        <td>${csFormatted} /mile</td>
        <td>${zoneCount} zones</td>
        <td>${test.source || 'Calculator'}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="deleteRunTest('run-pace-zones', ${test.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// 4. Run VO2 Max Intervals History
async function loadRunVO2History() {
  try {
    const response = await axios.get(`/api/athlete-profile/${window.athleteId}/test-history/run-vo2`);
    renderRunVO2History(response.data.tests || []);
  } catch (error) {
    console.error('Error loading run VO2 history:', error);
  }
}

function renderRunVO2History(tests) {
  const tbody = document.getElementById('run-vo2-history-tbody');
  if (!tbody) return;
  
  if (!tests || tests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No VO2 prescriptions saved yet</td></tr>';
    return;
  }
  
  tbody.innerHTML = tests.map(test => {
    const csFormatted = formatPace(test.cs_pace_seconds);
    const vvo2Formatted = test.vvo2max_pace_formatted || formatPace(test.vvo2max_pace_seconds);
    const dPrime = Math.round(test.d_prime || 0);
    const intervals = JSON.parse(test.intervals || '[]');
    const intervalCount = intervals.length;
    return `
      <tr>
        <td>${formatDate(test.test_date)}</td>
        <td>${csFormatted} /mile</td>
        <td>${vvo2Formatted} /mile</td>
        <td>${dPrime} m</td>
        <td>${intervalCount} prescriptions</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="deleteRunTest('run-vo2', ${test.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// 5. Run CHO Burn History
async function loadRunCHOHistory() {
  try {
    const response = await axios.get(`/api/athlete-profile/${window.athleteId}/test-history/run-cho`);
    renderRunCHOHistory(response.data.tests || []);
  } catch (error) {
    console.error('Error loading run CHO history:', error);
  }
}

function renderRunCHOHistory(tests) {
  const tbody = document.getElementById('run-cho-history-tbody');
  if (!tbody) return;
  
  if (!tests || tests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No CHO burn tests saved yet</td></tr>';
    return;
  }
  
  tbody.innerHTML = tests.map(test => {
    return `
      <tr>
        <td>${formatDate(test.test_date)}</td>
        <td>${test.weight_kg} kg</td>
        <td>${test.intensity || 'N/A'}</td>
        <td>${test.duration_min} min</td>
        <td>${test.carb_burn_per_hour.toFixed(1)} g/hr</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="deleteRunTest('run-cho', ${test.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// 6. Run Training Zones History
async function loadRunTrainingZonesHistory() {
  try {
    const response = await axios.get(`/api/athlete-profile/${window.athleteId}/test-history/run-training-zones`);
    renderRunTrainingZonesHistory(response.data.tests || []);
  } catch (error) {
    console.error('Error loading run training zones history:', error);
  }
}

function renderRunTrainingZonesHistory(tests) {
  const tbody = document.getElementById('run-training-zones-history-tbody');
  if (!tbody) return;
  
  if (!tests || tests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No training zones saved yet</td></tr>';
    return;
  }
  
  tbody.innerHTML = tests.map(test => {
    const csFormatted = formatPace(test.cs_pace_seconds);
    const zones = JSON.parse(test.zones || '[]');
    const zoneCount = zones.length;
    return `
      <tr>
        <td>${formatDate(test.test_date)}</td>
        <td>${csFormatted} /mile</td>
        <td>${zoneCount} zones</td>
        <td>${test.source || 'Calculator'}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="deleteRunTest('run-training-zones', ${test.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// Delete run test
async function deleteRunTest(calculatorType, testId) {
  if (!confirm('Are you sure you want to delete this test?')) return;
  
  try {
    await axios.delete(`/api/athlete-profile/${window.athleteId}/test-history/${testId}`, {
      data: { calculator_type: calculatorType }
    });
    
    alert('✅ Test deleted successfully');
    
    // Reload the specific history
    switch(calculatorType) {
      case 'run-cs': await loadRunCSHistory(); break;
      case 'run-best-effort': await loadRunBestEffortHistory(); break;
      case 'run-pace-zones': await loadRunPaceZonesHistory(); break;
      case 'run-vo2': await loadRunVO2History(); break;
      case 'run-cho': await loadRunCHOHistory(); break;
      case 'run-training-zones': await loadRunTrainingZonesHistory(); break;
    }
  } catch (error) {
    console.error('Error deleting run test:', error);
    alert('❌ Error deleting test');
  }
}

// Helper function to format pace (seconds to MM:SS)
function formatPace(seconds) {
  if (!seconds) return '--:--';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Helper function to format date
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Edit functions (placeholder alerts for now)
function toggleRunCSEdit() {
  alert('CS editing coming soon!');
}

function toggleRunDPrimeEdit() {
  alert('D\' editing coming soon!');
}

function toggleRunVVO2Edit() {
  alert('vVO₂max editing coming soon!');
}
