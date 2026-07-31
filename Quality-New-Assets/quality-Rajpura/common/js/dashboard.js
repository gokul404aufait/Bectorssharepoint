// Common Quality Dashboard controller for Rajpura plant forms
console.log("Rajpura Quality Dashboard Script loaded");

$(document).ready(function () {
    ALC_Dashboard.init();
});

const ALC_Dashboard = {
    init: async function () {
        // Poll every 100ms for up to 10 seconds to wait for async WelcomeWebPart user variables to load
        let attempts = 0;
        const maxAttempts = 100;
        
        const checkInterval = setInterval(async () => {
            const plant = typeof userPlantId !== 'undefined' ? userPlantId : "";
            const deptId = typeof userDepratmentId !== 'undefined' ? userDepratmentId.toString() : "";
            const pId = typeof Plantid !== 'undefined' ? Plantid.toString() : "";
            
            attempts++;
            
            if (plant !== "" || attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.log(`Resolved user details after ${attempts * 100}ms. Plant=${plant}, Dept=${deptId}`);
                
                // Initial evaluation of dashboard state
                await ALC_Dashboard.evaluateDashboardState();
                
                // Set up event listener on department dropdown changes to dynamically switch dashboards
                const deptDropdown = document.getElementById("DepartmentDropDownId");
                if (deptDropdown) {
                    $(deptDropdown).on("change", async () => {
                        console.log("Department dropdown changed to: " + deptDropdown.value);
                        await ALC_Dashboard.evaluateDashboardState();
                    });
                }
            }
        }, 100);
    },

    evaluateDashboardState: async function () {
        try {
            const plant = typeof userPlantId !== 'undefined' ? userPlantId : "";
            const pId = typeof Plantid !== 'undefined' ? Plantid.toString() : "";
            
            // Read selected department from dropdown if it is chosen, fallback to user's profile department
            const dropdownEl = document.getElementById("DepartmentDropDownId");
            const deptId = (dropdownEl && dropdownEl.value !== "All") ? dropdownEl.value.toString() : (typeof userDepratmentId !== 'undefined' ? userDepratmentId.toString() : "");

            const isQualityDept = (deptId === "80" || deptId === "81" || deptId === "135");
            const isRajpura = (plant === "Rajpura" || pId === "14" || isQualityDept);

            console.log(`Evaluating Dashboard: Plant=${plant}, SelectedDept=${deptId}, isRajpura=${isRajpura}, isQualityDept=${isQualityDept}`);

            if (isRajpura && isQualityDept) {
                await ALC_Dashboard.activateDashboard();
            } else {
                ALC_Dashboard.deactivateDashboard();
            }
        } catch (e) {
            console.error("Error in evaluateDashboardState: ", e);
        }
    },

    activateDashboard: async function () {
        try {
            console.log("Activating Rajpura Common Quality Dashboard");

            const dashboardEl = document.getElementById("rajpuraQualityDashboard");
            if (!dashboardEl) {
                console.warn("Custom Rajpura dashboard element (#rajpuraQualityDashboard) not found in DOM (possibly cached). Aborting activation.");
                return;
            }

            // 1. Hide generic default dashboards
            $('#ShowObservation').hide();
            $('#tblTourScores').hide();
            $('#ShowCategory').hide();
            $('#ShowGraph').hide();

            // 2. Show the Rajpura Dashboard wrapper
            $(dashboardEl).show();

            // 3. Load all tours and split them
            await ALC_Dashboard.loadAllTours();
        } catch (e) {
            console.error("Error in activateDashboard: ", e);
        }
    },

    deactivateDashboard: function () {
        console.log("Deactivating Rajpura Common Quality Dashboard");
        
        // 1. Hide the Rajpura Dashboard wrapper
        $('#rajpuraQualityDashboard').hide();
        
        // 2. Restore visibility of default SharePoint dashboards
        $('#ShowObservation').show();
        $('#tblTourScores').show();
        $('#ShowCategory').show();
        $('#ShowGraph').show();
    },

    // Fetch all tours for Rajpura and split into active/ongoing and archives
    loadAllTours: async function () {
        try {
            const token = typeof getAccessToken === "function" ? await getAccessToken() : null;
            if (!token) throw new Error("No token");

            const apiVersion = "9.2";
            const baseApiUrl = typeof environmentUrl !== 'undefined' ? environmentUrl : '';
            
            // Query latest 100 tours from quality tours
            const filter = "?$filter=cr3ea_plantid eq '14'&$orderby=cr3ea_tourstartdate desc&$top=100";
            const url = `${baseApiUrl}/api/data/v${apiVersion}/cr3ea_prod_qualitytours${filter}`;

            const response = await fetch(url, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json; charset=utf-8",
                    "OData-MaxVersion": "4.0",
                    "OData-Version": "4.0",
                    "Prefer": "return=representation",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("OData fetch failed");
            const data = await response.json();
            const list = data.value || [];

            // Calculate KPIs
            const totalTours = list.length;
            const passTours = list.filter(t => t.cr3ea_checklist_result === "Pass" || t.cr3ea_checklist_result === "PASS").length;
            const successRate = totalTours > 0 ? Math.round((passTours / totalTours) * 100) : 0;
            const pendingReVerify = list.filter(t => t.cr3ea_status === "Pending Re-Verification" || t.cr3ea_processstatus === "Pending Re-Verification").length;
            
            // Open deviations count equals tours failed and pending corrective actions
            const openDevs = list.filter(t => t.cr3ea_status === "Failed - Pending Production" || t.cr3ea_processstatus === "Failed - Pending Production").length;

            const kpiTotal = document.getElementById("kpi-total-tours");
            if (kpiTotal) kpiTotal.innerText = totalTours;

            const kpiSuccess = document.getElementById("kpi-success-rate");
            if (kpiSuccess) kpiSuccess.innerText = `${successRate}%`;

            const kpiOpen = document.getElementById("kpi-open-deviations");
            if (kpiOpen) kpiOpen.innerText = openDevs;

            const kpiPending = document.getElementById("kpi-pending-reverify");
            if (kpiPending) kpiPending.innerText = pendingReVerify;

            // Separate lists into active/ongoing and completed archives
            const ongoingList = [];
            const closedList = [];

            list.forEach(t => {
                const status = t.cr3ea_processstatus || t.cr3ea_status || "In Progress";
                if (status === "Completed" || status === "Closed" || status === "Closed - Expired") {
                    closedList.push(t);
                } else {
                    ongoingList.push(t);
                }
            });

            ALC_Dashboard.renderOngoingList(ongoingList);
            ALC_Dashboard.renderClosedList(closedList);

        } catch (error) {
            console.warn("Failed to load Dataverse tours, loading mock data fallback:", error);
            
            // Mock Fallback
            const mockOngoing = [
                { cr3ea_prod_qualitytourid: "mock-1", cr3ea_tourstartdate: new Date().toISOString(), cr3ea_title: "Area Line Clearance", cr3ea_lineno: "Line 1", cr3ea_shift: "Shift 2", cr3ea_shiftexecutiveproduction: "John Doe", cr3ea_tourby: "David QA", cr3ea_status: "Pending QA", cr3ea_processstatus: "Pending QA" },
                { cr3ea_prod_qualitytourid: "mock-2", cr3ea_tourstartdate: new Date().toISOString(), cr3ea_title: "Area Line Clearance", cr3ea_lineno: "Line 2", cr3ea_shift: "Shift 1", cr3ea_shiftexecutiveproduction: "Alice Production", cr3ea_tourby: "Emily QA", cr3ea_status: "Failed - Pending Production", cr3ea_processstatus: "Failed - Pending Production" }
            ];
            const mockClosed = [
                { cr3ea_prod_qualitytourid: "mock-3", cr3ea_tourstartdate: new Date(Date.now() - 86400000).toISOString(), cr3ea_title: "Area Line Clearance", cr3ea_lineno: "Line 1", cr3ea_shift: "Shift 3", cr3ea_shiftexecutiveproduction: "John Doe", cr3ea_tourby: "David QA", cr3ea_overall_score: 100, cr3ea_checklist_result: "Pass", cr3ea_status: "Completed", cr3ea_processstatus: "Completed" }
            ];
            ALC_Dashboard.renderOngoingList(mockOngoing);
            ALC_Dashboard.renderClosedList(mockClosed);
        }
    },

    // Resolve Pending With Name dynamically based on status
    getPendingWith: function (t) {
        const status = t.cr3ea_processstatus || t.cr3ea_status || "Pending QA";
        const prodName = t.cr3ea_shiftexecutiveproduction || "Production Team";
        const qaName = t.cr3ea_tourby || "QA Team";

        switch (status) {
            case "Pending QA":
                return `QA Incharge (${qaName})`;
            case "QA In Progress":
                return `QA Executive (${qaName})`;
            case "Failed - Pending Production":
                return `Production Exec (${prodName})`;
            case "Pending Re-Verification":
                return `QA Executive (${qaName})`;
            default:
                return "Production Team";
        }
    },

    // Parse non-standard and standard date formats safely using moment
    parseDate: function (dateStr) {
        if (!dateStr) return "N/A";
        // Parse custom format "DD-MM-YYYY HH:mm:ss" or default ISO formats
        const m = moment(dateStr, [
            "DD-MM-YYYY HH:mm:ss",
            "DD-MM-YYYY hh:mm A",
            "YYYY-MM-DDTHH:mm:ssZ",
            "YYYY-MM-DDTHH:mm:ss.SSSZ"
        ], true); // strict parsing
        
        if (m.isValid()) {
            return m.format("DD-MM-YYYY hh:mm A");
        }
        
        // Fallback to loose parsing
        const looseM = moment(dateStr);
        return looseM.isValid() ? looseM.format("DD-MM-YYYY hh:mm A") : dateStr;
    },

    // Render Ongoing table
    renderOngoingList: function (list) {
        const tbody = document.getElementById("rajpura-ongoing-tbody");
        if (!tbody) return;

        tbody.innerHTML = "";
        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center py-3 text-secondary">No ongoing clearance tours at the moment.</td></tr>`;
            return;
        }

        list.forEach(t => {
            try {
                const tr = document.createElement("tr");
                tr.style.cursor = "pointer";
                tr.title = "Click to open tour clearance form";
                tr.onclick = function () {
                    window.location.href = `/sites/Mrs_Bectors_PTMS/Pages/AreaLine.aspx?TourId=${t.cr3ea_prod_qualitytourid}`;
                };

                const date = ALC_Dashboard.parseDate(t.cr3ea_tourstartdate);
                const titleVal = t.cr3ea_title || "";
                const form = titleVal.split('_')[0] || "Area Line Clearance";
                const line = t.cr3ea_lineno || "N/A";
                const shift = t.cr3ea_shift || "N/A";
                const prodExec = t.cr3ea_shiftexecutiveproduction || "N/A";
                const qaExec = t.cr3ea_tourby || "N/A";
                const execs = `Prod: ${prodExec} | QA: ${qaExec}`;
                
                const status = t.cr3ea_processstatus || t.cr3ea_status || "Pending QA";
                let badgeClass = "badge-warning";
                if (status === "Failed - Pending Production") {
                    badgeClass = "badge-error";
                } else if (status === "QA In Progress" || status === "Pending Re-Verification") {
                    badgeClass = "badge-primary";
                }

                const pendingWith = ALC_Dashboard.getPendingWith(t);

                tr.innerHTML = `
                    <td>${date}</td>
                    <td><strong>${form}</strong></td>
                    <td>${line}</td>
                    <td>${shift}</td>
                    <td style="text-align: left;">${execs}</td>
                    <td><span class="badge badge-fill ${badgeClass}">${status}</span></td>
                    <td style="font-weight: 500; color: #1e293b;">${pendingWith}</td>
                `;
                tbody.appendChild(tr);
            } catch (err) {
                console.error("Error rendering ongoing row: ", err, t);
            }
        });
    },

    // Render Archives table
    renderClosedList: function (list) {
        const tbody = document.getElementById("rajpura-cycles-tbody");
        if (!tbody) return;

        tbody.innerHTML = "";
        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center py-3 text-secondary">No closed/completed tour archives.</td></tr>`;
            return;
        }

        list.forEach(t => {
            try {
                const tr = document.createElement("tr");
                tr.style.cursor = "pointer";
                tr.title = "Click to view observation details";
                tr.onclick = function () {
                    window.location.href = `/sites/Mrs_Bectors_PTMS/Pages/AreaLine.aspx?TourId=${t.cr3ea_prod_qualitytourid}`;
                };

                const date = ALC_Dashboard.parseDate(t.cr3ea_tourstartdate);
                const titleVal = t.cr3ea_title || "";
                const form = titleVal.split('_')[0] || "Area Line Clearance";
                const line = t.cr3ea_lineno || "N/A";
                const shift = t.cr3ea_shift || "N/A";
                const prodExec = t.cr3ea_shiftexecutiveproduction || "N/A";
                const qaExec = t.cr3ea_tourby || "N/A";
                const execs = `Prod: ${prodExec} | QA: ${qaExec}`;
                
                let score = t.cr3ea_overall_score ? `${t.cr3ea_overall_score}%` : "N/A";
                let result = t.cr3ea_checklist_result || "N/A";

                if (titleVal.indexOf("||") !== -1) {
                    const titleParts = titleVal.split("||");
                    const scorePart = titleParts[1] ? titleParts[1].trim() : "";
                    const resultPart = titleParts[2] ? titleParts[2].trim() : "";
                    if (scorePart.startsWith("Score:")) {
                        score = scorePart.replace("Score:", "").trim();
                    } else if (scorePart) {
                        score = scorePart;
                    }
                    result = resultPart || result;
                }

                const status = t.cr3ea_processstatus || t.cr3ea_status || "Completed";
                let badgeClass = "badge-success";
                if (status === "Closed - Expired") {
                    badgeClass = "badge-error";
                } else if (status === "Closed") {
                    badgeClass = "badge-secondary";
                }

                tr.innerHTML = `
                    <td>${date}</td>
                    <td><strong>${form}</strong></td>
                    <td>${line}</td>
                    <td>${shift}</td>
                    <td style="text-align: left;">${execs}</td>
                    <td><strong>${score}</strong></td>
                    <td><span class="badge badge-fill ${badgeClass}">${status}</span></td>
                `;
                tbody.appendChild(tr);
            } catch (err) {
                console.error("Error rendering closed row: ", err, t);
            }
        });
    }
};
