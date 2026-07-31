// Step 13: QA Re-verification Logic (verify failed checkpoints only)
console.log("ALC Re-Verification script loaded");

const ALC_ReVerification = {
    failedCheckpoints: [],

    // Load and render failed items for re-verification
    loadReverificationItems: async function () {
        if (!ALC_StateMachine.currentTourId) return;

        try {
            ShowLoader();
            const checkpoints = await ALC_DAL.getCheckpoints(ALC_StateMachine.currentTourId);
            
            // Only re-verify the items that were previously marked Not Okay
            this.failedCheckpoints = checkpoints.filter(c => 
                c.cr3ea_status === "Not Okay" || 
                c.cr3ea_defectcategory.includes("00") || 
                c.cr3ea_defectcategory.includes("01") ||
                c.cr3ea_defectcategory.includes("Non-Compliant") ||
                c.cr3ea_defectcategory.includes("Partial")
            );

            this.renderReverifyTable();
            HideLoader();
        } catch (error) {
            HideLoader();
            console.error("Failed to load checkpoints for QA re-verification:", error);
        }
    },

    // Render table
    renderReverifyTable: function () {
        const tbody = document.getElementById("reverify-checkpoints-body");
        if (!tbody) return;

        if (this.failedCheckpoints.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-success">All checkpoints have been cleared!</td></tr>`;
            return;
        }

        tbody.innerHTML = "";
        this.failedCheckpoints.forEach((cp, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td style="text-align: left;">
                    <strong>${cp.cr3ea_area}</strong><br>
                    <span class="text-secondary">${cp.cr3ea_criteria}</span><br>
                    <small class="text-info">${cp.cr3ea_defectremarks || ""}</small>
                </td>
                <td>
                    <select class="form-select reverify-score-select" data-index="${index}">
                        <option value="Compliant (2)" selected>Compliant (2)</option>
                        <option value="Partial (1)">Partial (1)</option>
                        <option value="Non-Compliant (0)">Non-Compliant (0)</option>
                    </select>
                </td>
                <td>
                    <input type="text" class="form-control reverify-remarks-input" data-index="${index}" placeholder="Enter Remarks">
                </td>
            `;
            tbody.appendChild(row);
        });

        // Initialize Select2 on dropdowns
        const selectElements = tbody.querySelectorAll("select");
        selectElements.forEach(select => {
            if (window.jQuery && $.fn.select2) {
                $(select).select2({ minimumResultsForSearch: -1, width: "100%" });
            }
        });
    },

    // QA Submits Re-Verification
    submitReverification: async function () {
        if (!ALC_StateMachine.currentTourId || this.failedCheckpoints.length === 0) return;

        let anyFailedAgain = false;
        
        try {
            ShowLoader();

            // 1. Update the re-verified checkpoints
            for (let i = 0; i < this.failedCheckpoints.length; i++) {
                const cp = this.failedCheckpoints[i];
                const selectEl = document.querySelector(`.reverify-score-select[data-index='${i}']`);
                const remarksEl = document.querySelector(`.reverify-remarks-input[data-index='${i}']`);
                
                const scoreText = selectEl ? selectEl.value : "Compliant (2)";
                const remarks = remarksEl ? remarksEl.value.trim() : "";

                let status = "OK";
                if (scoreText.includes("(0)") || scoreText === "00" || scoreText.includes("Non-Compliant") ||
                    scoreText.includes("(1)") || scoreText === "01" || scoreText.includes("Partial")) {
                    status = "Not Okay";
                    anyFailedAgain = true;
                }

                // Update checkpoint record in Dataverse
                const updatedRecord = {
                    cr3ea_rajpura_alcsid: cp.cr3ea_rajpura_alcsid,
                    cr3ea_status: status,
                    // Increment cycle to show re-verification cycle
                    cr3ea_cycle: `Cycle-2`,
                    cr3ea_defectcategory: scoreText,
                    cr3ea_defectremarks: remarks || cp.cr3ea_defectremarks
                };
                await ALC_DAL.saveChecklistRow(updatedRecord);
            }

            // 2. Evaluate overall result
            let statusText = !anyFailedAgain ? "Completed" : "Failed - Pending Production";
            let isPass = !anyFailedAgain;
            let stateNext = isPass ? ALC_STATES.COMPLETED_PASS : ALC_STATES.PRODUCTION_ACTION;

            // Same-day check validation rule
            if (ALC_StateMachine.isPreviousDay) {
                isPass = false;
                statusText = "Closed - Expired";
                stateNext = ALC_STATES.SESSION_DASHBOARD;
            }

            // Compute overall score
            const allCheckpoints = await ALC_DAL.getCheckpoints(ALC_StateMachine.currentTourId);
            let totalMaxScore = allCheckpoints.length * 2;
            let totalObtainedScore = 0;

            allCheckpoints.forEach(cp => {
                const scoreText = cp.cr3ea_defectcategory;
                let numericScore = 2;
                if (scoreText.includes("(0)") || scoreText === "00" || scoreText.includes("Non-Compliant")) {
                    numericScore = 0;
                } else if (scoreText.includes("(1)") || scoreText === "01" || scoreText.includes("Partial")) {
                    numericScore = 1;
                }
                totalObtainedScore += numericScore;
            });

            const overallPercent = totalMaxScore > 0 ? Math.round((totalObtainedScore / totalMaxScore) * 100) : 0;

            // Get base title
            const session = ALC_StateMachine.currentSession || {};
            const baseTitle = session.cr3ea_title || ("ALC_" + moment().format("MM-DD-YYYY_HH:mm"));
            const cleanBaseTitle = baseTitle.split("||")[0].trim();

            const sessionUpdate = {
                cr3ea_prod_qualitytourid: ALC_StateMachine.currentTourId,
                cr3ea_status: statusText,
                cr3ea_processstatus: statusText,
                cr3ea_title: cleanBaseTitle,
                cr3ea_overall_score: overallPercent.toString(),
                cr3ea_checklist_result: isPass ? "Pass" : (ALC_StateMachine.isPreviousDay ? "Expired" : "Fail")
            };
            await ALC_DAL.saveSession(sessionUpdate);

            HideLoader();
            
            if (ALC_StateMachine.isPreviousDay) {
                alert(`Observations Submitted Successfully! Since this is a previous day's observation, the session has been closed as Expired without line clearance.`);
            } else if (isPass) {
                alert(`ALC Re-Verification Cleared Successfully! Overall Score: ${overallPercent}%`);
            } else {
                alert(`Re-Verification failed. Some checkpoints are still non-compliant. Returning to production.`);
            }

            // Transition state
            ALC_StateMachine.transitionTo(stateNext);

        } catch (error) {
            HideLoader();
            alert("Error submitting re-verification: " + error.message);
        }
    }
};
