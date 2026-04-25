    let currentAthlete = null;
    let athleteId = null;

    // Load athlete on page load
    document.addEventListener('DOMContentLoaded', async () => {
      const urlParams = new URLSearchParams(window.location.search);
      athleteId = urlParams.get('athlete');
      
      if (!athleteId) {
        alert('No athlete ID provided!');
        window.location.href = '/static/coach.html';
        return;
      }
      
      // Update toolkit link
      const toolkitBtn = document.getElementById('toolkitBtn');
      if (toolkitBtn) {
        toolkitBtn.href = `/static/athlete-calculators.html?athlete=${athleteId}`;
      }
      
      await loadAthleteProfile();
      await loadRaces(); // Load races from TrainingPeaks
    });

    async function loadAthleteProfile() {
      try {
        console.log('📥 Loading athlete profile for ID:', athleteId);
        const response = await axios.get(`/api/athlete-profile/${athleteId}`);
        currentAthlete = response.data;
        console.log('✅ Profile loaded:', currentAthlete);
        console.log('🏊 CSS from API:', currentAthlete.css_pace, 'seconds');
        
        // Update header
        document.getElementById('athleteName').textContent = currentAthlete.name || 'Athlete';
        document.getElementById('athleteId').textContent = athleteId;
        
        // Update athlete info display
        updateAthleteInfoDisplay();
        
        // Load CSS
        loadCSSData();
        loadFTPData();
        loadRunFTPData();
        
        // Load test histories
        loadCSSTestHistory();
        loadSwimIntervalHistory();
        loadSwimCHOHistory();
        loadBikeTestHistories(); // Load all 8 bike test histories
        
        // Load calculator outputs
        loadCalculatorOutputs();
        
      } catch (error) {
        console.error('Error loading profile:', error);
        alert('Failed to load athlete profile');
      }
    }

    async function loadCalculatorOutputs() {
      try {
        // Display saved calculator outputs for each sport
        displaySwimCalculatorOutputs();
        displayBikeCalculatorOutputs();
        displayRunCalculatorOutputs();
      } catch (error) {
        console.error('Error loading calculator outputs:', error);
      }
    }

    function displaySwimCalculatorOutputs() {
      const container = document.getElementById('swimCalculatorOutputs');
      if (!container) return;

      const outputs = [];
      
      // CSS
      if (currentAthlete.css_pace) {
        const mins = Math.floor(currentAthlete.css_pace / 60);
        const secs = currentAthlete.css_pace % 60;
        outputs.push({
          name: 'Critical Swim Speed',
          value: `${mins}:${secs.toString().padStart(2, '0')} per 100m`,
          date: currentAthlete.css_updated || 'Unknown',
          source: currentAthlete.css_source || 'Manual'
        });
      }

      // Swim Intervals
      if (currentAthlete.swim_intervals_prescription || currentAthlete.swim_intervals) {
        try {
          const data = typeof currentAthlete.swim_intervals_prescription === 'string' 
            ? JSON.parse(currentAthlete.swim_intervals_prescription) 
            : (typeof currentAthlete.swim_intervals === 'string' 
              ? JSON.parse(currentAthlete.swim_intervals)
              : currentAthlete.swim_intervals_prescription || currentAthlete.swim_intervals);
          outputs.push({
            name: 'Swim Interval Pacing',
            value: 'Interval targets calculated',
            date: data?.timestamp || currentAthlete.updated_at || 'Unknown',
            source: 'Calculator'
          });
        } catch (e) {
          console.error('Error parsing swim_intervals:', e);
        }
      }

      // CHO Burn Swim
      if (currentAthlete.cho_swim_prescription) {
        try {
          const data = typeof currentAthlete.cho_swim_prescription === 'string' 
            ? JSON.parse(currentAthlete.cho_swim_prescription) 
            : currentAthlete.cho_swim_prescription;
          outputs.push({
            name: 'CHO Burn (Swim)',
            value: 'Carb burn calculated',
            date: data?.timestamp || currentAthlete.updated_at || 'Unknown',
            source: 'Calculator'
          });
        } catch (e) {
          console.error('Error parsing cho_swim_prescription:', e);
        }
      }

      if (outputs.length === 0) {
        container.innerHTML = `
          <p class="text-center text-muted" style="padding: 32px;">
            No calculator outputs saved yet. Use the <a href="#" onclick="openToolkit('swim'); return false;">Swim Toolkit</a> to calculate and save outputs.
          </p>
        `;
        return;
      }

      container.innerHTML = outputs.map(out => `
        <div class="card mb-2">
          <div class="card-body p-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <strong>${out.name}</strong><br>
                <small class="text-muted">${out.value}</small>
              </div>
              <div class="text-end">
                <small class="text-muted">
                  ${out.source}<br>
                  ${new Date(out.date).toLocaleDateString()}
                </small>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    function displayBikeCalculatorOutputs() {
      const container = document.getElementById('bikeCalculatorOutputs');
      if (!container) return;

      const outputs = [];
      
      // CP
      if (currentAthlete.bike_ftp || currentAthlete.bike_cp) {
        const cpValue = currentAthlete.bike_ftp || currentAthlete.bike_cp;
        outputs.push({
          name: 'Critical Power',
          value: `${cpValue}W`,
          date: currentAthlete.bike_ftp_updated_at || currentAthlete.bike_cp_updated || 'Unknown',
          source: currentAthlete.bike_ftp_source || currentAthlete.bike_cp_source || 'Manual'
        });
      }

      // W'
      if (currentAthlete.bike_w_prime) {
        outputs.push({
          name: "W' (Anaerobic Capacity)",
          value: `${currentAthlete.bike_w_prime}J`,
          date: currentAthlete.bike_w_prime_updated || currentAthlete.bike_ftp_updated_at || 'Unknown',
          source: currentAthlete.bike_w_prime_source || 'Manual'
        });
      }

      // Best Effort Wattage
      if (currentAthlete.best_effort_wattage_prescription) {
        try {
          const data = typeof currentAthlete.best_effort_wattage_prescription === 'string' 
            ? JSON.parse(currentAthlete.best_effort_wattage_prescription) 
            : currentAthlete.best_effort_wattage_prescription;
          outputs.push({
            name: 'Best Effort Wattage',
            value: 'Interval targets calculated',
            date: data.timestamp || currentAthlete.updated_at || 'Unknown',
            source: 'Calculator'
          });
        } catch (e) {
          console.error('Error parsing best_effort_wattage_prescription:', e);
        }
      }

      // Low Cadence
      if (currentAthlete.low_cadence_prescription) {
        try {
          const data = typeof currentAthlete.low_cadence_prescription === 'string' 
            ? JSON.parse(currentAthlete.low_cadence_prescription) 
            : currentAthlete.low_cadence_prescription;
          outputs.push({
            name: 'Low Cadence',
            value: 'Strength intervals calculated',
            date: data.timestamp || currentAthlete.updated_at || 'Unknown',
            source: 'Calculator'
          });
        } catch (e) {
          console.error('Error parsing low_cadence_prescription:', e);
        }
      }

      // CHO Burn Bike
      if (currentAthlete.cho_bike_prescription) {
        try {
          const data = typeof currentAthlete.cho_bike_prescription === 'string' 
            ? JSON.parse(currentAthlete.cho_bike_prescription) 
            : currentAthlete.cho_bike_prescription;
          outputs.push({
            name: 'CHO Burn (Bike)',
            value: 'Carb burn calculated',
            date: data.timestamp || currentAthlete.updated_at || 'Unknown',
            source: 'Calculator'
          });
        } catch (e) {
          console.error('Error parsing cho_bike_prescription:', e);
        }
      }

      // Bike Power Zones
      if (currentAthlete.bike_power_zones && currentAthlete.bike_power_zones_prescription) {
        try {
          const data = typeof currentAthlete.bike_power_zones_prescription === 'string' 
            ? JSON.parse(currentAthlete.bike_power_zones_prescription) 
            : currentAthlete.bike_power_zones_prescription;
          outputs.push({
            name: 'Bike Power Zones (Expanded)',
            value: 'LT1/OGC zones calculated',
            date: data.timestamp || currentAthlete.updated_at || 'Unknown',
            source: 'Calculator'
          });
        } catch (e) {
          console.error('Error parsing bike_power_zones:', e);
        }
      }

      // VO2 Bike
      if (currentAthlete.vo2_bike_prescription) {
        try {
          const data = typeof currentAthlete.vo2_bike_prescription === 'string' 
            ? JSON.parse(currentAthlete.vo2_bike_prescription) 
            : currentAthlete.vo2_bike_prescription;
          outputs.push({
            name: 'VO2 Intervals (Bike)',
            value: 'Interval prescriptions calculated',
            date: data.timestamp || currentAthlete.updated_at || 'Unknown',
            source: 'Calculator'
          });
        } catch (e) {
          console.error('Error parsing vo2_bike_prescription:', e);
        }
      }

      if (outputs.length === 0) {
        container.innerHTML = `
          <p class="text-center text-muted" style="padding: 32px;">
            No calculator outputs saved yet. Use the <a href="#" onclick="openToolkit('bike'); return false;">Bike Toolkit</a> to calculate and save outputs.
          </p>
        `;
        return;
      }

      container.innerHTML = outputs.map(out => `
        <div class="card mb-2">
          <div class="card-body p-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <strong>${out.name}</strong><br>
                <small class="text-muted">${out.value}</small>
              </div>
              <div class="text-end">
                <small class="text-muted">
                  ${out.source}<br>
                  ${new Date(out.date).toLocaleDateString()}
                </small>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    function displayRunCalculatorOutputs() {
      const container = document.getElementById('runCalculatorOutputs');
      if (!container) return;

      const outputs = [];
      
      // CS
      if (currentAthlete.run_cs_seconds) {
        const mins = Math.floor(currentAthlete.run_cs_seconds / 60);
        const secs = currentAthlete.run_cs_seconds % 60;
        outputs.push({
          name: 'Critical Speed',
          value: `${mins}:${secs.toString().padStart(2, '0')} per km`,
          date: currentAthlete.run_cs_updated || 'Unknown',
          source: currentAthlete.run_cs_source || 'Manual'
        });
      }

      // D'
      if (currentAthlete.run_d_prime) {
        outputs.push({
          name: "D' (Anaerobic Reserve)",
          value: `${currentAthlete.run_d_prime}m`,
          date: currentAthlete.run_cs_updated || 'Unknown',
          source: currentAthlete.run_cs_source || 'Manual'
        });
      }

      // Best Effort Pace
      if (currentAthlete.best_effort_pace_prescription) {
        try {
          const data = typeof currentAthlete.best_effort_pace_prescription === 'string' 
            ? JSON.parse(currentAthlete.best_effort_pace_prescription) 
            : currentAthlete.best_effort_pace_prescription;
          outputs.push({
            name: 'Best Effort Pace',
            value: 'Race pacing calculated',
            date: data?.timestamp || currentAthlete.updated_at || 'Unknown',
            source: 'Calculator'
          });
        } catch (e) {
          console.error('Error parsing best_effort_pace_prescription:', e);
        }
      }

      // CHO Burn Run
      if (currentAthlete.cho_run_prescription) {
        try {
          const data = typeof currentAthlete.cho_run_prescription === 'string' 
            ? JSON.parse(currentAthlete.cho_run_prescription) 
            : currentAthlete.cho_run_prescription;
          outputs.push({
            name: 'CHO Burn (Run)',
            value: 'Carb burn calculated',
            date: data?.timestamp || currentAthlete.updated_at || 'Unknown',
            source: 'Calculator'
          });
        } catch (e) {
          console.error('Error parsing cho_run_prescription:', e);
        }
      }

      // VO2 Run
      if (currentAthlete.vo2_run_prescription) {
        try {
          const data = typeof currentAthlete.vo2_run_prescription === 'string' 
            ? JSON.parse(currentAthlete.vo2_run_prescription) 
            : currentAthlete.vo2_run_prescription;
          outputs.push({
            name: 'VO2 Intervals (Run)',
            value: 'Interval prescriptions calculated',
            date: data?.timestamp || currentAthlete.updated_at || 'Unknown',
            source: 'Calculator'
          });
        } catch (e) {
          console.error('Error parsing vo2_run_prescription:', e);
        }
      }

      // LT1/OGC
      if (currentAthlete.lt1_ogc_prescription) {
        try {
          const data = typeof currentAthlete.lt1_ogc_prescription === 'string' 
            ? JSON.parse(currentAthlete.lt1_ogc_prescription) 
            : currentAthlete.lt1_ogc_prescription;
          outputs.push({
            name: 'LT1/OGC Analysis',
            value: 'Threshold analysis completed',
            date: data?.timestamp || currentAthlete.updated_at || 'Unknown',
            source: 'Calculator'
          });
        } catch (e) {
          console.error('Error parsing lt1_ogc_prescription:', e);
        }
      }

      if (outputs.length === 0) {
        container.innerHTML = `
          <p class="text-center text-muted" style="padding: 32px;">
            No calculator outputs saved yet. Use the <a href="#" onclick="openToolkit('run'); return false;">Run Toolkit</a> to calculate and save outputs.
          </p>
        `;
        return;
      }

      container.innerHTML = outputs.map(out => `
        <div class="card mb-2">
          <div class="card-body p-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <strong>${out.name}</strong><br>
                <small class="text-muted">${out.value}</small>
              </div>
              <div class="text-end">
                <small class="text-muted">
                  ${out.source}<br>
                  ${new Date(out.date).toLocaleDateString()}
                </small>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    // ===== CSS TEST HISTORY FUNCTIONS =====
    
    async function loadCSSTestHistory() {
      try {
        const response = await axios.get(`/api/athlete-profile/${athleteId}/test-history/css`);
        const tests = response.data.tests || [];
        renderCSSTestHistory(tests);
      } catch (error) {
        console.error('Error loading CSS test history:', error);
      }
    }

    function renderCSSTestHistory(tests) {
      const tbody = document.getElementById('cssTestHistoryBody');
      if (!tbody) return;
      
      if (tests.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="text-center text-muted" style="padding: 32px;">
              No CSS tests recorded yet. Use the <a href="#" onclick="openToolkit('swim'); return false;">Swim Toolkit</a> to perform a CSS test.
            </td>
          </tr>
        `;
        return;
      }
      
      tbody.innerHTML = tests.map(test => {
        const t200 = test.t200_seconds ? formatTime(test.t200_seconds) : '-';
        const t400 = test.t400_seconds ? formatTime(test.t400_seconds) : '-';
        return `
          <tr>
            <td>${new Date(test.test_date).toLocaleDateString()}</td>
            <td>${t200}</td>
            <td>${t400}</td>
            <td>${test.css_pace_per_100m}</td>
            <td><span class="badge bg-${test.source === 'calculator' ? 'primary' : 'secondary'}">${test.source}</span></td>
            <td>
              <button class="btn btn-sm btn-outline-primary" onclick="editCSSTest(${test.id})" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" onclick="deleteCSSTest(${test.id})" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.round(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    async function addManualCSSTest() {
      const date = prompt('Enter test date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
      if (!date) return;
      
      const t200 = prompt('Enter T200 time (seconds), or leave blank:');
      const t400 = prompt('Enter T400 time (seconds), or leave blank:');
      const cssPace = prompt('Enter CSS pace (MM:SS per 100m):', '1:30');
      if (!cssPace) return;
      
      const [mins, secs] = cssPace.split(':').map(Number);
      const cssSeconds = (mins * 60) + secs;
      
      try {
        await axios.post(`/api/athlete-profile/${athleteId}/test-history`, {
          calculator_type: 'css',
          test_date: date,
          data: {
            t200_seconds: t200 ? parseFloat(t200) : null,
            t400_seconds: t400 ? parseFloat(t400) : null,
            css_seconds: cssSeconds,
            css_pace_per_100m: cssPace
          },
          source: 'manual'
        });
        
        alert('✅ CSS test added successfully!');
        loadCSSTestHistory();
        loadCSSData();
      } catch (error) {
        console.error('Error adding CSS test:', error);
        alert('Failed to add CSS test: ' + error.message);
      }
    }

    async function editCSSTest(testId) {
      // For now, just reload - full edit modal can be added later
      alert('Edit functionality coming soon. For now, please delete and re-add the test.');
    }

    async function deleteCSSTest(testId) {
      if (!confirm('Are you sure you want to delete this CSS test?')) return;
      
      try {
        await axios.delete(`/api/athlete-profile/${athleteId}/test-history/${testId}`, {
          data: { calculator_type: 'css' }
        });
        
        alert('✅ CSS test deleted successfully!');
        loadCSSTestHistory();
        loadCSSData();
      } catch (error) {
        console.error('Error deleting CSS test:', error);
        alert('Failed to delete CSS test: ' + error.message);
      }
    }

    // ===== SWIM INTERVAL HISTORY FUNCTIONS =====
    
    async function loadSwimIntervalHistory() {
      try {
        const response = await axios.get(`/api/athlete-profile/${athleteId}/test-history/swim-intervals`);
        const tests = response.data.tests || [];
        renderSwimIntervalHistory(tests);
      } catch (error) {
        console.error('Error loading swim interval history:', error);
      }
    }

    function renderSwimIntervalHistory(tests) {
      const tbody = document.getElementById('swimIntervalHistoryBody');
      if (!tbody) return;
      
      if (tests.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="5" class="text-center text-muted" style="padding: 32px;">
              No interval pacing saved yet.
            </td>
          </tr>
        `;
        return;
      }
      
      tbody.innerHTML = tests.map(test => {
        const cssDisplay = formatTime(test.css_seconds);
        return `
          <tr>
            <td>${new Date(test.test_date).toLocaleDateString()}</td>
            <td>${cssDisplay} /100m</td>
            <td><small>Zones calculated</small></td>
            <td><span class="badge bg-${test.source === 'calculator' ? 'primary' : 'secondary'}">${test.source}</span></td>
            <td>
              <button class="btn btn-sm btn-outline-danger" onclick="deleteSwimIntervalTest(${test.id})" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    async function deleteSwimIntervalTest(testId) {
      if (!confirm('Are you sure you want to delete this interval pacing calculation?')) return;
      
      try {
        await axios.delete(`/api/athlete-profile/${athleteId}/test-history/${testId}`, {
          data: { calculator_type: 'swim-intervals' }
        });
        
        alert('✅ Interval pacing deleted successfully!');
        loadSwimIntervalHistory();
      } catch (error) {
        console.error('Error deleting swim interval test:', error);
        alert('Failed to delete: ' + error.message);
      }
    }

    // ===== SWIM CHO HISTORY FUNCTIONS =====
    
    async function loadSwimCHOHistory() {
      try {
        const response = await axios.get(`/api/athlete-profile/${athleteId}/test-history/swim-cho`);
        const tests = response.data.tests || [];
        renderSwimCHOHistory(tests);
      } catch (error) {
        console.error('Error loading swim CHO history:', error);
      }
    }

    function renderSwimCHOHistory(tests) {
      const tbody = document.getElementById('swimCHOHistoryBody');
      if (!tbody) return;
      
      if (tests.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="text-center text-muted" style="padding: 32px;">
              No CHO burn tests saved yet.
            </td>
          </tr>
        `;
        return;
      }
      
      tbody.innerHTML = tests.map(test => {
        return `
          <tr>
            <td>${new Date(test.test_date).toLocaleDateString()}</td>
            <td>${test.weight_kg} kg</td>
            <td>${test.intensity}</td>
            <td>${test.duration_minutes} min</td>
            <td>${test.carb_burn_per_hour.toFixed(1)} g/hr</td>
            <td>
              <button class="btn btn-sm btn-outline-danger" onclick="deleteSwimCHOTest(${test.id})" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    async function deleteSwimCHOTest(testId) {
      if (!confirm('Are you sure you want to delete this CHO burn test?')) return;
      
      try {
        await axios.delete(`/api/athlete-profile/${athleteId}/test-history/${testId}`, {
          data: { calculator_type: 'swim-cho' }
        });
        
        alert('✅ CHO burn test deleted successfully!');
        loadSwimCHOHistory();
      } catch (error) {
        console.error('Error deleting swim CHO test:', error);
        alert('Failed to delete: ' + error.message);
      }
    }
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

    function loadCSSData() {
      if (currentAthlete.css_pace) {
        const seconds = currentAthlete.css_pace;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const formatted = `${mins}:${secs.toString().padStart(2, '0')}`;
        
        document.getElementById('cssValue').textContent = formatted;
        document.getElementById('cssInput').value = formatted;
        document.getElementById('cssSource').textContent = `per 100m • ${currentAthlete.css_source || 'Manual Entry'}`;
      }
      
      // Load swim pace zones and intervals
      renderSwimZones();
      renderSwimIntervals();
    }
    
    function renderSwimZones() {
      const zonesBody = document.getElementById('swimZonesBody');
      if (!zonesBody) return;
      
      if (!currentAthlete.swim_pace_zones) {
        zonesBody.innerHTML = `
          <tr>
            <td colspan="5" class="text-center text-muted py-4">
              No zones defined. Use the Toolkit to calculate zones from your CSS.
            </td>
          </tr>
        `;
        return;
      }
      
      try {
        const zones = typeof currentAthlete.swim_pace_zones === 'string' 
          ? JSON.parse(currentAthlete.swim_pace_zones) 
          : currentAthlete.swim_pace_zones;
        
        const formatPace = (seconds) => {
          const mins = Math.floor(seconds / 60);
          const secs = seconds % 60;
          return `${mins}:${secs.toString().padStart(2, '0')}`;
        };
        
        const zoneOrder = [
          { key: 'recovery', number: 'R', name: 'Zone R', percent: '<85%' },
          { key: 'endurance', number: '1', name: 'Zone 1', percent: '85-95%' },
          { key: 'tempo', number: '2', name: 'Zone 2', percent: '95-100%' },
          { key: 'threshold', number: '3', name: 'Zone 3', percent: '100-105%' },
          { key: 'vo2max', number: 'VO2', name: 'VO2max', percent: '>105%' }
        ];
        
        zonesBody.innerHTML = zoneOrder.map(z => {
          const zone = zones[z.key];
          if (!zone) return '';
          
          return `
            <tr>
              <td><span class="badge bg-primary">${z.name}</span></td>
              <td>
                <span class="editable-field" onclick="editSwimZoneInline('${z.key}', 'min', ${zone.min_pace})" style="cursor: pointer; text-decoration: underline dotted;">
                  ${formatPace(zone.min_pace)}
                </span>
                 - 
                <span class="editable-field" onclick="editSwimZoneInline('${z.key}', 'max', ${zone.max_pace})" style="cursor: pointer; text-decoration: underline dotted;">
                  ${formatPace(zone.max_pace)}
                </span> /100m
              </td>
              <td>${z.percent}</td>
              <td>
                <button class="btn btn-sm btn-outline-secondary" onclick="saveSwimZone('${z.key}')">
                  <i class="fas fa-save"></i>
                </button>
              </td>
            </tr>
          `;
        }).join('');
      } catch (error) {
        console.error('Error parsing swim zones:', error);
        zonesBody.innerHTML = `
          <tr>
            <td colspan="5" class="text-center text-danger py-4">
              <i class="fas fa-exclamation-triangle fa-2x mb-2 d-block"></i>
              Error loading zones. Please recalculate in the Toolkit.
            </td>
          </tr>
        `;
      }
    }
    
    let editingSwimZone = {};
    
    function editSwimZoneInline(zoneKey, field, currentValue) {
      const formatPace = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };
      
      const newValue = prompt(`Enter new ${field === 'min' ? 'minimum' : 'maximum'} pace for ${zoneKey} zone (MM:SS):`, formatPace(currentValue));
      if (newValue && newValue.match(/^\d+:\d{2}$/)) {
        const [mins, secs] = newValue.split(':').map(Number);
        const totalSeconds = (mins * 60) + secs;
        
        if (!editingSwimZone[zoneKey]) {
          const zones = typeof currentAthlete.swim_pace_zones === 'string' 
            ? JSON.parse(currentAthlete.swim_pace_zones) 
            : currentAthlete.swim_pace_zones;
          editingSwimZone[zoneKey] = {...zones[zoneKey]};
        }
        editingSwimZone[zoneKey][`${field}_pace`] = totalSeconds;
        renderSwimZones();
      } else if (newValue) {
        alert('Invalid format. Please use MM:SS (e.g., 1:25)');
      }
    }
    
    async function saveSwimZone(zoneKey) {
      if (!editingSwimZone[zoneKey]) {
        alert('No changes to save');
        return;
      }
      
      try {
        const zones = typeof currentAthlete.swim_pace_zones === 'string' 
          ? JSON.parse(currentAthlete.swim_pace_zones) 
          : currentAthlete.swim_pace_zones;
        
        zones[zoneKey] = editingSwimZone[zoneKey];
        
        await axios.put(`/api/athlete-profile/${athleteId}`, {
          swim_pace_zones: JSON.stringify(zones)
        });
        
        alert('✅ Zone updated successfully!');
        editingSwimZone = {};
        await loadAthleteProfile();
      } catch (error) {
        console.error('Error saving zone:', error);
        alert('❌ Failed to save zone: ' + (error.response?.data?.error || error.message));
      }
    }

    function loadFTPData() {
      if (currentAthlete.bike_ftp) {
        document.getElementById('ftpValue').textContent = currentAthlete.bike_ftp;
        document.getElementById('ftpInput').value = currentAthlete.bike_ftp;
        document.getElementById('ftpSource').textContent = `watts • ${currentAthlete.bike_ftp_source || 'Manual Entry'}`;
      }
      
      // Load bike LTHR
      if (currentAthlete.bike_lthr) {
        document.getElementById('bikeLTHRInput').value = currentAthlete.bike_lthr;
        document.getElementById('bikeLTHRSource').textContent = `${currentAthlete.bike_lthr} bpm • ${currentAthlete.hr_source || 'Manual Entry'}`;
      }
      
      // Load bike power zones and intervals
      renderBikeZones();
      renderBikeHRZones();
      renderPowerIntervals();
      renderVO2Bike();
    }
    
    function renderBikeZones() {
      const zonesBody = document.getElementById('bikeZonesBody');
      if (!zonesBody) return;
      
      if (!currentAthlete.bike_power_zones) {
        zonesBody.innerHTML = `
          <tr>
            <td colspan="5" class="text-center text-muted py-4">
              No zones defined. Use the Toolkit to calculate zones from your CP.
            </td>
          </tr>
        `;
        return;
      }
      
      try {
        const zones = typeof currentAthlete.bike_power_zones === 'string' 
          ? JSON.parse(currentAthlete.bike_power_zones) 
          : currentAthlete.bike_power_zones;
        
        const zoneOrder = [
          { key: 'recovery', number: 'R', name: 'Zone R', percent: '<65%' },
          { key: 'endurance', number: '1', name: 'Zone 1', percent: '65-79%' },
          { key: 'tempo', number: '2', name: 'Zone 2', percent: '79-89%' },
          { key: 'threshold', number: '3', name: 'Zone 3', percent: '89-100%' }
        ];
        
        zonesBody.innerHTML = zoneOrder.map(z => {
          const zone = zones[z.key];
          if (!zone) return '';
          
          return `
            <tr>
              <td class="zone-number">${z.number}</td>
              <td><strong>${z.name}</strong></td>
              <td class="editable" onclick="editBikeZoneInline('${z.key}', 'min', ${zone.min_watts})">
                ${zone.min_watts} W
              </td>
              <td class="editable" onclick="editBikeZoneInline('${z.key}', 'max', ${zone.max_watts})">
                ${zone.max_watts} W
              </td>
              <td style="color: var(--gray-600);">${z.percent}</td>
            </tr>
          `;
        }).join('');
      } catch (error) {
        console.error('Error parsing bike zones:', error);
        zonesBody.innerHTML = `
          <tr>
            <td colspan="5" class="text-center text-danger py-4">
              Error loading zones. Please recalculate in the Toolkit.
            </td>
          </tr>
        `;
      }
    }

    let editingBikeZone = {};
    
    function editBikeZoneInline(zoneKey, field, currentValue) {
      const newValue = prompt(`Enter new ${field === 'min' ? 'minimum' : 'maximum'} watts for ${zoneKey} zone:`, currentValue);
      if (newValue && !isNaN(newValue)) {
        if (!editingBikeZone[zoneKey]) {
          const zones = typeof currentAthlete.bike_power_zones === 'string' 
            ? JSON.parse(currentAthlete.bike_power_zones) 
            : currentAthlete.bike_power_zones;
          editingBikeZone[zoneKey] = {...zones[zoneKey]};
        }
        editingBikeZone[zoneKey][`${field}_watts`] = parseInt(newValue);
        renderBikeZones();
      }
    }
    
    async function saveBikeZone(zoneKey) {
      if (!editingBikeZone[zoneKey]) {
        alert('No changes to save');
        return;
      }
      
      try {
        const zones = typeof currentAthlete.bike_power_zones === 'string' 
          ? JSON.parse(currentAthlete.bike_power_zones) 
          : currentAthlete.bike_power_zones;
        
        zones[zoneKey] = editingBikeZone[zoneKey];
        
        await axios.put(`/api/athlete-profile/${athleteId}`, {
          bike_power_zones: JSON.stringify(zones)
        });
        
        alert('✅ Zone updated successfully!');
        editingBikeZone = {};
        await loadAthleteProfile();
      } catch (error) {
        console.error('Error saving zone:', error);
        alert('❌ Failed to save zone: ' + (error.response?.data?.error || error.message));
      }
    }

    // Render Bike HR Zones
    function renderBikeHRZones() {
      const zonesBody = document.getElementById('bikeHRZonesBody');
      if (!zonesBody) return;
      
      if (!currentAthlete.bike_lthr) {
        zonesBody.innerHTML = `
          <tr>
            <td colspan="5" class="text-center text-muted py-4">
              No HR zones defined. Set your LTHR above to generate zones.
            </td>
          </tr>
        `;
        return;
      }
      
      const lthr = currentAthlete.bike_lthr;
      
      // HR Zone definitions based on LTHR
      const hrZones = [
        { number: 'R', name: 'Zone R (Recovery)', min: Math.round(lthr * 0.50), max: Math.round(lthr * 0.60), percent: '50-60%' },
        { number: '1', name: 'Zone 1 (Endurance)', min: Math.round(lthr * 0.60), max: Math.round(lthr * 0.75), percent: '60-75%' },
        { number: '2', name: 'Zone 2 (Tempo)', min: Math.round(lthr * 0.75), max: Math.round(lthr * 0.90), percent: '75-90%' },
        { number: '3', name: 'Zone 3 (Threshold)', min: Math.round(lthr * 0.90), max: Math.round(lthr * 1.00), percent: '90-100%' },
        { number: 'VO2', name: 'VO2 Max', min: Math.round(lthr * 1.00), max: Math.round(lthr * 1.10), percent: '100-110%' }
      ];
      
      zonesBody.innerHTML = hrZones.map(z => `
        <tr>
          <td class="zone-number">${z.number}</td>
          <td><strong>${z.name}</strong></td>
          <td>${z.min} bpm</td>
          <td>${z.max} bpm</td>
          <td style="color: var(--gray-600);">${z.percent}</td>
        </tr>
      `).join('');
    }

    // Render Run HR Zones
    function renderRunHRZones() {
      const zonesBody = document.getElementById('runHRZonesBody');
      if (!zonesBody) return;
      
      if (!currentAthlete.run_lthr) {
        zonesBody.innerHTML = `
          <tr>
            <td colspan="5" class="text-center text-muted py-4">
              No HR zones defined. Set your LTHR above to generate zones.
            </td>
          </tr>
        `;
        return;
      }
      
      const lthr = currentAthlete.run_lthr;
      
      // HR Zone definitions based on LTHR
      const hrZones = [
        { number: 'R', name: 'Zone R (Recovery)', min: Math.round(lthr * 0.50), max: Math.round(lthr * 0.60), percent: '50-60%' },
        { number: '1', name: 'Zone 1 (Endurance)', min: Math.round(lthr * 0.60), max: Math.round(lthr * 0.75), percent: '60-75%' },
        { number: '2', name: 'Zone 2 (Tempo)', min: Math.round(lthr * 0.75), max: Math.round(lthr * 0.90), percent: '75-90%' },
        { number: '3', name: 'Zone 3 (Threshold)', min: Math.round(lthr * 0.90), max: Math.round(lthr * 1.00), percent: '90-100%' },
        { number: 'VO2', name: 'VO2 Max', min: Math.round(lthr * 1.00), max: Math.round(lthr * 1.10), percent: '100-110%' }
      ];
      
      zonesBody.innerHTML = hrZones.map(z => `
        <tr>
          <td class="zone-number">${z.number}</td>
          <td><strong>${z.name}</strong></td>
          <td>${z.min} bpm</td>
          <td>${z.max} bpm</td>
          <td style="color: var(--gray-600);">${z.percent}</td>
        </tr>
      `).join('');
    }

    function loadRunFTPData() {
      if (currentAthlete.run_ftp) {
        const seconds = currentAthlete.run_ftp;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const formatted = `${mins}:${secs.toString().padStart(2, '0')}`;
        
        document.getElementById('runFtpValue').textContent = formatted;
        document.getElementById('runFtpInput').value = formatted;
        document.getElementById('runFtpSource').textContent = `per km • ${currentAthlete.run_ftp_source || 'Manual Entry'}`;
      }
      
      // Load run critical power
      if (currentAthlete.run_cp) {
        document.getElementById('runCPInput').value = currentAthlete.run_cp;
        document.getElementById('runCPSource').textContent = `${currentAthlete.run_cp} watts • ${currentAthlete.run_power_source || 'Manual Entry'}`;
      }
      
      // Load run LTHR
      if (currentAthlete.run_lthr) {
        document.getElementById('runLTHRInput').value = currentAthlete.run_lthr;
        document.getElementById('runLTHRSource').textContent = `${currentAthlete.run_lthr} bpm • ${currentAthlete.hr_source || 'Manual Entry'}`;
      }
      
      // Load run pace zones and intervals
      renderRunZones();
      renderRunHRZones();
      renderPaceIntervals();
      renderVO2Run();
    }
    
    function renderRunZones() {
      const zonesBody = document.getElementById('runZonesBody');
      if (!zonesBody) return;
      
      if (!currentAthlete.run_pace_zones) {
        zonesBody.innerHTML = `
          <tr>
            <td colspan="5" class="text-center text-muted py-4">
              <i class="fas fa-calculator fa-2x mb-2 d-block"></i>
              No zones defined. Use the Toolkit to calculate zones from your Run FTP.
            </td>
          </tr>
        `;
        return;
      }
      
      try {
        const zones = typeof currentAthlete.run_pace_zones === 'string' 
          ? JSON.parse(currentAthlete.run_pace_zones) 
          : currentAthlete.run_pace_zones;
        
        const formatPace = (seconds) => {
          if (seconds > 9000) return '∞'; // Recovery has no upper limit
          const mins = Math.floor(seconds / 60);
          const secs = seconds % 60;
          return `${mins}:${secs.toString().padStart(2, '0')}`;
        };
        
        const zoneOrder = [
          { key: 'recovery', number: 'R', name: 'Zone R', percent: '<75%' },
          { key: 'endurance', number: '1', name: 'Zone 1', percent: '75-85%' },
          { key: 'tempo', number: '2', name: 'Zone 2', percent: '85-92%' },
          { key: 'threshold', number: '3', name: 'Zone 3', percent: '92-100%' },
          { key: 'vo2max', number: 'VO2', name: 'VO2max', percent: '>100%' }
        ];
        
        zonesBody.innerHTML = zoneOrder.map(z => {
          const zone = zones[z.key];
          if (!zone) return '';
          
          return `
            <tr>
              <td><span class="badge bg-danger">${z.name}</span></td>
              <td>
                <span class="editable-field" onclick="editRunZoneInline('${z.key}', 'min', ${zone.min_pace_km})" style="cursor: pointer; text-decoration: underline dotted;">
                  ${formatPace(zone.min_pace_km)}
                </span>
                 - 
                <span class="editable-field" onclick="editRunZoneInline('${z.key}', 'max', ${zone.max_pace_km})" style="cursor: pointer; text-decoration: underline dotted;">
                  ${formatPace(zone.max_pace_km)}
                </span> /km
              </td>
              <td>${z.percent}</td>
              <td>
                <button class="btn btn-sm btn-outline-secondary" onclick="saveRunZone('${z.key}')">
                  <i class="fas fa-save"></i>
                </button>
              </td>
            </tr>
          `;
        }).join('');
      } catch (error) {
        console.error('Error parsing run zones:', error);
        zonesBody.innerHTML = `
          <tr>
            <td colspan="5" class="text-center text-danger py-4">
              <i class="fas fa-exclamation-triangle fa-2x mb-2 d-block"></i>
              Error loading zones. Please recalculate in the Toolkit.
            </td>
          </tr>
        `;
      }
    }
    
    let editingRunZone = {};
    
    function editRunZoneInline(zoneKey, field, currentValue) {
      const formatPace = (seconds) => {
        if (seconds > 9000) return '∞';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };
      
      const newValue = prompt(`Enter new ${field === 'min' ? 'minimum' : 'maximum'} pace for ${zoneKey} zone (MM:SS per km):`, formatPace(currentValue));
      if (newValue && newValue.match(/^\d+:\d{2}$/)) {
        const [mins, secs] = newValue.split(':').map(Number);
        const totalSeconds = (mins * 60) + secs;
        
        if (!editingRunZone[zoneKey]) {
          const zones = typeof currentAthlete.run_pace_zones === 'string' 
            ? JSON.parse(currentAthlete.run_pace_zones) 
            : currentAthlete.run_pace_zones;
          editingRunZone[zoneKey] = {...zones[zoneKey]};
        }
        editingRunZone[zoneKey][`${field}_pace_km`] = totalSeconds;
        renderRunZones();
      } else if (newValue) {
        alert('Invalid format. Please use MM:SS (e.g., 5:30)');
      }
    }
    
    async function saveRunZone(zoneKey) {
      if (!editingRunZone[zoneKey]) {
        alert('No changes to save');
        return;
      }
      
      try {
        const zones = typeof currentAthlete.run_pace_zones === 'string' 
          ? JSON.parse(currentAthlete.run_pace_zones) 
          : currentAthlete.run_pace_zones;
        
        zones[zoneKey] = editingRunZone[zoneKey];
        
        await axios.put(`/api/athlete-profile/${athleteId}`, {
          run_pace_zones: JSON.stringify(zones)
        });
        
        alert('✅ Zone updated successfully!');
        editingRunZone = {};
        await loadAthleteProfile();
      } catch (error) {
        console.error('Error saving zone:', error);
        alert('❌ Failed to save zone: ' + (error.response?.data?.error || error.message));
      }
    }

    // Render Swim Intervals
    function renderSwimIntervals() {
      const body = document.getElementById('swimIntervalsBody');
      
      if (!currentAthlete.swim_intervals) {
        body.innerHTML = `
          <tr>
            <td colspan="6" class="text-center text-muted py-4">
              <i class="fas fa-calculator fa-2x mb-2 d-block"></i>
              No intervals defined. Use the Toolkit to calculate swim interval pacing.
            </td>
          </tr>
        `;
        return;
      }
      
      try {
        const intervals = typeof currentAthlete.swim_intervals === 'string'
          ? JSON.parse(currentAthlete.swim_intervals)
          : currentAthlete.swim_intervals;
        
        const formatTime = (seconds) => {
          const mins = Math.floor(seconds / 60);
          const secs = seconds % 60;
          return `${mins}:${secs.toString().padStart(2, '0')}`;
        };
        
        body.innerHTML = Object.entries(intervals).map(([dist, zones]) => `
          <tr>
            <td><strong>${dist}</strong></td>
            <td>${formatTime(zones.recovery || zones.zr)}</td>
            <td>${formatTime(zones.zone1 || zones.z1)}</td>
            <td>${formatTime(zones.zone2 || zones.z2)}</td>
            <td>${formatTime(zones.css)}</td>
            <td>
              <button class="btn btn-sm btn-outline-secondary" onclick="editSwimInterval('${dist}')">
                <i class="fas fa-edit"></i>
              </button>
            </td>
          </tr>
        `).join('');
      } catch (error) {
        console.error('Error rendering swim intervals:', error);
        body.innerHTML = `
          <tr>
            <td colspan="6" class="text-center text-danger py-4">
              <i class="fas fa-exclamation-triangle fa-2x mb-2 d-block"></i>
              Error loading intervals. Please recalculate in the Toolkit.
            </td>
          </tr>
        `;
      }
    }

    function editSwimInterval(distance) {
      alert('Interval editing coming soon! Use the Toolkit to recalculate intervals.');
    }

    // Render Power Intervals
    function renderPowerIntervals() {
      const body = document.getElementById('powerIntervalsBody');
      
      if (!currentAthlete.power_intervals) {
        body.innerHTML = `
          <tr>
            <td colspan="3" class="text-center text-muted py-4">
              <i class="fas fa-calculator fa-2x mb-2 d-block"></i>
              No intervals defined. Use the Toolkit Power Intervals calculator.
            </td>
          </tr>
        `;
        return;
      }
      
      try {
        const intervals = typeof currentAthlete.power_intervals === 'string'
          ? JSON.parse(currentAthlete.power_intervals)
          : currentAthlete.power_intervals;
        
        body.innerHTML = Object.entries(intervals).map(([duration, data]) => `
          <tr>
            <td><strong>${duration}</strong></td>
            <td class="text-number">${data.target_watts} W</td>
            <td style="color: var(--gray-600);">${data.range_min} - ${data.range_max} W</td>
          </tr>
        `).join('');
      } catch (error) {
        console.error('Error rendering power intervals:', error);
        body.innerHTML = `
          <tr>
            <td colspan="3" class="text-center text-danger py-4">
              <i class="fas fa-exclamation-triangle fa-2x mb-2 d-block"></i>
              Error loading intervals. Please recalculate in the Toolkit.
            </td>
          </tr>
        `;
      }
    }

    function editPowerInterval(duration) {
      alert('Interval editing coming soon! Use the Toolkit to recalculate intervals.');
    }

    // Render Pace Intervals
    function renderPaceIntervals() {
      const body = document.getElementById('paceIntervalsBody');
      
      if (!currentAthlete.pace_intervals) {
        body.innerHTML = `
          <tr>
            <td colspan="4" class="text-center text-muted py-4">
              <i class="fas fa-calculator fa-2x mb-2 d-block"></i>
              No intervals defined. Use the Toolkit Pace Intervals calculator.
            </td>
          </tr>
        `;
        return;
      }
      
      try {
        const intervals = typeof currentAthlete.pace_intervals === 'string'
          ? JSON.parse(currentAthlete.pace_intervals)
          : currentAthlete.pace_intervals;
        
        const formatTime = (seconds) => {
          const mins = Math.floor(seconds / 60);
          const secs = seconds % 60;
          return `${mins}:${secs.toString().padStart(2, '0')}`;
        };
        
        const formatPace = (seconds) => {
          const mins = Math.floor(seconds / 60);
          const secs = seconds % 60;
          return `${mins}:${secs.toString().padStart(2, '0')}/mi`;
        };
        
        body.innerHTML = Object.entries(intervals).map(([dist, data]) => `
          <tr>
            <td><strong>${dist}</strong></td>
            <td>${formatTime(data.target_time_seconds)}</td>
            <td>${formatPace(data.target_pace_per_mile_seconds)}</td>
            <td>
              <button class="btn btn-sm btn-outline-secondary" onclick="editPaceInterval('${dist}')">
                <i class="fas fa-edit"></i>
              </button>
            </td>
          </tr>
        `).join('');
      } catch (error) {
        console.error('Error rendering pace intervals:', error);
        body.innerHTML = `
          <tr>
            <td colspan="4" class="text-center text-danger py-4">
              <i class="fas fa-exclamation-triangle fa-2x mb-2 d-block"></i>
              Error loading intervals. Please recalculate in the Toolkit.
            </td>
          </tr>
        `;
      }
    }

    function editPaceInterval(distance) {
      alert('Interval editing coming soon! Use the Toolkit to recalculate intervals.');
    }

    // Render VO2 Bike Prescription
    function renderVO2Bike() {
      const container = document.getElementById('vo2BikeDisplay');
      if (!currentAthlete.vo2_bike_prescription) {
        container.innerHTML = `
          <div class="text-center text-muted py-4">
            <i class="fas fa-heartbeat fa-2x mb-2 d-block"></i>
            No VO2 prescription defined. Use the Toolkit VO2 Bike Calculator.
          </div>
        `;
        return;
      }

      try {
        const data = typeof currentAthlete.vo2_bike_prescription === 'string' 
          ? JSON.parse(currentAthlete.vo2_bike_prescription) 
          : currentAthlete.vo2_bike_prescription;

        container.innerHTML = `
          <div class="card bg-light mb-4">
            <div class="card-body">
              <h4 class="mb-4"><i class="fas fa-chart-line me-2"></i>Power Profile Analysis</h4>
              <div class="row g-3 mb-4">
                <div class="col-md-3">
                  <div class="text-center p-4 bg-white rounded shadow-sm">
                    <div class="text-muted fw-semibold fs-6">Critical Power</div>
                    <div class="h2 mb-0 text-primary fw-bold">${data.cp} W</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center p-4 bg-white rounded shadow-sm">
                    <div class="text-muted fw-semibold fs-6">W' (Anaerobic Capacity)</div>
                    <div class="h2 mb-0 text-primary fw-bold">${data.w_prime} J</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center p-4 bg-white rounded shadow-sm">
                    <div class="text-muted fw-semibold fs-6">pVO2max</div>
                    <div class="h2 mb-0 text-danger fw-bold">${data.pvo2max} W</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center p-4 bg-white rounded shadow-sm">
                    <div class="text-muted fw-semibold fs-6">Power Gap</div>
                    <div class="h2 mb-0 text-warning fw-bold">${data.gap} W</div>
                  </div>
                </div>
              </div>
              
              <div class="row g-3 mb-4">
                <div class="col-md-4">
                  <div class="text-center p-4 bg-white rounded shadow-sm">
                    <div class="text-muted fw-semibold fs-6">Burn Rate</div>
                    <div class="h3 mb-0 fw-bold">${data.burn_rate.toFixed(1)} W/s</div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="text-center p-4 bg-white rounded shadow-sm">
                    <div class="text-muted fw-semibold fs-6">Time to Exhaustion @ pVO2max</div>
                    <div class="h3 mb-0 fw-bold">${Math.floor(data.time_to_exhaustion / 60)}:${(data.time_to_exhaustion % 60).toString().padStart(2, '0')}</div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="text-center p-4 bg-white rounded shadow-sm">
                    <div class="text-muted fw-semibold fs-6">Max Rep Duration</div>
                    <div class="h3 mb-0 fw-bold">${Math.floor(data.max_rep_duration / 60)}:${(data.max_rep_duration % 60).toString().padStart(2, '0')}</div>
                  </div>
                </div>
              </div>
              
              <div class="alert alert-info mb-0">
                <h5 class="mb-3"><i class="fas fa-user-chart me-2"></i>Profile Classification</h5>
                <p class="mb-2 fs-4 fw-bold"><strong>${data.profile_label}</strong></p>
                <p class="mb-0 fs-5"><strong>W' Tank Size:</strong> ${data.w_prime_label}</p>
              </div>
            </div>
          </div>
          
          <h4 class="mb-4 mt-4"><i class="fas fa-dumbbell me-2"></i>Prescribed Workouts</h4>
          <div class="row g-4">
            <div class="col-md-6">
              <div class="card border-primary h-100 shadow">
                <div class="card-header bg-primary text-white">
                  <h4 class="mb-1">${data.workout_1.name}</h4>
                  <div class="mt-1 fs-6">${data.workout_1.subtitle}</div>
                </div>
                <div class="card-body">
                  <p class="fs-5 text-muted fw-semibold">${data.workout_1.goal}</p>
                  <p class="fs-5"><strong>Structure:</strong> ${data.workout_1.structure}</p>
                  <p class="fs-5"><strong>TSS:</strong> <span class="badge bg-primary fs-5">~${data.workout_1.tss}</span></p>
                  
                  <div class="mt-4">
                    <h5 class="mb-3"><i class="fas fa-clipboard-list me-2"></i>Key Details:</h5>
                    <ul class="fs-5 mb-3">
                      ${data.workout_1.details.map(d => `<li><strong>${d[0]}:</strong> ${d[1]}</li>`).join('')}
                    </ul>
                  </div>
                  
                  <div class="mt-4">
                    <h5 class="mb-3"><i class="fas fa-arrow-trend-up me-2"></i>Progression:</h5>
                    <ul class="fs-6 mb-0">
                      ${data.workout_1.progression.map(p => `<li>${p}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-6">
              <div class="card border-warning h-100 shadow">
                <div class="card-header bg-warning text-white">
                  <h4 class="mb-1">${data.workout_2.name}</h4>
                  <div class="mt-1 fs-6">${data.workout_2.subtitle}</div>
                </div>
                <div class="card-body">
                  <p class="fs-5 text-muted fw-semibold">${data.workout_2.goal}</p>
                  <p class="fs-5"><strong>Structure:</strong> ${data.workout_2.structure}</p>
                  <p class="fs-5"><strong>TSS:</strong> <span class="badge bg-warning fs-5">~${data.workout_2.tss}</span></p>
                  
                  <div class="mt-4">
                    <h5 class="mb-3"><i class="fas fa-clipboard-list me-2"></i>Key Details:</h5>
                    <ul class="fs-5 mb-3">
                      ${data.workout_2.details.map(d => `<li><strong>${d[0]}:</strong> ${d[1]}</li>`).join('')}
                    </ul>
                  </div>
                  
                  <div class="mt-4">
                    <h5 class="mb-3"><i class="fas fa-arrow-trend-up me-2"></i>Progression:</h5>
                    <ul class="fs-6 mb-0">
                      ${data.workout_2.progression.map(p => `<li>${p}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      } catch (error) {
        console.error('Error rendering VO2 Bike prescription:', error);
        container.innerHTML = `
          <div class="text-center text-danger py-4">
            <i class="fas fa-exclamation-triangle fa-2x mb-2 d-block"></i>
            Error loading prescription. Please recalculate in the Toolkit.
          </div>
        `;
      }
    }

    // Render VO2 Run Prescription
    function renderVO2Run() {
      const container = document.getElementById('vo2RunDisplay');
      if (!currentAthlete.vo2_run_prescription) {
        container.innerHTML = `
          <div class="text-center text-muted py-4">
            <i class="fas fa-heartbeat fa-2x mb-2 d-block"></i>
            No VO2 prescription defined. Use the Toolkit VO2 Run Calculator.
          </div>
        `;
        return;
      }

      try {
        const data = typeof currentAthlete.vo2_run_prescription === 'string' 
          ? JSON.parse(currentAthlete.vo2_run_prescription) 
          : currentAthlete.vo2_run_prescription;

        container.innerHTML = `
          <div class="card bg-light mb-4">
            <div class="card-body">
              <h4 class="mb-4"><i class="fas fa-chart-line me-2"></i>Pace Profile Analysis</h4>
              <div class="row g-3 mb-4">
                <div class="col-md-3">
                  <div class="text-center p-4 bg-white rounded shadow-sm">
                    <div class="text-muted fw-semibold fs-6">Critical Speed (CS)</div>
                    <div class="h2 mb-0 text-primary fw-bold">${Math.floor(data.cs_pace_per_mile)}:${((data.cs_pace_per_mile % 1) * 60).toFixed(0).padStart(2, '0')}</div>
                    <div class="fs-6 text-muted">per mile</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center p-4 bg-white rounded shadow-sm">
                    <div class="text-muted fw-semibold fs-6">vVO2max</div>
                    <div class="h2 mb-0 text-danger fw-bold">${Math.floor(data.vvo2_pace_per_mile)}:${((data.vvo2_pace_per_mile % 1) * 60).toFixed(0).padStart(2, '0')}</div>
                    <div class="fs-6 text-muted">per mile</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center p-4 bg-white rounded shadow-sm">
                    <div class="text-muted fw-semibold fs-6">D' (Anaerobic Reserve)</div>
                    <div class="h2 mb-0 text-warning fw-bold">${data.d_prime}</div>
                    <div class="fs-6 text-muted">yards</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center p-4 bg-white rounded shadow-sm">
                    <div class="text-muted fw-semibold fs-6">Speed Gap</div>
                    <div class="h2 mb-0 text-success fw-bold">${(data.gap_ms || 0).toFixed(0)} sec/mi</div>
                  </div>
                </div>
              </div>
              
              <div class="row g-3 mb-4">
                <div class="col-md-4">
                  <div class="text-center p-4 bg-white rounded shadow-sm">
                    <div class="text-muted fw-semibold fs-6">Burn Rate</div>
                    <div class="h3 mb-0 fw-bold">${(data.burn_rate || 0).toFixed(1)} m/s</div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="text-center p-4 bg-white rounded shadow-sm">
                    <div class="text-muted fw-semibold fs-6">Time to Exhaustion @ vVO2max</div>
                    <div class="h3 mb-0 fw-bold">${Math.floor(data.time_to_exhaustion / 60)}:${(data.time_to_exhaustion % 60).toString().padStart(2, '0')}</div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="text-center p-4 bg-white rounded shadow-sm">
                    <div class="text-muted fw-semibold fs-6">Max Rep Duration</div>
                    <div class="h3 mb-0 fw-bold">${Math.floor(data.max_rep_duration / 60)}:${(data.max_rep_duration % 60).toString().padStart(2, '0')}</div>
                  </div>
                </div>
              </div>
              
              <div class="alert alert-info mb-0">
                <h5 class="mb-3"><i class="fas fa-user-chart me-2"></i>Profile Classification</h5>
                <p class="mb-2 fs-4 fw-bold"><strong>${data.profile_label}</strong></p>
                <p class="mb-2 fs-5"><strong>D' Reserve:</strong> ${data.d_prime_label}</p>
                <p class="mb-0 fs-5"><strong>Durability Mode:</strong> ${data.durability || 'Standard'}</p>
              </div>
            </div>
          </div>
          
          ${data.workout_1 && data.workout_2 ? `
          <h4 class="mb-4 mt-4"><i class="fas fa-dumbbell me-2"></i>Prescribed Workouts</h4>
          <div class="row g-4">
            <div class="col-md-6">
              <div class="card border-primary h-100 shadow">
                <div class="card-header bg-primary text-white">
                  <h4 class="mb-1">${data.workout_1.name}</h4>
                  <div class="mt-1 fs-6">${data.workout_1.subtitle}</div>
                </div>
                <div class="card-body">
                  <p class="fs-5 text-muted fw-semibold">${data.workout_1.goal}</p>
                  <p class="fs-5"><strong>Structure:</strong> ${data.workout_1.structure}</p>
                  <p class="fs-5"><strong>rTSS:</strong> <span class="badge bg-primary fs-5">~${data.workout_1.rtss}</span></p>
                  
                  <div class="mt-4">
                    <h5 class="mb-3"><i class="fas fa-clipboard-list me-2"></i>Key Details:</h5>
                    <ul class="fs-5 mb-3">
                      ${data.workout_1.details.map(d => `<li><strong>${d[0]}:</strong> ${d[1]}</li>`).join('')}
                    </ul>
                  </div>
                  
                  <div class="mt-4">
                    <h5 class="mb-3"><i class="fas fa-arrow-trend-up me-2"></i>Progression:</h5>
                    <ul class="fs-6 mb-0">
                      ${data.workout_1.progression.map(p => `<li>${p}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-6">
              <div class="card border-warning h-100 shadow">
                <div class="card-header bg-warning text-white">
                  <h4 class="mb-1">${data.workout_2.name}</h4>
                  <div class="mt-1 fs-6">${data.workout_2.subtitle}</div>
                </div>
                <div class="card-body">
                  <p class="fs-5 text-muted fw-semibold">${data.workout_2.goal}</p>
                  <p class="fs-5"><strong>Structure:</strong> ${data.workout_2.structure}</p>
                  <p class="fs-5"><strong>rTSS:</strong> <span class="badge bg-warning fs-5">~${data.workout_2.rtss}</span></p>
                  
                  <div class="mt-4">
                    <h5 class="mb-3"><i class="fas fa-clipboard-list me-2"></i>Key Details:</h5>
                    <ul class="fs-5 mb-3">
                      ${data.workout_2.details.map(d => `<li><strong>${d[0]}:</strong> ${d[1]}</li>`).join('')}
                    </ul>
                  </div>
                  
                  <div class="mt-4">
                    <h5 class="mb-3"><i class="fas fa-arrow-trend-up me-2"></i>Progression:</h5>
                    <ul class="fs-6 mb-0">
                      ${data.workout_2.progression.map(p => `<li>${p}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          ` : '<div class="alert alert-info mt-4"><i class="fas fa-info-circle me-2"></i>Workout prescriptions available after using the VO2 Run Calculator in the Toolkit.</div>'}
        `;
      } catch (error) {
        console.error('Error rendering VO2 Run prescription:', error);
        container.innerHTML = `
          <div class="text-center text-danger py-4">
            <i class="fas fa-exclamation-triangle fa-2x mb-2 d-block"></i>
            Error loading prescription. Please recalculate in the Toolkit.
          </div>
        `;
      }
    }

    // Save CSS
    async function saveCSS() {
      const cssInput = document.getElementById('cssInput').value.trim();
      
      if (!cssInput || !cssInput.match(/^\d+:\d{2}$/)) {
        alert('❌ Please enter CSS in MM:SS format (e.g., 1:30)');
        return;
      }
      
      const [mins, secs] = cssInput.split(':').map(Number);
      const totalSeconds = (mins * 60) + secs;
      
      try {
        const saveData = {
          css_pace: totalSeconds,
          css_source: 'manual',
          css_updated_at: new Date().toISOString()
        };
        
        console.log('💾 Saving CSS to API:', saveData);
        const response = await axios.put(`/api/athlete-profile/${athleteId}`, saveData);
        console.log('✅ API Response:', response.data);
        
        alert(`✅ CSS saved successfully!\n\nSaved: ${cssInput} (${totalSeconds} seconds)\nYou can now use this in the Swim Planner.`);
        await loadAthleteProfile();
      } catch (error) {
        console.error('❌ Error saving CSS:', error);
        console.error('❌ Error details:', error.response?.data);
        alert('❌ Failed to save CSS: ' + (error.response?.data?.error || error.message));
      }
    }

    // Save Bike FTP
    async function saveFTP() {
      const ftpInput = document.getElementById('ftpInput').value.trim();
      
      if (!ftpInput || isNaN(ftpInput)) {
        alert('❌ Please enter a valid FTP in watts (e.g., 250)');
        return;
      }
      
      try {
        await axios.put(`/api/athlete-profile/${athleteId}`, {
          bike_ftp: parseInt(ftpInput),
          bike_ftp_source: 'manual',
          bike_ftp_updated_at: new Date().toISOString()
        });
        
        alert('✅ FTP saved successfully!');
        await loadAthleteProfile();
      } catch (error) {
        console.error('Error saving FTP:', error);
        alert('❌ Failed to save FTP');
      }
    }

    // Save Run FTP
    async function saveRunFTP() {
      const runFtpInput = document.getElementById('runFtpInput').value.trim();
      
      if (!runFtpInput || !runFtpInput.match(/^\d+:\d{2}$/)) {
        alert('❌ Please enter Run FTP in MM:SS format (e.g., 4:00)');
        return;
      }
      
      const [mins, secs] = runFtpInput.split(':').map(Number);
      const totalSeconds = (mins * 60) + secs;
      
      try {
        await axios.put(`/api/athlete-profile/${athleteId}`, {
          run_ftp: totalSeconds,
          run_ftp_source: 'manual',
          run_ftp_updated_at: new Date().toISOString()
        });
        
        alert('✅ Run FTP saved successfully!');
        await loadAthleteProfile();
      } catch (error) {
        console.error('Error saving Run FTP:', error);
        alert('❌ Failed to save Run FTP');
      }
    }

    // Save Bike LTHR
    async function saveBikeLTHR() {
      const lthrInput = document.getElementById('bikeLTHRInput').value.trim();
      
      if (!lthrInput || isNaN(lthrInput)) {
        alert('❌ Please enter a valid LTHR in bpm (e.g., 165)');
        return;
      }
      
      try {
        await axios.put(`/api/athlete-profile/${athleteId}`, {
          bike_lthr: parseInt(lthrInput),
          hr_source: 'manual',
          hr_updated_at: new Date().toISOString()
        });
        
        alert('✅ Bike LTHR saved successfully!');
        await loadAthleteProfile();
      } catch (error) {
        console.error('Error saving Bike LTHR:', error);
        alert('❌ Failed to save Bike LTHR');
      }
    }

    // Save Run LTHR
    async function saveRunLTHR() {
      const lthrInput = document.getElementById('runLTHRInput').value.trim();
      
      if (!lthrInput || isNaN(lthrInput)) {
        alert('❌ Please enter a valid LTHR in bpm (e.g., 165)');
        return;
      }
      
      try {
        await axios.put(`/api/athlete-profile/${athleteId}`, {
          run_lthr: parseInt(lthrInput),
          hr_source: 'manual',
          hr_updated_at: new Date().toISOString()
        });
        
        alert('✅ Run LTHR saved successfully!');
        await loadAthleteProfile();
      } catch (error) {
        console.error('Error saving Run LTHR:', error);
        alert('❌ Failed to save Run LTHR');
      }
    }

    // Save Run Critical Power
    async function saveRunCP() {
      const cpInput = document.getElementById('runCPInput').value.trim();
      
      if (!cpInput || isNaN(cpInput)) {
        alert('❌ Please enter a valid Run CP in watts (e.g., 280)');
        return;
      }
      
      try {
        await axios.put(`/api/athlete-profile/${athleteId}`, {
          run_cp: parseInt(cpInput),
          run_power_source: 'manual',
          run_power_updated_at: new Date().toISOString()
        });
        
        alert('✅ Run CP saved successfully!');
        await loadAthleteProfile();
      } catch (error) {
        console.error('Error saving Run CP:', error);
        alert('❌ Failed to save Run CP');
      }
    }

    function openToolkit(sport) {
      window.location.href = `/static/athlete-calculators.html?athlete=${athleteId}&sport=${sport}`;
    }

    function openSwimPlanner() {
      window.location.href = `/static/swim-planner.html?athlete=${athleteId}`;
    }

    function addSwimTest() {
      alert('Swim test tracking coming soon!');
    }

    function addBikeTest() {
      alert('Bike test tracking coming soon!');
    }

    function addRunTest() {
      alert('Run test tracking coming soon!');
    }

    // ========= ZONES SYNC TO TRAININGPEAKS =========
    async function syncZonesToTrainingPeaks() {
      if (!athleteId) {
        alert('No athlete ID found');
        return;
      }

      const btn = document.getElementById('syncZonesBtn');
      const statusDiv = document.getElementById('zones-sync-status');
      const messageSpan = document.getElementById('zones-sync-message');

      try {
        // Disable button and show loading
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Syncing...';
        
        statusDiv.className = 'alert alert-info';
        statusDiv.style.display = 'block';
        messageSpan.textContent = 'Syncing zones to TrainingPeaks...';

        // Call API
        const response = await axios.post(`/api/athlete-zones/sync/${athleteId}`);

        // Success
        statusDiv.className = 'alert alert-success';
        messageSpan.innerHTML = `
          <i class="fas fa-check-circle me-1"></i>
          Zones synced successfully! 
          ${response.data.zones.heartRateZones ? ' • Heart Rate Zones' : ''}
          ${response.data.zones.powerZones ? ' • Power Zones' : ''}
          ${response.data.zones.paceZones ? ' • Pace Zones' : ''}
        `;

        // Hide after 5 seconds
        setTimeout(() => {
          statusDiv.style.display = 'none';
        }, 5000);

      } catch (error) {
        console.error('Error syncing zones:', error);
        statusDiv.className = 'alert alert-danger';
        messageSpan.innerHTML = `
          <i class="fas fa-exclamation-triangle me-1"></i>
          Failed to sync zones: ${error.response?.data?.error || error.message}
        `;
      } finally {
        // Re-enable button
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-sync me-1"></i>Sync to TrainingPeaks';
      }
    }

    // ========= RACES FUNCTIONALITY =========
    let currentRaces = [];
    let editingRaceId = null;

    async function loadRaces() {
      const container = document.getElementById('racesContainer');
      
      try {
        console.log('🏁 Fetching races for athlete:', athleteId);
        const response = await axios.get(`/api/athlete-races/${athleteId}`);
        console.log('✅ Race API Response:', response.data);
        
        // Log debug info if present
        if (response.data.debug) {
          console.log('🔍 Race API Debug Info:', response.data.debug);
        }
        
        currentRaces = response.data.races || [];
        
        if (currentRaces.length === 0) {
          console.log('📭 No races found');
          container.innerHTML = `
            <div class="text-center text-muted py-4">
              No races scheduled. Add races in TrainingPeaks and they will appear here.
            </div>
          `;
          return;
        }
        
        console.log('🏆 Found races:', currentRaces.length);
        // Render races
        container.innerHTML = currentRaces.map(race => renderRaceCard(race)).join('');
        
      } catch (error) {
        // Log the full error details
        console.error('❌ Race loading error:', error);
        console.error('📋 Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
        
        container.innerHTML = `
          <div class="text-center text-muted py-4">
            No races scheduled. Add races in TrainingPeaks and they will appear here.
          </div>
        `;
      }
    }

    function renderRaceCard(race) {
      const raceDate = new Date(race.eventDate);
      const today = new Date();
      const daysUntil = Math.ceil((raceDate - today) / (1000 * 60 * 60 * 24));
      
      const isPast = daysUntil < 0;
      const priorityColors = {
        'A': 'danger',
        'B': 'warning',
        'C': 'info'
      };
      const priorityColor = priorityColors[race.priority] || 'secondary';
      
      const dateStr = raceDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      
      return `
        <div class="card mb-3 ${isPast ? 'opacity-50' : ''}">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div class="flex-grow-1">
                <h5 class="card-title mb-1">
                  <i class="fas fa-trophy me-2 text-${priorityColor}"></i>
                  ${race.name}
                  ${race.priority ? `<span class="badge bg-${priorityColor} ms-2">${race.priority}-Race</span>` : ''}
                </h5>
                <p class="text-muted mb-2">
                  <i class="fas fa-calendar me-2"></i>${dateStr}
                  ${!isPast ? `<span class="ms-3 fw-bold text-${priorityColor}">${daysUntil} days away</span>` : '<span class="ms-3 text-muted">(Past)</span>'}
                </p>
                ${race.distance ? `
                  <p class="text-muted mb-2">
                    <i class="fas fa-route me-2"></i>${race.distance} ${race.distanceUnits || 'miles'}
                  </p>
                ` : ''}
                ${race.description ? `
                  <p class="text-muted small mb-0">${race.description}</p>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    function showAddRaceModal() {
      editingRaceId = null;
      document.getElementById('raceModalTitle').textContent = 'Add New Race';
      document.getElementById('raceName').value = '';
      document.getElementById('raceDate').value = '';
      document.getElementById('racePriority').value = 'B';
      document.getElementById('raceDistance').value = '';
      document.getElementById('raceDistanceUnits').value = 'Miles';
      document.getElementById('raceDescription').value = '';
      
      const modal = new bootstrap.Modal(document.getElementById('raceModal'));
      modal.show();
    }

    function editRace(raceId) {
      const race = currentRaces.find(r => r.eventId === raceId);
      if (!race) return;
      
      editingRaceId = raceId;
      document.getElementById('raceModalTitle').textContent = 'Edit Race';
      document.getElementById('raceName').value = race.name;
      document.getElementById('raceDate').value = race.eventDate;
      document.getElementById('racePriority').value = race.priority || 'B';
      document.getElementById('raceDistance').value = race.distance || '';
      document.getElementById('raceDistanceUnits').value = race.distanceUnits || 'Miles';
      document.getElementById('raceDescription').value = race.description || '';
      
      const modal = new bootstrap.Modal(document.getElementById('raceModal'));
      modal.show();
    }

    async function saveRace() {
      const name = document.getElementById('raceName').value.trim();
      const eventDate = document.getElementById('raceDate').value;
      const priority = document.getElementById('racePriority').value;
      const distance = document.getElementById('raceDistance').value;
      const distanceUnits = document.getElementById('raceDistanceUnits').value;
      const description = document.getElementById('raceDescription').value.trim();
      
      if (!name || !eventDate) {
        alert('❌ Please enter race name and date');
        return;
      }
      
      const raceData = {
        name,
        eventDate,
        eventType: 'Race',
        priority,
        distance: distance ? parseFloat(distance) : null,
        distanceUnits,
        description
      };
      
      try {
        if (editingRaceId) {
          // Update existing race
          await axios.put(`/api/athlete-races/${athleteId}/${editingRaceId}`, raceData);
        } else {
          // Create new race
          await axios.post(`/api/athlete-races/${athleteId}`, raceData);
        }
        
        // Close modal and reload races
        bootstrap.Modal.getInstance(document.getElementById('raceModal')).hide();
        await loadRaces();
        
      } catch (error) {
        console.error('Error saving race:', error);
        alert('❌ Failed to save race: ' + (error.response?.data?.error || error.message));
      }
    }

    async function deleteRace(raceId, raceName) {
      if (!confirm(`Are you sure you want to delete "${raceName}"?`)) {
        return;
      }
      
      try {
        await axios.delete(`/api/athlete-races/${athleteId}/${raceId}`);
        await loadRaces();
      } catch (error) {
        console.error('Error deleting race:', error);
        alert('❌ Failed to delete race: ' + (error.response?.data?.error || error.message));
      }
    }
    // Athlete Info Modal Functions
    function openAthleteInfoModal() {
      if (!currentAthlete) {
        console.error('❌ Cannot open modal: currentAthlete not loaded');
        alert('Please wait for athlete profile to load...');
        return;
      }
      
      console.log('📝 Opening athlete info modal for:', currentAthlete.name);
      
      const modal = document.getElementById('athleteInfoModal');
      
      document.getElementById('modalName').value = currentAthlete.name || '';
      document.getElementById('modalEmail').value = currentAthlete.email || '';
      document.getElementById('modalWeight').value = currentAthlete.weight_kg || '';
      document.getElementById('modalHeight').value = currentAthlete.height_cm || '';
      document.getElementById('modalAge').value = currentAthlete.age || '';
      document.getElementById('modalSport').value = currentAthlete.sport || 'Triathlon';
      document.getElementById('modalStatus').value = currentAthlete.status || 'Active';
      document.getElementById('modalWeeklyHours').value = currentAthlete.weekly_hours_available || '';
      
      modal.classList.add('show');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      
      console.log('✅ Modal display:', window.getComputedStyle(modal).display);
      console.log('✅ Modal z-index:', window.getComputedStyle(modal).zIndex);
      console.log('✅ Modal classList:', modal.classList.toString());
    }
    
    function closeAthleteInfoModal() {
      document.getElementById('athleteInfoModal').classList.remove('show');
      document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Close modal when clicking outside
    document.addEventListener('DOMContentLoaded', function() {
      const modal = document.getElementById('athleteInfoModal');
      
      // Close only if clicking the modal backdrop (not any child)
      modal.addEventListener('click', function(e) {
        // Only close if the click target is exactly the modal element (backdrop)
        if (e.target.id === 'athleteInfoModal') {
          console.log('✅ Closing modal (clicked backdrop)');
          closeAthleteInfoModal();
        }
      });
    });
    
    // Tab switching function
    function switchTab(tabName) {
      // Remove active class from all tabs
      document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('show', 'active');
      });
      
      // Add active class to clicked tab
      document.getElementById(tabName + '-tab').classList.add('active');
      document.getElementById(tabName).classList.add('show', 'active');
    }
    
    async function saveAthleteInfo() {
      console.log('💾 Saving athlete info...');
      try {
        const updateData = {
          name: document.getElementById('modalName').value,
          email: document.getElementById('modalEmail').value,
          weight_kg: parseFloat(document.getElementById('modalWeight').value) || null,
          height_cm: parseFloat(document.getElementById('modalHeight').value) || null,
          age: parseInt(document.getElementById('modalAge').value) || null,
          sport: document.getElementById('modalSport').value,
          status: document.getElementById('modalStatus').value,
          weekly_hours_available: parseFloat(document.getElementById('modalWeeklyHours').value) || null
        };
        
        console.log('📤 Sending update:', updateData);
        const response = await axios.put(`/api/athlete-profile/${athleteId}`, updateData);
        console.log('✅ Response:', response.data);
        
        if (response.data.success) {
          alert('✓ Athlete information updated successfully');
          closeAthleteInfoModal();
          // Reload athlete data
          await loadAthleteProfile();
        } else {
          alert('Failed to update athlete information');
        }
      } catch (error) {
        console.error('❌ Error saving athlete info:', error);
        console.error('📋 Full error object:', JSON.stringify({
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          stack: error.stack
        }, null, 2));
        alert('Error: ' + (error.response?.data?.error || error.message || 'Unknown error'));
      }
    }
    
    // Race Schedule Toggle
    function toggleRaces() {
      const content = document.getElementById('racesContent');
      const toggle = document.getElementById('racesToggle');
      content.classList.toggle('collapsed');
      toggle.classList.toggle('open');
    }
    
    // Update athlete info display
    function updateAthleteInfoDisplay() {
      if (!currentAthlete) {
        console.log('⚠️ updateAthleteInfoDisplay called but currentAthlete is null');
        return;
      }
      
      console.log('📊 Updating athlete info display with:', {
        email: currentAthlete.email,
        weight: currentAthlete.weight_kg,
        height: currentAthlete.height_cm,
        sport: currentAthlete.sport
      });
      
      document.getElementById('athleteEmail').textContent = currentAthlete.email || '--';
      document.getElementById('athleteWeight').textContent = currentAthlete.weight_kg || '--';
      document.getElementById('athleteHeight').textContent = currentAthlete.height_cm || '--';
      document.getElementById('athleteSport').textContent = currentAthlete.sport || '--';
      
      // Update mailto link
      if (currentAthlete.email) {
        const emailLink = document.getElementById('emailLink');
        emailLink.href = `mailto:${currentAthlete.email}`;
        emailLink.style.display = 'inline';
      }
    }
