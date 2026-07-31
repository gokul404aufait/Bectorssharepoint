// Step 12: Production corrective action logging and image uploading to Document Library
console.log("ALC Corrective Action script loaded");

const ALC_CorrectiveAction = {
    failedCheckpoints: [],
    uploadedFiles: {}, // Maps checkpoint index/id to uploaded file details

    // Load and render failed/objected items
    loadFailedItems: async function () {
        if (!ALC_StateMachine.currentTourId) return;

        try {
            ShowLoader();
            // Fetch all checkpoints saved in Dataverse
            const checkpoints = await ALC_DAL.getCheckpoints(ALC_StateMachine.currentTourId);
            
            // Filter failed items: score is "Partial" or "Non-Compliant" (0 or 1)
            this.failedCheckpoints = checkpoints.filter(c => 
                c.cr3ea_status === "Not Okay" || 
                (c.cr3ea_defectcategory && (
                    c.cr3ea_defectcategory.includes("00") || 
                    c.cr3ea_defectcategory.includes("01") ||
                    c.cr3ea_defectcategory.includes("Non-Compliant") ||
                    c.cr3ea_defectcategory.includes("Partial")
                ))
            );

            this.renderFailedItemsTable();
            HideLoader();
        } catch (error) {
            HideLoader();
            console.error("Failed to load ALC checklists for production actions:", error);
        }
    },

    // Render failed checkpoints table for corrective actions input
    renderFailedItemsTable: function () {
        const tbody = document.getElementById("failed-checkpoints-body");
        if (!tbody) return;

        if (this.failedCheckpoints.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center">No failed checkpoints found.</td></tr>`;
            return;
        }

        tbody.innerHTML = "";
        this.failedCheckpoints.forEach((cp, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td style="text-align: left;">
                    <strong>${cp.cr3ea_area}</strong><br>
                    <span class="text-secondary">${cp.cr3ea_criteria}</span>
                </td>
                <td><span class="badge badge-danger">${cp.cr3ea_defectcategory}</span></td>
                <td>
                    <textarea class="form-control action-remark-input" data-index="${index}" rows="2" placeholder="Describe action taken..."></textarea>
                </td>
                <td>
                    <div class="custom-file-upload">
                        <input type="file" class="form-control-file file-upload-input" data-index="${index}" onchange="ALC_CorrectiveAction.onFileSelected(this, ${index})">
                        <small id="file-status-${index}" class="form-text text-muted">No image uploaded</small>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    // Handle file input selection
    onFileSelected: async function (input, index) {
        const file = input.files[0];
        if (!file) return;

        const fileStatus = document.getElementById(`file-status-${index}`);
        if (fileStatus) fileStatus.innerText = `Reading file: ${file.name}...`;

        // Check if image format
        if (!file.type.startsWith("image/")) {
            alert("Only image files are allowed.");
            input.value = "";
            if (fileStatus) fileStatus.innerText = "No image uploaded";
            return;
        }

        // Cache the file object to be uploaded on submission
        this.uploadedFiles[index] = file;
        if (fileStatus) fileStatus.innerHTML = `<span class="text-success">✔ ${file.name} ready</span>`;
    },

    // Production submits corrective actions & uploads files
    submitActions: async function () {
        console.log("ALC_CorrectiveAction.submitActions triggered!");
        console.log("StateMachine Tour ID:", ALC_StateMachine.currentTourId);
        console.log("Checklist Failed Checkpoints Count:", this.failedCheckpoints.length);
        
        const rows = document.querySelectorAll("#failed-checkpoints-body tr");
        console.log("DOM Rows Count in failed-checkpoints-body:", rows.length);

        if (!ALC_StateMachine.currentTourId) {
            console.warn("Aborting submitActions: currentTourId is empty.");
            return;
        }

        if (rows.length === 0 || this.failedCheckpoints.length === 0) {
            console.warn("Aborting submitActions: no failed checkpoints or rows found.");
            return;
        }

        try {
            ShowLoader();

            for (let i = 0; i < this.failedCheckpoints.length; i++) {
                const cp = this.failedCheckpoints[i];
                console.log(`Processing corrective action row #${i + 1}: Checkpoint ID = ${cp.cr3ea_rajpura_alcsid}`);

                const remarkInput = document.querySelector(`.action-remark-input[data-index='${i}']`);
                const actionTaken = remarkInput ? remarkInput.value.trim() : "";
                console.log(`Action remarks for row #${i + 1}: "${actionTaken}"`);

                if (!actionTaken) {
                    alert(`Please provide action remarks for checkpoint #${i + 1}`);
                    HideLoader();
                    return;
                }

                const file = this.uploadedFiles[i];
                let uploadedUrl = "";
                if (file) {
                    console.log(`Uploading proof file for row #${i + 1}: ${file.name}`);
                    uploadedUrl = await ALC_DAL.uploadCorrectiveActionFile(
                        file, 
                        ALC_StateMachine.currentTourId, 
                        cp.cr3ea_area, 
                        cp.cr3ea_rajpura_alcsid || `CP-${i}`, 
                        actionTaken
                    );
                    console.log(`Proof uploaded successfully: ${uploadedUrl}`);
                }

                // Update checklist checkpoint record in Dataverse with action details
                const updatedRecord = {
                    cr3ea_rajpura_alcsid: cp.cr3ea_rajpura_alcsid,
                    cr3ea_defectremarks: `Action Taken: ${actionTaken} ${uploadedUrl ? '| Proof: ' + uploadedUrl : ''}`
                };
                console.log(`Saving checklist row details:`, updatedRecord);
                await ALC_DAL.saveChecklistRow(updatedRecord);
            }

            // Update Tour Session status to "Pending Re-Verification"
            const sessionUpdate = {
                cr3ea_prod_qualitytourid: ALC_StateMachine.currentTourId,
                cr3ea_status: "Pending Re-Verification",
                cr3ea_processstatus: "Pending Re-Verification"
            };
            console.log("Saving quality tour status updates:", sessionUpdate);
            await ALC_DAL.saveSession(sessionUpdate);

            HideLoader();
            alert("Corrective actions submitted successfully. Assigning back to QA for re-verification.");
            
            // Advance to QA Re-verifying state
            ALC_StateMachine.transitionTo(ALC_STATES.QA_REVERIFYING);

        } catch (error) {
            HideLoader();
            console.error("Error inside submitActions:", error);
            alert("Error submitting corrective actions: " + error.message);
        }
    }
};
