// Steps 6 to 9: Checklist filling, scoring calculation, and validation logic
console.log("ALC Checklist script loaded");

const ALC_Checklist = {
    checkpoints: [],

    // Render Checklist
    renderChecklist: function () {
        // Collect check rows from the DOM and initialize Select2 if needed
        const selectElements = document.querySelectorAll("#section-checklist-filling tbody select");
        selectElements.forEach(select => {
            if (window.jQuery && $.fn.select2) {
                $(select).select2({ minimumResultsForSearch: -1, width: "100%" });
            }
        });
    },

    loadSavedCheckpoints: async function () {
        try {
            ShowLoader();
            const checkpoints = await ALC_DAL.getCheckpoints(ALC_StateMachine.currentTourId);
            
            // Loop through DOM checklist items
            const rows = document.querySelectorAll("#section-checklist-filling tbody tr");
            rows.forEach(row => {
                const tds = row.querySelectorAll("td");
                if (tds.length >= 4) {
                    const criteria = tds[1].innerText.trim();
                    const selectEl = tds[2].querySelector("select");
                    const remarksEl = tds[3].querySelector("input");

                    // Find matching saved checkpoint
                    const cp = checkpoints.find(c => c.cr3ea_criteria === criteria);
                    if (cp) {
                        let selectVal = "Compliant (2)";
                        if (cp.cr3ea_defectcategory) {
                            selectVal = cp.cr3ea_defectcategory;
                        } else if (cp.cr3ea_status === "Not Okay") {
                            selectVal = "Non-Compliant (0)";
                        }

                        if (selectEl) {
                            selectEl.value = selectVal;
                            if (window.jQuery && $.fn.select2) {
                                $(selectEl).trigger('change');
                            }
                        }
                        if (remarksEl) {
                            remarksEl.value = cp.cr3ea_defectremarks || "";
                        }
                    }
                }
            });
            HideLoader();
        } catch (e) {
            HideLoader();
            console.error("Failed to load saved checklist checkpoints:", e);
        }
    },

    // Step 7 & 8: Calculate score and evaluation (returns a Promise to ensure completeness)
    calculateScore: async function () {
        return new Promise((resolve) => {
            const rows = document.querySelectorAll("#section-checklist-filling tbody tr");
            let totalMaxScore = 0;
            let totalObtainedScore = 0;
            let hasDefects = false;
            const scores = [];

            rows.forEach(row => {
                const selectEl = row.querySelector("select");
                const remarksEl = row.querySelector("input[type='text']");
                if (selectEl) {
                    const scoreValue = selectEl.value;
                    let numericalScore = 2; // Default to Compliant (2)
                    
                    if (scoreValue.includes("(0)") || scoreValue === "00" || scoreValue.includes("Non-Compliant")) {
                        numericalScore = 0;
                        hasDefects = true;
                    } else if (scoreValue.includes("(1)") || scoreValue === "01" || scoreValue.includes("Partial")) {
                        numericalScore = 1;
                        hasDefects = true;
                    } else if (scoreValue.includes("(2)") || scoreValue === "02" || scoreValue.includes("Compliant")) {
                        numericalScore = 2;
                    }

                    totalObtainedScore += numericalScore;
                    totalMaxScore += 2; // Each checkpoint has max score of 2

                    scores.push({
                        criteria: row.querySelectorAll("td")[1]?.innerText.trim() || "",
                        score: numericalScore,
                        remarks: remarksEl ? remarksEl.value.trim() : ""
                    });
                }
            });

            const scorePercentRaw = totalMaxScore > 0 ? (totalObtainedScore / totalMaxScore) * 100 : 0;
            const scorePercent = scorePercentRaw.toFixed(2);
            
            resolve({
                percent: scorePercent,
                hasDefects: hasDefects,
                scores: scores
            });
        });
    },

    // Step 9: Submit and evaluate ALC Checklist
    submitChecklist: async function () {
        if (!ALC_StateMachine.currentTourId) {
            alert("No active session ID found.");
            return;
        }

        const evaluation = await this.calculateScore();
        
        let isPass = (parseFloat(evaluation.percent) >= 80);
        let statusText = "Completed";
        let stateNext = ALC_STATES.SUMMARY;

        if (ALC_StateMachine.isPreviousDay) {
            isPass = false;
            statusText = "Closed - Expired";
            stateNext = ALC_STATES.SUMMARY;
        } else if (evaluation.hasDefects) {
            statusText = isPass ? "Success - Pending Production" : "Failed - Pending Production";
            // QA (not in production team) should go to Summary page instead of Production Action
            stateNext = (ALC_StateMachine.isProductionUser || ALC_StateMachine.isProductUser) ? ALC_STATES.PRODUCTION_ACTION : ALC_STATES.SUMMARY;
        }

        try {
            ShowLoader();

            // 1. Save all checklist rows to Dataverse
            const rows = document.querySelectorAll("#section-checklist-filling tbody tr");
            let areaName = "Unknown Area";
            
            // Loop through DOM checklist items
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                // Check if this row is under a card section to capture Area Title
                const cardHeader = row.closest(".bs-card")?.querySelector(".bs-card-title")?.innerText.trim();
                if (cardHeader) areaName = cardHeader;

                const tds = row.querySelectorAll("td");
                if (tds.length >= 4) {
                    const criteria = tds[1].innerText.trim();
                    const selectEl = tds[2].querySelector("select");
                    const remarksEl = tds[3].querySelector("input");
                    
                    const scoreText = selectEl ? selectEl.value : "Compliant (2)";
                    const remarks = remarksEl ? remarksEl.value : "";
                    
                    let status = "OK";
                    if (scoreText.includes("(0)") || scoreText === "00" || scoreText.includes("Non-Compliant") ||
                        scoreText.includes("(1)") || scoreText === "01" || scoreText.includes("Partial")) {
                        status = "Not Okay";
                    }

                    // Save each checkpoint mapping to Dataverse Schema
                    await ALC_DAL.saveChecklistRow({
                        "cr3ea_qualitytourid": ALC_StateMachine.currentTourId,
                        "cr3ea_title": `ALC_${moment().format('MM-DD-YYYY')}`,
                        "cr3ea_cycle": `Cycle-1`,
                        "cr3ea_area": areaName,
                        "cr3ea_criteria": criteria,
                        "cr3ea_status": status,
                        "cr3ea_defectcategory": scoreText,
                        "cr3ea_defectremarks": remarks
                    });
                }
            }

            // 2. Update Tour Session status in Dataverse
            const session = ALC_StateMachine.currentSession || {};
            const baseTitle = session.cr3ea_title || ("ALC_" + moment().format("MM-DD-YYYY_HH:mm"));
            const cleanBaseTitle = baseTitle.split("||")[0].trim();

            const dbStatusValue = statusText === "Success - Pending Production" ? "Failed - Pending Production" : statusText;

            const sessionUpdate = {
                cr3ea_prod_qualitytourid: ALC_StateMachine.currentTourId,
                cr3ea_status: dbStatusValue,
                cr3ea_processstatus: statusText,
                cr3ea_title: cleanBaseTitle,
                cr3ea_overall_score: String(evaluation.percent),
                cr3ea_checklist_result: !evaluation.hasDefects ? "Pass" : (ALC_StateMachine.isPreviousDay ? "Expired" : "Fail")
            };
            await ALC_DAL.saveSession(sessionUpdate);

            HideLoader();

            // Notify user with Alert
            if (ALC_StateMachine.isPreviousDay) {
                alert(`Observations Submitted Successfully! Since this is a previous day's observation, the session has been closed as Expired without line clearance.`);
            } else if (statusText === "Success - Pending Production") {
                alert(`ALC Checklist Submitted successfully with Success Score: ${evaluation.percent}%. Forwarding to production for corrective actions.`);
            } else if (statusText === "Completed") {
                alert(`ALC Cleared Successfully! Score: ${evaluation.percent}%`);
            } else {
                alert(`ALC Checklist Failed. Score: ${evaluation.percent}%. Forwarding to production for corrective actions.`);
            }

            // Transition to Next State
            ALC_StateMachine.transitionTo(stateNext);
            if (stateNext === ALC_STATES.SUMMARY) {
                await ALC_Summary.init(ALC_StateMachine.currentTourId);
            }

        } catch (error) {
            HideLoader();
            alert("Error submitting ALC: " + error.message);
        }
    }
};
