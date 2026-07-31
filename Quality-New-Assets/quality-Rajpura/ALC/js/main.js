// Bootstrap and Orchestration Module for ALC workflow
console.log("ALC Main Controller loaded");

document.addEventListener("DOMContentLoaded", async function () {
    ShowLoader();
    try {
        await ALC_Main.init();
    } catch (error) {
        console.error("Failed to initialize ALC module:", error);
    } finally {
        HideLoader();
    }
});

const ALC_Main = {
    userRole: ALC_ROLES.PRODUCTION,
    currentTourId: null,

    init: async function () {
        // 1. URL parameters check for TourId
        const urlParams = new URLSearchParams(window.location.search);
        this.currentTourId = urlParams.get('TourId');

        // 2. Identify User Role based on SharePoint Config list
        await this.identifyUserRole();

        // 3. Setup event listeners
        this.bindEvents();

        // 4. State routing based on session existence and status
        if (!this.currentTourId) {
            // Dashboard Mode
            ALC_StateMachine.init(this.userRole, ALC_STATES.SESSION_DASHBOARD, null);
            await this.renderDashboardQueue();
        } else {
            // Existing session mode (resume state)
            await this.resumeSessionState();
        }
    },

    // Identify user role from SharePoint config list Quality-Rajpura
    identifyUserRole: async function () {
        const currentUserName = typeof currentUser !== "undefined" ? currentUser : "";
        const currentUserLogin = typeof _spPageContextInfo !== 'undefined' ? _spPageContextInfo.userDisplayName : "";
        const currentUserEmail = typeof _spPageContextInfo !== 'undefined' ? _spPageContextInfo.userEmail : "";
        
        try {
            const configs = await ALC_DAL.getConfig();
            
            // Check if current user is listed under QA User config
            const isQaUser = configs.some(c => 
                c.ConfigType === "QA User" && 
                c.AssignedUser && 
                c.AssignedUser.results && 
                c.AssignedUser.results.some(u => u.Title === currentUserName || u.Title === currentUserLogin || (u.EMail && u.EMail.toLowerCase() === currentUserEmail.toLowerCase()))
            );

            // Check if current user is listed under Product Incharge config
            const isProductIncharge = configs.some(c => 
                c.ConfigType === "Product User" && 
                c.AssignedUser && 
                c.AssignedUser.results && 
                c.AssignedUser.results.some(u => u.Title === currentUserName || u.Title === currentUserLogin || (u.EMail && u.EMail.toLowerCase() === currentUserEmail.toLowerCase()))
            );

            if (isQaUser) {
                this.userRole = ALC_ROLES.QUALITY;
            } else if (isProductIncharge) {
                this.userRole = ALC_ROLES.PRODUCT;
            } else {
                this.userRole = ALC_ROLES.PRODUCTION;
            }

            console.log(`Current User Role Resolved to: ${this.userRole}`);
        } catch (error) {
            console.error("Error identifying user role, defaulting to Production:", error);
            this.userRole = ALC_ROLES.PRODUCTION;
        }
    },

    // Render the Active Requests Queue Dashboard
    renderDashboardQueue: async function () {
        const tbody = document.getElementById("dashboard-queue-tbody");
        if (!tbody) return;

        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #64748b;">Fetching active requests...</td></tr>';

        try {
            const sessions = await ALC_DAL.getActiveSessions();
            if (sessions.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #64748b;">No active clearance requests at this moment.</td></tr>';
                return;
            }

            tbody.innerHTML = "";
            sessions.forEach(session => {
                const tr = document.createElement("tr");
                tr.style.borderBottom = "1px solid #e2e8f0";

                const dateStr = session.cr3ea_tourstartdate ? moment(session.cr3ea_tourstartdate).format("DD-MM-YYYY hh:mm A") : "N/A";
                const line = session.cr3ea_lineno || "N/A";
                const shift = session.cr3ea_shift || "N/A";
                const prodExec = session.cr3ea_shiftexecutiveproduction || "N/A";
                const qaExec = session.cr3ea_tourby || "N/A";
                const status = session.cr3ea_processstatus || session.cr3ea_status || "Pending";

                let actionBtnHtml = "";
                const tourId = session.cr3ea_prod_qualitytourid;

                if (this.userRole === ALC_ROLES.QUALITY) {
                    if (status === "Pending QA") {
                        actionBtnHtml = `<button type="button" class="bs-btn bs-btn-primary bs-btn-sm" onclick="ALC_Main.routeToSession('${tourId}')">Accept Request</button>`;
                    } else if (status === "QA In Progress") {
                        actionBtnHtml = `<button type="button" class="bs-btn bs-btn-primary bs-btn-sm" onclick="ALC_Main.routeToSession('${tourId}')">Resume Checklist</button>`;
                    } else if (status === "Pending Re-Verification") {
                        actionBtnHtml = `<button type="button" class="bs-btn bs-btn-primary bs-btn-sm" onclick="ALC_Main.routeToSession('${tourId}')">Re-Verify</button>`;
                    } else {
                        actionBtnHtml = `<button type="button" class="bs-btn bs-btn-secondary bs-btn-sm" onclick="ALC_Main.routeToSession('${tourId}')">View</button>`;
                    }
                } else if (this.userRole === ALC_ROLES.PRODUCT) {
                    if (status === "Failed - Pending Production") {
                        actionBtnHtml = `<button type="button" class="bs-btn bs-btn-danger bs-btn-sm" onclick="ALC_Main.routeToSession('${tourId}')">Submit Actions</button>`;
                    } else {
                        actionBtnHtml = `<button type="button" class="bs-btn bs-btn-secondary bs-btn-sm" onclick="ALC_Main.routeToSession('${tourId}')">View</button>`;
                    }
                } else { // PRODUCTION / Shift Executive
                    if (status === "Failed - Pending Production" || status === "Pending Re-Verification") {
                        actionBtnHtml = `<button type="button" class="bs-btn bs-btn-primary bs-btn-sm" onclick="ALC_Main.routeToSession('${tourId}')">Resume</button>`;
                    } else {
                        actionBtnHtml = `<button type="button" class="bs-btn bs-btn-secondary bs-btn-sm" onclick="ALC_Main.routeToSession('${tourId}')">View</button>`;
                    }
                }

                tr.innerHTML = `
                    <td style="padding: 12px 15px;">${dateStr}</td>
                    <td style="padding: 12px 15px;">${line}</td>
                    <td style="padding: 12px 15px;">${shift}</td>
                    <td style="padding: 12px 15px;">${prodExec}</td>
                    <td style="padding: 12px 15px;">${qaExec}</td>
                    <td style="padding: 12px 15px;"><span class="badge ${status === 'Pending QA' ? 'badge-warning' : (status === 'Failed - Pending Production' ? 'badge-error' : 'badge-success')}">${status}</span></td>
                    <td style="padding: 12px 15px; text-align: center;">${actionBtnHtml}</td>
                `;
                tbody.appendChild(tr);
            });
        } catch (e) {
            console.error("Error rendering dashboard queue:", e);
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #ef4444;">Failed to fetch active requests from Dataverse.</td></tr>';
        }
    },

    routeToSession: function (tourId) {
        window.location.search = `?TourId=${tourId}`;
    },

    // Fetch existing tour session and transition state
    resumeSessionState: async function () {
        const AccessToken = await ALC_DAL.getAccessToken();
        const baseApiUrl = typeof environmentUrl !== 'undefined' ? environmentUrl : '';
        const url = `${baseApiUrl}/api/data/v9.2/cr3ea_prod_qualitytours(${this.currentTourId})`;

        const headers = { "Accept": "application/json" };
        if (AccessToken) headers["Authorization"] = `Bearer ${AccessToken}`;

        try {
            const response = await fetch(url, { headers: headers });
            if (!response.ok) throw new Error(`Session fetch failed with status ${response.status}`);

            const session = await response.json();
            const status = session.cr3ea_processstatus || session.cr3ea_status;
            
            console.log(`Resuming session ${this.currentTourId} with Dataverse status: ${status}`);

            // Store globally
            ALC_StateMachine.currentSession = session;

            // Same-day check
            const creationTime = session.createdon || session.cr3ea_tourstartdate;
            if (creationTime) {
                const parsedDate = moment(creationTime, [moment.ISO_8601, "DD/MM/YYYY", "YYYY-MM-DD HH:mm:ss"]);
                if (parsedDate.isValid()) {
                    const tourDateLocal = parsedDate.local().format("YYYY-MM-DD");
                    const todayLocal = moment().format("YYYY-MM-DD");
                    const isToday = (tourDateLocal === todayLocal);
                    
                    console.log(`Same-day check: TourDateLocal=${tourDateLocal}, TodayLocal=${todayLocal}, isToday=${isToday}`);
                    
                    ALC_StateMachine.isPreviousDay = !isToday;
                }
            }

            // Update UI with existing header values
            this.populateHeaderFields(session);

            // Execute transition
            await this.transitionByStatus(status, session);
        } catch (error) {
            console.warn("Failed to fetch session from Dataverse. Loading mock session fallback for testing/offline use:", error);
            
            // Populate mock session for visual testing/offline execution
            const urlParams = new URLSearchParams(window.location.search);
            const mockStatus = urlParams.get('status') || "QA In Progress";
            
            const mockSession = {
                cr3ea_prod_qualitytoursid: this.currentTourId,
                cr3ea_shiftexecutiveproduction: urlParams.get('exec') || "Mishab Muhammad",
                cr3ea_lineno: urlParams.get('line') || "Line 1",
                cr3ea_shift: urlParams.get('shift') || "Shift 1",
                cr3ea_previousrunningvariety: "Bectors Original",
                cr3ea_runningvariety: "Marie Delight",
                cr3ea_status: mockStatus,
                cr3ea_processstatus: mockStatus,
                cr3ea_title: "ALC_" + moment().format("MM-DD-YYYY_HH:mm"),
                cr3ea_tourstartdate: new Date().toISOString()
            };

            // Store globally
            ALC_StateMachine.currentSession = mockSession;

            this.populateHeaderFields(mockSession);
            await this.transitionByStatus(mockSession.cr3ea_status, mockSession);
        }
    },

    // Route state machine and bootstrap necessary modules based on status
    transitionByStatus: async function (status, session) {
        if (status === "Completed" || status === "Closed" || status === "Closed - Expired") {
            ALC_StateMachine.isReadOnly = true;
            ALC_StateMachine.init(this.userRole, ALC_STATES.QA_CHECKLIST, this.currentTourId);
            ALC_Checklist.renderChecklist();
            await ALC_Checklist.loadSavedCheckpoints();
        } else if (status === "Pending QA") {
            ALC_StateMachine.init(this.userRole, ALC_STATES.PENDING_QA_ACCEPTANCE, this.currentTourId);
            ALC_QARequest.startTimer(ALC_QARequest.requestTimeResolved || session.cr3ea_tourstartdate || session.cr3ea_request_time, session.cr3ea_tourby);
        } else if (status === "QA In Progress") {
            ALC_StateMachine.init(this.userRole, ALC_STATES.QA_CHECKLIST, this.currentTourId);
            ALC_Checklist.renderChecklist();
        } else if (status === "Failed - Pending Production") {
            ALC_StateMachine.init(this.userRole, ALC_STATES.PRODUCTION_ACTION, this.currentTourId);
            await ALC_CorrectiveAction.loadFailedItems();
        } else if (status === "Pending Re-Verification") {
            ALC_StateMachine.init(this.userRole, ALC_STATES.QA_REVERIFYING, this.currentTourId);
            await ALC_ReVerification.loadReverificationItems();
        } else {
            ALC_StateMachine.init(this.userRole, ALC_STATES.INIT_PRODUCTION, this.currentTourId);
            await ALC_QARequest.init();
        }
    },

    populateHeaderFields: function (session) {
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = val || "";
        };

        let observedBy = session.cr3ea_observedby || "";
        let shift = session.cr3ea_shift || "";
        let line = session.cr3ea_lineno || "";
        let prevProduct = session.cr3ea_previousrunningvariety || "";
        let newProduct = session.cr3ea_runningvariety || "";
        let requestTime = session.cr3ea_request_time || "";
        let assignedQa = session.cr3ea_assigned_qa || "";
        let escalationContacts = session.cr3ea_escalation_contacts || "";

        // Check if cr3ea_observedby is serialized metadata (fallback for older records)
        if (observedBy.indexOf("||") !== -1) {
            const parts = observedBy.split("||");
            observedBy = parts[0] ? parts[0].trim() : "";
            shift = shift || (parts[1] ? parts[1].trim() : "");
            line = line || (parts[2] ? parts[2].trim() : "");
            prevProduct = prevProduct || (parts[3] ? parts[3].trim() : "");
            newProduct = newProduct || (parts[4] ? parts[4].trim() : "");
            if (parts[5]) requestTime = requestTime || parts[5].trim();
            if (parts[6]) assignedQa = assignedQa || parts[6].trim();
            if (parts[7]) escalationContacts = escalationContacts || parts[7].trim();
        }

        // Prioritize native columns
        let prodExec = session.cr3ea_shiftexecutiveproduction || observedBy;
        if (ALC_StateMachine.currentState === ALC_STATES.INIT_PRODUCTION) {
            const actualUser = typeof _spPageContextInfo !== 'undefined' ? _spPageContextInfo.userDisplayName : "";
            if (actualUser) {
                prodExec = actualUser;
            }
        }
        const qaExec = session.cr3ea_tourby || session.cr3ea_shiftexecutivequality || "";

        // Store resolved values on ALC_QARequest so timer and escalation logic can use them
        ALC_QARequest.requestTimeResolved = requestTime || session.cr3ea_tourstartdate;
        ALC_QARequest.assignedQaEmailResolved = assignedQa;
        ALC_QARequest.escalationEmailsResolved = escalationContacts ? escalationContacts.split(",") : [];

        const tourDate = session.cr3ea_tourstartdate || requestTime;
        const dateFormatted = tourDate ? moment(tourDate).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY");
        const timeFormatted = tourDate ? moment(tourDate).format("hh:mm A") : moment().format("hh:mm A");

        setVal("header-date", dateFormatted);
        setVal("header-time", timeFormatted);

        const currentDayEl = document.getElementById("currentDay");
        if (currentDayEl) currentDayEl.innerText = `• ${dateFormatted}`;

        const shiftBadgeEl = document.getElementById("shiftBadge");
        if (shiftBadgeEl) shiftBadgeEl.innerText = shift || "Shift 1";

        setVal("header-exec-prod", prodExec);
        setVal("header-line", line);
        setVal("header-shift", shift);
        setVal("header-prev-product", prevProduct);
        setVal("header-new-product", newProduct);
        setVal("header-exec-qual", qaExec);

        // Trigger Select2 updates so dropdown selections render correctly
        if (window.jQuery && $.fn.select2) {
            $("#header-line").trigger("change");
            $("#header-shift").trigger("change");
            $("#header-prev-product").trigger("change");
            $("#header-new-product").trigger("change");
        }
    },

    // Register button click events
    bindEvents: function () {
        const bindClick = (id, fn) => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener("click", fn);
        };

        // Dashboard Start Session Button
        bindClick("btn-start-new-session", () => {
            ALC_StateMachine.transitionTo(ALC_STATES.INIT_PRODUCTION);
            ALC_QARequest.init();
        });

        // Step 2 Submission
        bindClick("btn-submit-request", () => ALC_QARequest.submitRequest());

        // Step 4 Accept
        bindClick("btn-accept-request", () => ALC_QARequest.acceptRequest());

        // Step 7 Checklist Submission
        bindClick("submit-alc-btn", () => ALC_Checklist.submitChecklist());

        // Step 12 Production resubmit
        bindClick("btn-submit-corrective-actions", () => ALC_CorrectiveAction.submitActions());

        // Step 13 QA Re-verification submit
        bindClick("btn-submit-reverification", () => ALC_ReVerification.submitReverification());
    }
};

// Global state changed event listener
window.onStateChanged = function (newState, role) {
    console.log(`UI State Changed: ${newState}`);
    
    // Automatically trigger loads when transitioning to action views
    if (newState === ALC_STATES.PRODUCTION_ACTION) {
        ALC_CorrectiveAction.loadFailedItems();
    } else if (newState === ALC_STATES.QA_REVERIFYING) {
        ALC_ReVerification.loadReverificationItems();
    }
};
