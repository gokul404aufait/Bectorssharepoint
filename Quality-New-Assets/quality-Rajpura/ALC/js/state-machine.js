// State Machine and Role-based UI visibility manager for ALC form
console.log("ALC State Machine loaded");

const ALC_STATES = {
    SESSION_DASHBOARD: "SESSION_DASHBOARD",         // Active sessions list / entry page
    INIT_PRODUCTION: "INIT_PRODUCTION",           // Step 1 / 1a
    PENDING_QA_ACCEPTANCE: "PENDING_QA_ACCEPTANCE", // Step 2 / 3
    QA_ACCEPTED: "QA_ACCEPTED",                     // Step 4 / 5
    QA_CHECKLIST: "QA_CHECKLIST",                   // Step 6 / 7 / 8 / 9
    COMPLETED_PASS: "COMPLETED_PASS",               // Step 10
    PRODUCTION_ACTION: "PRODUCTION_ACTION",         // Step 11 / 12
    QA_REVERIFYING: "QA_REVERIFYING"                // Step 13
};

const ALC_ROLES = {
    PRODUCTION: "PRODUCTION", // Shift Executive Production
    QUALITY: "QUALITY",       // QA Executive
    PRODUCT: "PRODUCT"        // Product Incharge / Area Owner
};

const ALC_StateMachine = {
    currentState: ALC_STATES.INIT_PRODUCTION,
    userRole: ALC_ROLES.PRODUCTION, // Default role
    currentTourId: null,
    isReadOnly: false,
    isPreviousDay: false,

    init: function (role, initialState, tourId) {
        this.userRole = role || ALC_ROLES.PRODUCTION;
        this.currentState = initialState || ALC_STATES.INIT_PRODUCTION;
        this.currentTourId = tourId || null;
        this.isReadOnly = false;
        this.isPreviousDay = false;
        
        console.log(`Initialized StateMachine with Role: ${this.userRole}, State: ${this.currentState}, TourId: ${this.currentTourId}`);
        this.transitionTo(this.currentState);
    },

    transitionTo: function (newState) {
        this.currentState = newState;
        this.applyVisibilityRules();
        
        // Trigger page-level state actions
        if (typeof window.onStateChanged === "function") {
            window.onStateChanged(newState, this.userRole);
        }
    },

    applyVisibilityRules: function () {
        // Hide all major step panels first
        const sections = [
            "#section-session-dashboard",
            "#section-production-init",
            "#section-pending-qa",
            "#section-checklist-filling",
            "#section-result-pass",
            "#section-result-fail",
            "#section-reverification"
        ];
        
        sections.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) el.style.display = "none";
        });

        // Hide warning banner by default
        const banner = document.getElementById("previous-day-warning-banner");
        if (banner) banner.style.display = "none";

        // Set visibility based on state
        switch (this.currentState) {
            case ALC_STATES.SESSION_DASHBOARD:
                this.showElement("#section-session-dashboard");
                // Only production roles can see the "Start New Request" button
                if (this.userRole === ALC_ROLES.PRODUCTION) {
                    this.showElement("#btn-start-new-session");
                } else {
                    this.hideElement("#btn-start-new-session");
                }
                break;

            case ALC_STATES.INIT_PRODUCTION:
                this.showElement("#section-production-init");
                this.setFieldsDisabled("#section-production-init", this.isReadOnly);
                break;

            case ALC_STATES.PENDING_QA_ACCEPTANCE:
                this.showElement("#section-pending-qa");
                // QA team should see "Accept" controls, Production sees "Waiting"
                if (this.userRole === ALC_ROLES.QUALITY && !this.isReadOnly) {
                    this.showElement("#qa-accept-panel");
                    this.hideElement("#production-wait-panel");
                } else {
                    this.hideElement("#qa-accept-panel");
                    this.showElement("#production-wait-panel");
                }
                break;

            case ALC_STATES.QA_CHECKLIST:
                this.showElement("#section-checklist-filling");
                // Disable inputs if read-only or not QA
                this.setFieldsDisabled("#section-checklist-filling", this.isReadOnly || this.userRole !== ALC_ROLES.QUALITY);
                const submitBtn = document.getElementById("submit-alc-btn");
                if (submitBtn) {
                    submitBtn.style.display = this.isReadOnly ? "none" : "block";
                }
                // Show warning banner only if previous day and in checklist state
                if (this.isPreviousDay && banner) {
                    banner.style.display = "block";
                }
                break;

            case ALC_STATES.COMPLETED_PASS:
                this.showElement("#section-result-pass");
                break;

            case ALC_STATES.PRODUCTION_ACTION:
                this.showElement("#section-result-fail");
                // Disable inputs if read-only
                this.setFieldsDisabled("#section-result-fail", this.isReadOnly);
                const correctiveSubmitBtn = document.getElementById("btn-submit-corrective-actions");
                if (correctiveSubmitBtn) {
                    correctiveSubmitBtn.style.display = this.isReadOnly ? "none" : "block";
                }
                // Show warning banner only if previous day and in action state
                if (this.isPreviousDay && banner) {
                    banner.style.display = "block";
                }
                break;

            case ALC_STATES.QA_REVERIFYING:
                this.showElement("#section-reverification");
                this.setFieldsDisabled("#section-reverification", this.isReadOnly);
                const reverifySubmitBtn = document.getElementById("btn-submit-reverification");
                if (reverifySubmitBtn) {
                    reverifySubmitBtn.style.display = this.isReadOnly ? "none" : "block";
                }
                // Show warning banner only if previous day and in reverifying state
                if (this.isPreviousDay && banner) {
                    banner.style.display = "block";
                }
                break;
        }
    },

    showElement: function (selector) {
        const el = document.querySelector(selector);
        if (el) el.style.display = "block";
    },

    hideElement: function (selector) {
        const el = document.querySelector(selector);
        if (el) el.style.display = "none";
    },

    setFieldsDisabled: function (selector, disabled) {
        const parent = document.querySelector(selector);
        if (!parent) return;
        
        const inputs = parent.querySelectorAll("input, select, textarea, button");
        inputs.forEach(el => {
            // Keep submit/navigation buttons enabled for non-restricted states
            if (el.classList.contains("nav-btn")) return;
            el.disabled = disabled;
        });
    }
};
