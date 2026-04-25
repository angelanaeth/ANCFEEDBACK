// Comprehensive TrainingPeaks Dashboard Rendering Function
// This file contains the complete renderFullAthleteDashboard function
// To be integrated into coach.html

function renderFullAthleteDashboard(athlete, data) {
  const metrics = data.metrics || {};
  const weeklyMetrics = data.weekly_metrics || {};
  const workouts = data.workouts || [];
  const athleteProfile = data.athlete || {};
  
  // Helper to format metric value
  const fmt = (val) => (val || 0).toFixed(1);
  const fmtInt = (val) => Math.round(val || 0);

  const html = `
    <!-- Athlete Header -->
    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h2 class="mb-1">
              <i class="fas fa-user-circle me-2"></i>${athlete.name}
            </h2>
            <p class="text-muted mb-2">
              <i class="fas fa-envelope me-2"></i>${athlete.email || 'No email'}
              <span class="ms-3"><i class="fas fa-id-badge me-2"></i>ID: ${athlete.id}</span>
              <span class="ms-3"><i class="fas fa-dumbbell me-2"></i>${athlete.sport || 'Triathlon'}</span>
            </p>
            <span class="badge bg-${getStressBadgeColor(athlete.stress_state)} fs-6">
              ${athlete.stress_state || 'Unknown Status'}
            </span>
          </div>
          <div class="col-md-4 text-end">
            <div class="d-flex gap-2 justify-content-end">
              <a href="https://chatgpt.com/g/g-69620c7454588191a659a39ce4b9a7d1-echodevo-trainingpeaks-coach-v5" target="_blank" class="btn btn-outline-primary">
                <i class="fas fa-robot me-1"></i>Analyze with GPT
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Comprehensive TrainingPeaks Dashboard -->
    <div class="accordion mb-4" id="trainingPeaksAccordion">
      
      <!-- Section 1: TrainingPeaks Overview (Current) -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#tpOverview">
            <i class="fas fa-chart-line me-2"></i><strong>TrainingPeaks Overview (Current)</strong>
          </button>
        </h2>
        <div id="tpOverview" class="accordion-collapse collapse show" data-bs-parent="#trainingPeaksAccordion">
          <div class="accordion-body">
            <div class="row">
              <div class="col-md-4">
                <div class="card text-center">
                  <div class="card-body">
                    <h6 class="text-muted">CTL (Fitness)</h6>
                    <h2 class="text-primary">${fmt(metrics.total?.ctl)}</h2>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card text-center">
                  <div class="card-body">
                    <h6 class="text-muted">ATL (Fatigue)</h6>
                    <h2 class="text-warning">${fmt(metrics.total?.atl)}</h2>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card text-center">
                  <div class="card-body">
                    <h6 class="text-muted">TSB (Form)</h6>
                    <h2 class="text-${getTSBColor(metrics.total?.tsb)}">${fmt(metrics.total?.tsb)}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Timeline Projections -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#timeline">
            <i class="fas fa-calendar-alt me-2"></i><strong>Timeline Overview</strong>
          </button>
        </h2>
        <div id="timeline" class="accordion-collapse collapse" data-bs-parent="#trainingPeaksAccordion">
          <div class="accordion-body">
            <table class="table table-bordered">
              <thead class="table-light">
                <tr>
                  <th>Period</th>
                  <th>CTL</th>
                  <th>ATL</th>
                  <th>TSB</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>📅 Today</strong></td>
                  <td>${fmt(weeklyMetrics.combined?.today?.metrics?.ctl)}</td>
                  <td>${fmt(weeklyMetrics.combined?.today?.metrics?.atl)}</td>
                  <td class="text-${getTSBColor(weeklyMetrics.combined?.today?.metrics?.tsb)}">${fmt(weeklyMetrics.combined?.today?.metrics?.tsb)}</td>
                </tr>
                <tr>
                  <td><strong>📈 This Week (Sun Projection)</strong></td>
                  <td>${fmt(weeklyMetrics.combined?.thisWeek?.metrics?.ctl)}</td>
                  <td>${fmt(weeklyMetrics.combined?.thisWeek?.metrics?.atl)}</td>
                  <td class="text-${getTSBColor(weeklyMetrics.combined?.thisWeek?.metrics?.tsb)}">${fmt(weeklyMetrics.combined?.thisWeek?.metrics?.tsb)}</td>
                </tr>
                <tr>
                  <td><strong>📊 Next Week (Sun Projection)</strong></td>
                  <td>${fmt(weeklyMetrics.combined?.nextWeek?.metrics?.ctl)}</td>
                  <td>${fmt(weeklyMetrics.combined?.nextWeek?.metrics?.atl)}</td>
                  <td class="text-${getTSBColor(weeklyMetrics.combined?.nextWeek?.metrics?.tsb)}">${fmt(weeklyMetrics.combined?.nextWeek?.metrics?.tsb)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Section 3: Combined Metrics (All Sports) -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#combined">
            <i class="fas fa-layer-group me-2"></i><strong>Combined Metrics (All Sports)</strong>
          </button>
        </h2>
        <div id="combined" class="accordion-collapse collapse" data-bs-parent="#trainingPeaksAccordion">
          <div class="accordion-body">
            <table class="table table-bordered">
              <thead class="table-light">
                <tr>
                  <th rowspan="2">Metric</th>
                  <th colspan="3">Last Week</th>
                  <th colspan="3">Today</th>
                  <th colspan="5">This Week (Sun Proj)</th>
                </tr>
                <tr>
                  <th>CTL</th>
                  <th>ATL</th>
                  <th>TSB</th>
                  <th>CTL</th>
                  <th>ATL</th>
                  <th>TSB</th>
                  <th>CTL</th>
                  <th>ATL</th>
                  <th>TSB</th>
                  <th>Comp TSS</th>
                  <th>Rem TSS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Values</strong></td>
                  <td>${fmt(weeklyMetrics.combined?.lastWeek?.metrics?.ctl)}</td>
                  <td>${fmt(weeklyMetrics.combined?.lastWeek?.metrics?.atl)}</td>
                  <td class="text-${getTSBColor(weeklyMetrics.combined?.lastWeek?.metrics?.tsb)}">${fmt(weeklyMetrics.combined?.lastWeek?.metrics?.tsb)}</td>
                  <td>${fmt(weeklyMetrics.combined?.today?.metrics?.ctl)}</td>
                  <td>${fmt(weeklyMetrics.combined?.today?.metrics?.atl)}</td>
                  <td class="text-${getTSBColor(weeklyMetrics.combined?.today?.metrics?.tsb)}">${fmt(weeklyMetrics.combined?.today?.metrics?.tsb)}</td>
                  <td>${fmt(weeklyMetrics.combined?.thisWeek?.metrics?.ctl)}</td>
                  <td>${fmt(weeklyMetrics.combined?.thisWeek?.metrics?.atl)}</td>
                  <td class="text-${getTSBColor(weeklyMetrics.combined?.thisWeek?.metrics?.tsb)}">${fmt(weeklyMetrics.combined?.thisWeek?.metrics?.tsb)}</td>
                  <td>${fmtInt(weeklyMetrics.combined?.thisWeek?.completedTSS)}</td>
                  <td>${fmtInt(weeklyMetrics.combined?.thisWeek?.remainingTSS)}</td>
                </tr>
                <tr class="table-secondary">
                  <td><strong>TSS Summary</strong></td>
                  <td colspan="3">
                    Last Week TSS: <strong>${fmtInt(weeklyMetrics.combined?.lastWeek?.tss)}</strong><br>
                    Week-to-Today TSS: <strong>${fmtInt(weeklyMetrics.combined?.lastWeek?.weekToTodayTSS)}</strong>
                  </td>
                  <td colspan="3">-</td>
                  <td colspan="5">Total TSS: <strong>${fmtInt(weeklyMetrics.combined?.thisWeek?.totalTSS)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Section 4: Run Metrics -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#run">
            <i class="fas fa-running me-2"></i><strong>🏃 Run Metrics</strong>
          </button>
        </h2>
        <div id="run" class="accordion-collapse collapse" data-bs-parent="#trainingPeaksAccordion">
          <div class="accordion-body">
            <table class="table table-bordered">
              <thead class="table-light">
                <tr>
                  <th rowspan="2">Metric</th>
                  <th colspan="3">Last Week</th>
                  <th colspan="3">Today</th>
                  <th colspan="5">This Week (Sun Proj)</th>
                </tr>
                <tr>
                  <th>CTL</th>
                  <th>ATL</th>
                  <th>TSB</th>
                  <th>CTL</th>
                  <th>ATL</th>
                  <th>TSB</th>
                  <th>CTL</th>
                  <th>ATL</th>
                  <th>TSB</th>
                  <th>Comp TSS</th>
                  <th>Rem TSS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Values</strong></td>
                  <td>${fmt(weeklyMetrics.run?.lastWeek?.metrics?.ctl)}</td>
                  <td>${fmt(weeklyMetrics.run?.lastWeek?.metrics?.atl)}</td>
                  <td class="text-${getTSBColor(weeklyMetrics.run?.lastWeek?.metrics?.tsb)}">${fmt(weeklyMetrics.run?.lastWeek?.metrics?.tsb)}</td>
                  <td>${fmt(weeklyMetrics.run?.today?.metrics?.ctl)}</td>
                  <td>${fmt(weeklyMetrics.run?.today?.metrics?.atl)}</td>
                  <td class="text-${getTSBColor(weeklyMetrics.run?.today?.metrics?.tsb)}">${fmt(weeklyMetrics.run?.today?.metrics?.tsb)}</td>
                  <td>${fmt(weeklyMetrics.run?.thisWeek?.metrics?.ctl)}</td>
                  <td>${fmt(weeklyMetrics.run?.thisWeek?.metrics?.atl)}</td>
                  <td class="text-${getTSBColor(weeklyMetrics.run?.thisWeek?.metrics?.tsb)}">${fmt(weeklyMetrics.run?.thisWeek?.metrics?.tsb)}</td>
                  <td>${fmtInt(weeklyMetrics.run?.thisWeek?.completedTSS)}</td>
                  <td>${fmtInt(weeklyMetrics.run?.thisWeek?.remainingTSS)}</td>
                </tr>
                <tr class="table-secondary">
                  <td><strong>TSS Summary</strong></td>
                  <td colspan="3">
                    Last Week TSS: <strong>${fmtInt(weeklyMetrics.run?.lastWeek?.tss)}</strong><br>
                    Week-to-Today TSS: <strong>${fmtInt(weeklyMetrics.run?.lastWeek?.weekToTodayTSS)}</strong>
                  </td>
                  <td colspan="3">-</td>
                  <td colspan="5">Total TSS: <strong>${fmtInt(weeklyMetrics.run?.thisWeek?.totalTSS)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Section 5: Bike Metrics -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#bike">
            <i class="fas fa-biking me-2"></i><strong>🚴 Bike Metrics</strong>
          </button>
        </h2>
        <div id="bike" class="accordion-collapse collapse" data-bs-parent="#trainingPeaksAccordion">
          <div class="accordion-body">
            <table class="table table-bordered">
              <thead class="table-light">
                <tr>
                  <th rowspan="2">Metric</th>
                  <th colspan="3">Last Week</th>
                  <th colspan="3">Today</th>
                  <th colspan="5">This Week (Sun Proj)</th>
                </tr>
                <tr>
                  <th>CTL</th>
                  <th>ATL</th>
                  <th>TSB</th>
                  <th>CTL</th>
                  <th>ATL</th>
                  <th>TSB</th>
                  <th>CTL</th>
                  <th>ATL</th>
                  <th>TSB</th>
                  <th>Comp TSS</th>
                  <th>Rem TSS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Values</strong></td>
                  <td>${fmt(weeklyMetrics.bike?.lastWeek?.metrics?.ctl)}</td>
                  <td>${fmt(weeklyMetrics.bike?.lastWeek?.metrics?.atl)}</td>
                  <td class="text-${getTSBColor(weeklyMetrics.bike?.lastWeek?.metrics?.tsb)}">${fmt(weeklyMetrics.bike?.lastWeek?.metrics?.tsb)}</td>
                  <td>${fmt(weeklyMetrics.bike?.today?.metrics?.ctl)}</td>
                  <td>${fmt(weeklyMetrics.bike?.today?.metrics?.atl)}</td>
                  <td class="text-${getTSBColor(weeklyMetrics.bike?.today?.metrics?.tsb)}">${fmt(weeklyMetrics.bike?.today?.metrics?.tsb)}</td>
                  <td>${fmt(weeklyMetrics.bike?.thisWeek?.metrics?.ctl)}</td>
                  <td>${fmt(weeklyMetrics.bike?.thisWeek?.metrics?.atl)}</td>
                  <td class="text-${getTSBColor(weeklyMetrics.bike?.thisWeek?.metrics?.tsb)}">${fmt(weeklyMetrics.bike?.thisWeek?.metrics?.tsb)}</td>
                  <td>${fmtInt(weeklyMetrics.bike?.thisWeek?.completedTSS)}</td>
                  <td>${fmtInt(weeklyMetrics.bike?.thisWeek?.remainingTSS)}</td>
                </tr>
                <tr class="table-secondary">
                  <td><strong>TSS Summary</strong></td>
                  <td colspan="3">
                    Last Week TSS: <strong>${fmtInt(weeklyMetrics.bike?.lastWeek?.tss)}</strong><br>
                    Week-to-Today TSS: <strong>${fmtInt(weeklyMetrics.bike?.lastWeek?.weekToTodayTSS)}</strong>
                  </td>
                  <td colspan="3">-</td>
                  <td colspan="5">Total TSS: <strong>${fmtInt(weeklyMetrics.bike?.thisWeek?.totalTSS)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Section 6: Swim Metrics -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#swim">
            <i class="fas fa-swimmer me-2"></i><strong>🏊 Swim Metrics</strong>
          </button>
        </h2>
        <div id="swim" class="accordion-collapse collapse" data-bs-parent="#trainingPeaksAccordion">
          <div class="accordion-body">
            <table class="table table-bordered">
              <thead class="table-light">
                <tr>
                  <th rowspan="2">Metric</th>
                  <th colspan="3">Last Week</th>
                  <th colspan="3">Today</th>
                  <th colspan="5">This Week (Sun Proj)</th>
                </tr>
                <tr>
                  <th>CTL</th>
                  <th>ATL</th>
                  <th>TSB</th>
                  <th>CTL</th>
                  <th>ATL</th>
                  <th>TSB</th>
                  <th>CTL</th>
                  <th>ATL</th>
                  <th>TSB</th>
                  <th>Comp TSS</th>
                  <th>Rem TSS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Values</strong></td>
                  <td>${fmt(weeklyMetrics.swim?.lastWeek?.metrics?.ctl)}</td>
                  <td>${fmt(weeklyMetrics.swim?.lastWeek?.metrics?.atl)}</td>
                  <td class="text-${getTSBColor(weeklyMetrics.swim?.lastWeek?.metrics?.tsb)}">${fmt(weeklyMetrics.swim?.lastWeek?.metrics?.tsb)}</td>
                  <td>${fmt(weeklyMetrics.swim?.today?.metrics?.ctl)}</td>
                  <td>${fmt(weeklyMetrics.swim?.today?.metrics?.atl)}</td>
                  <td class="text-${getTSBColor(weeklyMetrics.swim?.today?.metrics?.tsb)}">${fmt(weeklyMetrics.swim?.today?.metrics?.tsb)}</td>
                  <td>${fmt(weeklyMetrics.swim?.thisWeek?.metrics?.ctl)}</td>
                  <td>${fmt(weeklyMetrics.swim?.thisWeek?.metrics?.atl)}</td>
                  <td class="text-${getTSBColor(weeklyMetrics.swim?.thisWeek?.metrics?.tsb)}">${fmt(weeklyMetrics.swim?.thisWeek?.metrics?.tsb)}</td>
                  <td>${fmtInt(weeklyMetrics.swim?.thisWeek?.completedTSS)}</td>
                  <td>${fmtInt(weeklyMetrics.swim?.thisWeek?.remainingTSS)}</td>
                </tr>
                <tr class="table-secondary">
                  <td><strong>TSS Summary</strong></td>
                  <td colspan="3">
                    Last Week TSS: <strong>${fmtInt(weeklyMetrics.swim?.lastWeek?.tss)}</strong><br>
                    Week-to-Today TSS: <strong>${fmtInt(weeklyMetrics.swim?.lastWeek?.weekToTodayTSS)}</strong>
                  </td>
                  <td colspan="3">-</td>
                  <td colspan="5">Total TSS: <strong>${fmtInt(weeklyMetrics.swim?.thisWeek?.totalTSS)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Section 7: Recent Workouts -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#workouts">
            <i class="fas fa-list me-2"></i><strong>Recent Workouts (Last 10)</strong>
          </button>
        </h2>
        <div id="workouts" class="accordion-collapse collapse" data-bs-parent="#trainingPeaksAccordion">
          <div class="accordion-body">
            ${workouts.length > 0 ? `
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Sport</th>
                      <th>Title</th>
                      <th>Duration</th>
                      <th>TSS</th>
                      <th>IF</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${workouts.slice(0, 10).map(w => `
                      <tr>
                        <td>${w.date}</td>
                        <td><i class="fas fa-${getSportIcon(w.sport)} me-1"></i>${w.sport}</td>
                        <td>${w.title || 'Untitled'}</td>
                        <td>${formatDuration(w.duration)}</td>
                        <td><strong>${Math.round(w.tss || 0)}</strong></td>
                        <td>${w.if ? w.if.toFixed(2) : '-'}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : '<p class="text-muted text-center py-4">No workout data available</p>'}
          </div>
        </div>
      </div>

    </div>
  `;

  document.getElementById('athlete-dashboard').innerHTML = html;
}
