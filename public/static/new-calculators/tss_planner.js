const openTSSPlannerBtn = document.getElementById('open-tss-planner-btn');
const trainingStressModalEl = document.getElementById('trainingStressModal');
const trainingStressForm = document.getElementById('trainingStressForm');

if(openTSSPlannerBtn) {
    openTSSPlannerBtn.addEventListener('click', function() {
        const hiddenField = document.getElementById('selected-athlete-id');
        const selectedAthleteId = hiddenField ? hiddenField.value : null;

        if (!selectedAthleteId) {
            showToast('Please select an athlete before opening the planner.', 'Warning');
            return;
        }

        const modal = new bootstrap.Modal(trainingStressModalEl);
        modal.show();
    });
}

if (trainingStressModalEl) {
    trainingStressModalEl.addEventListener('hide.bs.modal', function() {
        if (document.activeElement && trainingStressModalEl.contains(document.activeElement)) {
            document.activeElement.blur();
        }
    });

    trainingStressModalEl.addEventListener('hidden.bs.modal', function() {
        trainingStressForm.reset();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    const resultSection = document.getElementById('resultsSection');
    const ctlInput = document.getElementById('ctl_value');
    const atlInput = document.getElementById('atl_value');
    const wtsbInput = document.getElementById('wtsb_value');
    const recommendationText = document.getElementById('recommendation_text');
    const percentageElem = document.getElementById('percentage_change');
    const analysisDates = document.getElementById('analysis_dates');
    const overallScore = document.getElementById('overall_score');
    const echoEstimate = document.getElementById('echo_estimate');

    // Step 2 elements
    const customEchoInput = document.getElementById('custom_echo_estimate');
    const originalEchoValue = document.getElementById('original_echo_value');
    const calculateTssRangeBtn = document.getElementById('calculateTssRangeBtn');
    const tssRangeSection = document.getElementById('tssRangeSection');
    const tssRangeDisplay = document.getElementById('tss_range_display');
    const usedEchoValue = document.getElementById('used_echo_value');

    const orthopedicContainer = document.getElementById('orthopedic_flags_container');
    const orthopedicSelect = document.getElementById('orthopedic_flags');

    const PERSIST_FIELDS = [
        'block_type', 'key_workouts', 'soreness', 'mood_irritability',
        'sleep', 'hrv_rhr', 'motivation', 'life_stress', 'orthopedic_flags'
    ];

    const trainingStressCache = {
        bike: { formState: null, apiData: null },
        run: { formState: null, apiData: null }
    };

    let initialFormDefaults = null;
    let currentApiResponse = null; // Store full API response for Step 2

    function getSelectedSport() {
        const radio = document.querySelector('input[name="sport_type"]:checked');
        return radio ? radio.value : 'bike';
    }

    function readCurrentFormState() {
        const state = {};
        PERSIST_FIELDS.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            state[id] = el.value;
        });
        return state;
    }

    function applyFormState(state) {
        if (!state) return;
        PERSIST_FIELDS.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            if (Object.prototype.hasOwnProperty.call(state, id)) {
                el.value = state[id];
            }
        });
    }

    function clearAllFormFields() {
        PERSIST_FIELDS.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.value = '';
        });
    }

    function saveFormStateForSport(sport) {
        trainingStressCache[sport].formState = readCurrentFormState();
    }

    function populateResultsFromApiData(apiData) {
        if (!apiData) return;
        
        currentApiResponse = apiData; // Store for Step 2
        
        ctlInput.value = apiData.ctl ?? '';
        atlInput.value = apiData.atl ?? '';
        wtsbInput.value = apiData.wtsb ?? '';
        recommendationText.textContent = formatRecommendation(apiData.recommendation);

        const percentageValue = apiData.percentage_change ?? 0;
        percentageElem.textContent = (percentageValue >= 0 ? '+' : '') + percentageValue + '%';
        percentageElem.className = 'fs-4 ' + (
            percentageValue > 5 ? 'text-success fw-bold' :
            percentageValue < -5 ? 'text-danger fw-bold' :
            'text-warning fw-bold'
        );

        analysisDates.textContent = `Wednesday ${apiData.mid_week_wednesday} to Sunday ${apiData.coming_sunday}`;
        overallScore.textContent = apiData.overall_score ?? '';
        echoEstimate.textContent = apiData.echo_estimate ?? '';
        
        // Set Step 2 original echo value
        originalEchoValue.textContent = apiData.echo_estimate ?? '';
        customEchoInput.value = ''; // Clear custom input
        customEchoInput.placeholder = `Default: ${apiData.echo_estimate}`;
        
        // Hide TSS range until button is clicked
        tssRangeSection.style.display = 'none';
        
        resultSection.style.display = 'block';
    }

    function clearResultsUI() {
        ctlInput.value = '';
        atlInput.value = '';
        wtsbInput.value = '';
        recommendationText.textContent = '';
        percentageElem.textContent = '';
        percentageElem.className = 'fs-4';
        analysisDates.textContent = '';
        overallScore.textContent = '';
        echoEstimate.textContent = '';
        originalEchoValue.textContent = '';
        customEchoInput.value = '';
        tssRangeSection.style.display = 'none';
        resultSection.style.display = 'none';
        currentApiResponse = null;
    }

    function formatRecommendation(rec) {
        const recommendations = {
            'increase_a_lot': 'Increase Training Load Significantly.',
            'increase_a_little': 'Increase Training Load Moderately.',
            'hold_steady': 'Maintain Current Training Load.',
            'decrease_a_little': 'Decrease Training Load Moderately.',
            'decrease_a_lot': 'Decrease Training Load Significantly.',
            'slight_increase': 'Increase Training Load Slightly.',
            'hold_to_slight_increase': 'Maintain Current Training Load.',
            'decrease_moderately': 'Decrease Training Load Moderately.'
        };
        return recommendations[rec] || rec || '';
    }

    function toggleOrthopedicVisibility() {
        const selectedSport = getSelectedSport();
        if (selectedSport === 'run') {
            orthopedicContainer.style.display = 'block';
            orthopedicSelect.setAttribute('required', 'required');
        } else {
            orthopedicContainer.style.display = 'none';
            orthopedicSelect.removeAttribute('required');
            orthopedicSelect.value = '';
        }
    }

    // Step 2: Calculate TSS Range
    calculateTssRangeBtn.addEventListener('click', function() {
        if (!currentApiResponse) {
            alert('Please calculate recommendation first (Step 1)');
            return;
        }

        // Get echo estimate value (custom or original)
        let echoValue = parseFloat(customEchoInput.value);
        if (isNaN(echoValue) || echoValue <= 0) {
            echoValue = currentApiResponse.echo_estimate;
        }

        const lowChange = currentApiResponse.low_change;
        const highChange = currentApiResponse.high_change;

        if (!lowChange || !highChange) {
            alert('Missing low/high change values from API response');
            return;
        }

        // Calculate range
        const lowTss = Math.round(echoValue * lowChange);
        const highTss = Math.round(echoValue * highChange);

        // Display results
        tssRangeDisplay.textContent = `${lowTss} - ${highTss}`;
        usedEchoValue.textContent = Math.round(echoValue);
        tssRangeSection.style.display = 'block';

        console.log(`📊 TSS Range calculated: ${lowTss} - ${highTss} (Echo: ${echoValue}, Low: ${lowChange}, High: ${highChange})`);
    });

    toggleOrthopedicVisibility();

    trainingStressModalEl.addEventListener('shown.bs.modal', function() {
        const defaultSport = 'bike';
        document.getElementById('sport_' + defaultSport).checked = true;
        toggleOrthopedicVisibility();
        
        if (!initialFormDefaults) {
            initialFormDefaults = readCurrentFormState();
        }
    });

    const sportRadios = document.querySelectorAll('input[name="sport_type"]');
    sportRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const allRadios = document.querySelectorAll('input[name="sport_type"]');
            let prevSport = null;
            allRadios.forEach(r => {
                if (r !== this && r.dataset.wasChecked === 'true') {
                    prevSport = r.value;
                }
            });
            
            if (!prevSport) {
                const currentSport = this.value;
                prevSport = currentSport === 'bike' ? 'run' : 'bike';
            }

            if (prevSport) {
                saveFormStateForSport(prevSport);
                console.log(`💾 Saved state for ${prevSport}:`, trainingStressCache[prevSport].formState);
            }

            const newSport = this.value;
            console.log(`🔄 Switching from ${prevSport} to ${newSport}`);

            allRadios.forEach(r => {
                r.dataset.wasChecked = r.checked ? 'true' : 'false';
            });

            toggleOrthopedicVisibility();
            clearAllFormFields();
            clearResultsUI();

            if (trainingStressCache[newSport].formState) {
                console.log(`✅ Restoring cached state for ${newSport}:`, trainingStressCache[newSport].formState);
                applyFormState(trainingStressCache[newSport].formState);
            } else {
                console.log(`📝 No cached state for ${newSport}, showing empty form`);
            }

            if (trainingStressCache[newSport].apiData) {
                console.log(`📊 Restoring API data for ${newSport}`);
                populateResultsFromApiData(trainingStressCache[newSport].apiData);
            }
        });
    });

    sportRadios.forEach(radio => {
        radio.dataset.wasChecked = radio.checked ? 'true' : 'false';
    });

    PERSIST_FIELDS.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('change', function() {
            const sport = getSelectedSport();
            if (!trainingStressCache[sport].formState) {
                trainingStressCache[sport].formState = {};
            }
            trainingStressCache[sport].formState[id] = this.value;
            console.log(`📝 Updated ${id} for ${sport}:`, this.value);
        });
    });

    if (calculateBtn) {
        calculateBtn.addEventListener('click', async function() {
            if (!trainingStressForm.checkValidity()) {
                trainingStressForm.reportValidity();
                return;
            }

            resultSection.style.display = 'none';
            calculateBtn.disabled = true;

            const selectedSport = getSelectedSport();
            saveFormStateForSport(selectedSport);

            const hiddenField = document.getElementById('selected-athlete-id');
            const payload = {
                selected_athlete: hiddenField ? hiddenField.value : null,
                sport_type: selectedSport,
                block_type: document.getElementById('block_type').value,
                key_workouts: document.getElementById('key_workouts').value,
                soreness: document.getElementById('soreness').value,
                mood_irritability: document.getElementById('mood_irritability').value,
                sleep: document.getElementById('sleep').value,
                hrv_rhr: document.getElementById('hrv_rhr').value,
                motivation: document.getElementById('motivation').value,
                life_stress: document.getElementById('life_stress').value
            };

            if (selectedSport === 'run') {
                payload.orthopedic_flags = orthopedicSelect.value;
            }
            
            console.log("🚀 PAYLOAD ====>", payload);
            
            try {
                if (typeof showLoader === 'function') showLoader();
                
                const response = await fetch('/dashboard/api/training-stress-recommendation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                console.log("🚀 ~ data:", data)
                
                if (!response.ok) throw new Error(data.error || 'Failed to calculate recommendation');

                trainingStressCache[selectedSport].apiData = data;
                trainingStressCache[selectedSport].formState = readCurrentFormState();

                console.log(`✅ Cached apiData and formState for ${selectedSport}`, trainingStressCache[selectedSport]);

                populateResultsFromApiData(data);
            } catch (error) {
                console.error("❌ API Error:", error);
                alert('Error: ' + (error.message || error));
            } finally {
                if (typeof hideLoader === 'function') hideLoader();
                calculateBtn.disabled = false;
            }
        });
    }

    trainingStressModalEl.addEventListener('hidden.bs.modal', function() {
        console.log('🧹 Clearing all caches');
        trainingStressCache.bike.formState = null;
        trainingStressCache.bike.apiData = null;
        trainingStressCache.run.formState = null;
        trainingStressCache.run.apiData = null;
        initialFormDefaults = null;
        currentApiResponse = null;
        clearResultsUI();
        clearAllFormFields();
        
        document.getElementById('sport_bike').checked = true;
        sportRadios.forEach(radio => {
            radio.dataset.wasChecked = radio.checked ? 'true' : 'false';
        });
    });
});
