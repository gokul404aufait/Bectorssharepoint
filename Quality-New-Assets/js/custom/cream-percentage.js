// Global variables
let cycleCounter = 1;
QualityTourId = GetQueryStringParams('TourId');

$(document).ready(function () {
    getEmployeeDetails(EmployeeDetailsSuccess, EmployeeDetailsFailure);
})
//success response for getEmployeeDetails
function EmployeeDetailsSuccess(collEmployee) {
    if (collEmployee.length > 0) {
        PlantId = collEmployee[0].PlantId.toString();
        EmployeeName = collEmployee[0].Title;
        userDepratmentId = collEmployee[0].DepartmentId.toString();
        userRoleSequence = collEmployee[0].RoleSequence;
        userRoleName = collEmployee[0].RoleName;
        UserRoleId = collEmployee[0].RoleId;
        UserName = collEmployee[0].Title;
    }
}
//error response for getEmployeeDetails
function EmployeeDetailsFailure() {
}
// DOM Content Loaded Event Listeners
document.addEventListener("DOMContentLoaded", async function () {
    initializeApplication();
    reloadFetchCycleData();

    document.addEventListener('click', toggleCardHandler);
    document.addEventListener('click', saveSessionHandler);
    document.addEventListener('click', startSessionHandler);
});

async function reloadFetchCycleData() {
    const existingCycles = await fetchCycleData();
    console.log("Fetched cycles:", existingCycles);

    const parentElement = document.querySelector(".tour-cycle-card-panel-lists");
    if (parentElement) parentElement.innerHTML = '';

    if (existingCycles.length > 0) {
        existingCycles.forEach(cycleData => {
            createCycleSection(cycleData.cycleNum, true, cycleData);
        });
        cycleCounter = Math.max(...existingCycles.map(c => parseInt(c.cycleNum))) + 1;
        createCycleSection(cycleCounter, false);
    } else {
        createCycleSection(1, false);
    }
    console.log("Initial cycleCounter:", cycleCounter);
}

function toggleCardHandler(event) {
    const btn = event.target.closest('.bs-card-toggler-btn');
    if (!btn) return;

    console.log("Toggle button clicked");
    const currentPanel = btn.closest('.bs-card-toggler');
    const currentPanelBody = currentPanel.querySelector('.bs-card-body');
    if (!currentPanelBody) {
        console.error("Panel body not found");
        return;
    }

    const isCompleted = currentPanel.classList.contains('completed-cycle');
    console.log("Is this a completed cycle?", isCompleted);

    currentPanel.classList.toggle('bs-card-toggler-is-active');
    const isActive = currentPanel.classList.contains('bs-card-toggler-is-active');
    console.log("Toggle state (isActive):", isActive);

    if (isActive) {
        console.log("Entering expand block");
        currentPanel.style.cssText = "height: auto !important; overflow: visible !important; display: block !important;";
        currentPanelBody.style.cssText = "max-height: none !important; height: auto !important; overflow: visible !important; display: block !important;";
        void currentPanelBody.offsetHeight; // Force reflow
        const requiredHeight = currentPanelBody.scrollHeight;
        currentPanelBody.style.cssText = `max-height: ${requiredHeight}px !important; height: auto !important; overflow: visible !important; display: block !important;`;

        // Ensure completed section is fully visible
        const completedSection = currentPanel.querySelector('.tour-cyle-step-completed');
        if (isCompleted && completedSection) {
            completedSection.style.cssText = "display: block !important; height: auto !important; overflow: visible !important;";
            completedSection.classList.add('bs-fade-active', 'bs-fade-in');
        }
    } else {
        console.log("Entering collapse block");
        currentPanel.style.cssText = "height: 80px !important; overflow: hidden !important; display: block !important;";
        currentPanelBody.style.cssText = "max-height: 0px !important; height: 0px !important; overflow: hidden !important; display: block !important;";
    }

    const startSection = currentPanel.querySelector('.tour-cyle-step-start');
    const infoWrapper = currentPanel.querySelector('.tour-cycle-info-wrapper');
    const form = currentPanel.querySelector('.tour-cyle-step-form');
    const completedSection = currentPanel.querySelector('.tour-cyle-step-completed');

    if (isCompleted) {
        if (completedSection) completedSection.style.display = isActive ? "block" : "none";
        if (infoWrapper) infoWrapper.style.display = isActive ? "block" : "none";
        if (startSection) startSection.style.display = "none";
        if (form) form.style.display = "none";
    } else {
        if (startSection) startSection.style.display = isActive ? "block" : "none";
        if (infoWrapper) infoWrapper.style.display = isActive ? "block" : "none";
        if (form) form.style.display = isActive ? "block" : "none";
        if (completedSection) completedSection.style.display = "none";
    }
}

function startSessionHandler(event) {
    const btn = event.target.closest('.bs-btn-primary');
    if (!btn || btn.textContent !== "Start Session") return;

    const cycleNum = btn.id.split('-')[2];
    const cyclePanel = document.getElementById(`cycle-${cycleNum}`);
    if (!cyclePanel) {
        console.error("Cycle panel not found");
        return;
    }

    const startForm = cyclePanel.querySelector('.tour-cyle-step-start');
    const infoWrapper = cyclePanel.querySelector('.tour-cycle-info-wrapper');
    const formSection = cyclePanel.querySelector('.tour-cyle-step-form');

    if (!startForm || !infoWrapper || !formSection) {
        console.error("Required elements not found:", { startForm, infoWrapper, formSection });
        return;
    }

    const product = document.getElementById(`productSelect-${cycleNum}`).value;
    const executiveName = document.getElementById(`executive-name-${cycleNum}`).value;
    const machineNo = document.getElementById(`machine-no-${cycleNum}`).value;
    const lineNo = document.getElementById(`line-no-${cycleNum}`).value;
    const standardCreamPercentage = document.getElementById(`cream-percentage-no-${cycleNum}`).value;

    const startData = {
        product,
        executiveName,
        machineNo,
        lineNo,
        standardCreamPercentage
    };
    localStorage.setItem(`cycle-${cycleNum}-start-data`, JSON.stringify(startData));
    console.log("Start data saved to localStorage:", startData);

    infoWrapper.innerHTML = `
        <div class="tour-cyle-start-info">
            <div class="start-info-item">
                <p class="item-label">Product</p>
                <p class="item-value" id="product-${cycleNum}">${product}</p>
            </div>
            <div class="start-info-item">
                <p class="item-label">Executive Name</p>
                <p class="item-value" id="executive-name-display-${cycleNum}">${executiveName}</p>
            </div>
            <div class="start-info-item">
                <p class="item-label">Machine No</p>
                <p class="item-value" id="machine-no-display-${cycleNum}">${machineNo}</p>
            </div>
            <div class="start-info-item">
                <p class="item-label">Line</p>
                <p class="item-value" id="line-no-display-${cycleNum}">${lineNo}</p>
            </div>
            <div class="start-info-item">
                <p class="item-label">Standard Cream Percentage</p>
                <p class="item-value">${standardCreamPercentage}</p>
            </div>
        </div>
    `;

    const startFormClone = startForm.cloneNode(true);
    startForm.remove();

    infoWrapper.style.display = "block";
    formSection.style.display = "block";
    formSection.classList.add("bs-fade-active", "bs-fade-in");

    const cancelBtn = formSection.querySelector('.bs-btn-outline-primary');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function restoreStartForm(e) {
            e.preventDefault();
            window.location.reload()
            formSection.style.display = "none";
            infoWrapper.style.display = "none";
            cyclePanel.querySelector('.bs-card-body').insertBefore(startFormClone, formSection);
            console.log("Start form restored on cancel");
        }, { once: true });
    }
}

async function saveSessionHandler(event) {
    const btn = event.target.closest('.tour-cycle-save-session-btn');
    if (!btn) return;

    const cyclePanel = btn.closest('.tour-cycle-panel');
    const cycleNum = cyclePanel.querySelector('.bs-card-title').textContent.split(' ')[1];
    console.log(`Saving Cycle ${cycleNum}`);
    await saveSectionButtonClick(cyclePanel, cycleNum);
}

async function fetchCycleData() {
    try {
        const AccessToken = await getAccessToken();
        if (!AccessToken) throw new Error("Access token is invalid or missing");

        const headers = {
            "Accept": "application/json",
            "OData-MaxVersion": "4.0",
            "OData-Version": "4.0",
            "Authorization": `Bearer ${AccessToken}`
        };

        const apiVersion = "9.2";
        const tableName = "cr3ea_prod_creams";
        const apiUrl = `${environmentUrl}/api/data/v${apiVersion}/${tableName}?$filter=cr3ea_qualitytourid eq '${QualityTourId}'&$select=cr3ea_cycle,cr3ea_creampercent1,cr3ea_creampercent2,cr3ea_creampercent3,cr3ea_creampercent4,cr3ea_wtofsandwich1,cr3ea_wtofsandwich2,cr3ea_wtofsandwich3,cr3ea_wtofsandwich4,cr3ea_wtofshell1,cr3ea_wtofshell2,cr3ea_wtofshell3,cr3ea_wtofshell4,cr3ea_avg,cr3ea_productname,cr953_executivename,cr3ea_stdcreampercent,cr3ea_machineno,cr3ea_lineno,cr3ea_cycle`;

        const response = await fetch(apiUrl, { headers });
        if (!response.ok) throw new Error(`Failed to fetch data: ${response.status} - ${await response.text()}`);

        const data = await response.json();
        const cycles = {};

        data.value.forEach(record => {
            const cycleNum = record.cr3ea_cycle.replace('Cycle-', '');
            if (!cycles[cycleNum]) {
                cycles[cycleNum] = {
                    cycleNum,
                    wtSandwich: [record.cr3ea_wtofsandwich1, record.cr3ea_wtofsandwich2, record.cr3ea_wtofsandwich3, record.cr3ea_wtofsandwich4].filter(Boolean),
                    wtShell: [record.cr3ea_wtofshell1, record.cr3ea_wtofshell2, record.cr3ea_wtofshell3, record.cr3ea_wtofshell4].filter(Boolean),
                    creamPercentage: [record.cr3ea_creampercent1, record.cr3ea_creampercent2, record.cr3ea_creampercent3, record.cr3ea_creampercent4].filter(Boolean),
                    average: record.cr3ea_avg || "N/A",
                    product: record?.cr3ea_productname || "N/A",
                    machineNo: record?.cr3ea_machineno || "N/A",
                    lineNo: record?.cr3ea_lineno || "N/A",
                    executiveName: record?.cr953_executivename || "N/A",
                    standardCreamPercentage: record?.cr3ea_stdcreampercent || "N/A"
                };
                const storedData = localStorage.getItem(`cycle-${cycleNum}-start-data`);
                if (storedData) {
                    const { product, machineNo, lineNo, standardCreamPercentage } = JSON.parse(storedData);
                    cycles[cycleNum].product = product || "N/A";
                    cycles[cycleNum].machineNo = machineNo || "N/A";
                    cycles[cycleNum].lineNo = lineNo || "N/A";
                    cycles[cycleNum].executiveName = executiveName || "N/A";
                    cycles[cycleNum].standardCreamPercentage = standardCreamPercentage || "N/A";
                }
            }
        });

        return Object.values(cycles);
    } catch (error) {
        console.error('Error fetching cycle data:', error);
        return [];
    }
}

async function saveSectionButtonClick(cyclePanel, cycleNum) {
    const stepForm = cyclePanel.querySelector('.tour-cyle-step-form');
    const stepCompleted = cyclePanel.querySelector('.tour-cyle-step-completed');
    const infoWrapper = cyclePanel.querySelector('.tour-cycle-info-wrapper');

    const cycleData = await collectEstimationDataCycleSave(cycleNum);
    console.log("Cycle data before rendering:", cycleData);
    renderCompletedSection(stepCompleted, cycleData);

    stepForm.style.display = "none";
    stepCompleted.style.display = "block";
    stepCompleted.classList.add("bs-fade-active", "bs-fade-in");

    cyclePanel.classList.add('completed-cycle');
    cyclePanel.classList.remove('bs-card-toggler-is-active');
    cyclePanel.style.cssText = "height: 80px !important; overflow: hidden !important; display: block !important;";
    const currentPanelBody = cyclePanel.querySelector('.bs-card-body');
    currentPanelBody.style.cssText = "max-height: 0px !important; height: 0px !important; overflow: hidden !important; display: block !important;";

    const nextCycleNum = parseInt(cycleNum) + 1;
    if (!document.querySelector(`#cycle-${nextCycleNum}`)) {
        createCycleSection(nextCycleNum, false);
        cycleCounter = nextCycleNum + 1;
    }

    document.querySelectorAll('.bs-card-toggler').forEach(panel => {
        const panelCycleNum = panel.querySelector('.bs-card-title').textContent.split(' ')[1];
        if (panelCycleNum !== nextCycleNum.toString()) {
            panel.classList.remove('bs-card-toggler-is-active');
            const panelBodyInner = panel.querySelector('.bs-card-body');
            if (panelBodyInner) {
                panelBodyInner.style.cssText = "max-height: 0px !important; height: 0px !important; overflow: hidden !important;";
            }
        }
    });

    const nextCyclePanel = document.querySelector(`#cycle-${nextCycleNum}`);
    if (nextCyclePanel) {
        nextCyclePanel.classList.add('bs-card-toggler-is-active');
        const nextPanelBody = nextCyclePanel.querySelector('.bs-card-body');
        if (nextPanelBody) {
            nextPanelBody.style.cssText = "max-height: none !important; height: auto !important; overflow: visible !important;";
        }
        const nextStart = nextCyclePanel.querySelector('.tour-cyle-step-start');
        if (nextStart) nextStart.style.display = "block";
    }

    await reloadFetchCycleData();
}

function createCycleSection(cycleNum, isCompleted = false, cycleData = null) {
    const existingCycle = document.querySelector(`#cycle-${cycleNum}`);
    if (existingCycle) {
        if (isCompleted && cycleData) {
            const completedSection = existingCycle.querySelector('.tour-cyle-step-completed');
            renderCompletedSection(completedSection, cycleData);
            completedSection.classList.add("bs-fade-active", "bs-fade-in");
            const startSection = existingCycle.querySelector('.tour-cyle-step-start');
            const infoWrapper = existingCycle.querySelector('.tour-cycle-info-wrapper');
            const stepForm = existingCycle.querySelector('.tour-cyle-step-form');
            if (startSection) startSection.style.display = "none";
            if (infoWrapper) infoWrapper.style.display = "block";
            if (stepForm) stepForm.style.display = "none";
            completedSection.style.display = "block";
            existingCycle.classList.add('completed-cycle');
            existingCycle.classList.remove('bs-card-toggler-is-active');
            const panelBody = existingCycle.querySelector('.bs-card-body');
            panelBody.style.cssText = "max-height: 0px !important; height: 0px !important; overflow: hidden !important; display: block !important;";
        }
        return;
    }

    const newCycle = document.createElement("div");
    newCycle.classList.add("bs-card-toggler", "bs-card", "bs-card-secondary", "tour-cycle-panel", `tour-cycle-panel-${cycleNum}`);
    if (isCompleted) newCycle.classList.add("completed-cycle");
    newCycle.setAttribute("id", `cycle-${cycleNum}`);

    const initialDisplay = isCompleted ? "none" : "block";
    const initialBodyStyle = isCompleted ? "max-height: 0px !important; height: 0px !important; overflow: hidden !important; display: block !important;" : "max-height: none !important; height: auto !important; overflow: visible !important; display: block !important;";

    newCycle.innerHTML = `
        <div class="bs-card-header">
            <h4 class="bs-card-title" id="CardTitle-${cycleNum}">Cycle ${cycleNum}</h4>
            <button type="button" class="bs-btn icon-btn bs-card-toggler-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3.66667 5.66666L8.33333 10.3333L13 5.66666" stroke="#0C0D10" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>
        </div>
        <div class="bs-card-body" style="${initialBodyStyle}">
            <div class="tour-cyle-step tour-cyle-step-start tour-cyle-step-start-${cycleNum} bs-fade-elem ${isCompleted ? '' : 'bs-fade-active bs-fade-in'}" style="display: ${initialDisplay};">
                <div class="tour-cyle-info-form">
                    <div class="form-group">
                        <label class="form-label" for="productSelect-${cycleNum}">Product</label>
                        <div class="select2-parent">
                            <select id="productSelect-${cycleNum}" class="form-select" name="product-dropdown">
                                <option value="Speciality Sauces">Speciality Sauces</option>
                                <option value="Zesty Wasabi">Zesty Wasabi</option>
                                <option value="Mayonnaise">Mayonnaise</option>
                                <option value="Sandwich Spread">Sandwich Spread</option>
                                <option value="Indian Chutneys">Indian Chutneys</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="executive-name-${cycleNum}">Executive Name</label>
                        <input type="text" class="form-control" id="executive-name-${cycleNum}" placeholder="" />
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="machine-no-${cycleNum}">Machine No</label>
                        <input type="text" class="form-control" id="machine-no-${cycleNum}" placeholder="" />
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="line-no-${cycleNum}">Line</label>
                        <input type="text" class="form-control" id="line-no-${cycleNum}" placeholder="" />
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="cream-percentage-no-${cycleNum}">Standard Cream Percentage</label>
                        <input type="text" class="form-control" id="cream-percentage-no-${cycleNum}" placeholder="" />
                    </div>
                    <div class="form-footer">
                        <button type="button" id="bs-startSession-${cycleNum}" class="bs-btn bs-btn-primary">Start Session</button>
                    </div>
                </div>
            </div>
            <div class="tour-cycle-info-wrapper tour-cycle-info-wrapper-${cycleNum} bs-fade-elem bs-fade-active bs-fade-in" style="display: ${isCompleted ? 'block' : 'none'};">
                ${isCompleted && cycleData ? `
                    <div class="tour-cyle-start-info">
                        <div class="start-info-item">
                            <p class="item-label">Product</p>
                            <p class="item-value" id="product-${cycleNum}">${cycleData.product}</p>
                        </div>
                        <div class="start-info-item">
                            <p class="item-label">Executive Name</p>
                            <p class="item-value" id="executive-name-display-${cycleNum}">${cycleData.executiveName}</p>
                        </div>
                        <div class="start-info-item">
                            <p class="item-label">Machine No</p>
                            <p class="item-value" id="machine-no-display-${cycleNum}">${cycleData.machineNo}</p>
                        </div>
                        <div class="start-info-item">
                            <p class="item-label">Line</p>
                            <p class="item-value" id="line-no-display-${cycleNum}">${cycleData.lineNo}</p>
                        </div>
                        <div class="start-info-item">
                            <p class="item-label">Standard Cream Percentage</p>
                            <p class="item-value">${cycleData.standardCreamPercentage}</p>
                        </div>
                    </div>
                ` : ''}
            </div>
            <div class="tour-cyle-step tour-cyle-step-form tour-cyle-step-form-${cycleNum} bs-fade-elem" style="display: none;">
                <div class="tour-cycle-estimation-lists">
                    <div class="bs-card bs-card-toggler bs-card-light bs-card-sm tour-cycle-estimation-item">
                        <div class="form-group-title">
                            <h4 class="bs-card-title">Weight of Sandwich</h4>
                        </div>
                        <div class="estimation-grid" style="display: flex; justify-content: space-between;">
                            <div class="form-group" style="flex: 1;margin: 10px;">
                                <label class="form-label" for="wt-sandwich-1-${cycleNum}">Wt. of Sandwich-1</label>
                                <input type="text" class="form-control" id="wt-sandwich-1-${cycleNum}" placeholder="Enter value" />
                            </div>
                            <div class="form-group" style="flex: 1;margin: 10px;">
                                <label class="form-label" for="wt-sandwich-2-${cycleNum}">Wt. of Sandwich-2</label>
                                <input type="text" class="form-control" id="wt-sandwich-2-${cycleNum}" placeholder="Enter value"  />
                            </div>
                            <div class="form-group" style="flex: 1;margin: 10px;">
                                <label class="form-label" for="wt-sandwich-3-${cycleNum}">Wt. of Sandwich-3</label>
                                <input type="text" class="form-control" id="wt-sandwich-3-${cycleNum}" placeholder="Enter value" />
                            </div>
                            <div class="form-group" style="flex: 1;margin: 10px;">
                                <label class="form-label" for="wt-sandwich-4-${cycleNum}">Wt. of Sandwich-4</label>
                                <input type="text" class="form-control" id="wt-sandwich-4-${cycleNum}" placeholder="Enter value" />
                            </div>
                        </div>
                    </div>
                    <div class="bs-card bs-card-toggler bs-card-light bs-card-sm tour-cycle-estimation-item">
                        <div class="form-group-title">
                            <h4 class="bs-card-title">Weight of Shell</h4>
                        </div>
                        <div class="estimation-grid" style="display: flex; justify-content: space-between;">
                            <div class="form-group" style="flex: 1;margin: 10px;">
                                <label class="form-label" for="wt-shell-1-${cycleNum}">Wt. of Shell-1</label>
                                <input type="text" class="form-control" id="wt-shell-1-${cycleNum}" placeholder="Enter value" />
                            </div>
                            <div class="form-group" style="flex: 1;margin: 10px;">
                                <label class="form-label" for="wt-shell-2-${cycleNum}">Wt. of Shell-2</label>
                                <input type="text" class="form-control" id="wt-shell-2-${cycleNum}" placeholder="Enter value" />
                            </div>
                            <div class="form-group" style="flex: 1;margin: 10px;">
                                <label class="form-label" for="wt-shell-3-${cycleNum}">Wt. of Shell-3</label>
                                <input type="text" class="form-control" id="wt-shell-3-${cycleNum}" placeholder="Enter value" />
                            </div>
                            <div class="form-group" style="flex: 1;margin: 10px;">
                                <label class="form-label" for="wt-shell-4-${cycleNum}">Wt. of Shell-4</label>
                                <input type="text" class="form-control" id="wt-shell-4-${cycleNum}" placeholder="Enter value" />
                            </div>
                        </div>
                    </div>
                    <div class="bs-card bs-card-toggler bs-card-light bs-card-sm tour-cycle-estimation-item" style="display:none">
                        <div class="form-group-title">
                            <h4 class="bs-card-title">Actual Cream %</h4>
                        </div>
                        <div class="estimation-grid" style="display: flex; justify-content: space-between;">
                            <div class="form-group" style="flex: 1;margin: 10px;">
                                <label class="form-label" for="cream-percentage-1-${cycleNum}">Cream %-1</label>
                                <input type="text" class="form-control" id="cream-percentage-1-${cycleNum}" placeholder="Enter value" />
                            </div>
                            <div class="form-group" style="flex: 1;margin: 10px;">
                                <label class="form-label" for="cream-percentage-2-${cycleNum}">Cream %-2</label>
                                <input type="text" class="form-control" id="cream-percentage-2-${cycleNum}" placeholder="Enter value" />
                            </div>
                            <div class="form-group" style="flex: 1;margin: 10px;">
                                <label class="form-label" for="cream-percentage-3-${cycleNum}">Cream %-3</label>
                                <input type="text" class="form-control" id="cream-percentage-3-${cycleNum}" placeholder="Enter value" />
                            </div>
                            <div class="form-group" style="flex: 1;margin: 10px;">
                                <label class="form-label" for="cream-percentage-4-${cycleNum}">Cream %-4</label>
                                <input type="text" class="form-control" id="cream-percentage-4-${cycleNum}" placeholder="Enter value" />
                            </div>
                        </div>
                    </div>
                    <div class="bs-card bs-card-toggler bs-card-light bs-card-sm tour-cycle-estimation-item" style="display:none">
                        <div class="form-group-title">
                            <h4 class="bs-card-title">Average</h4>
                        </div>
                        <div class="estimation-grid" style="display: flex; justify-content: space-between;">
                            <div class="form-group" style="flex: 1;margin: 10px;">
                                <label class="form-label" for="avg-1-${cycleNum}">AVG</label>
                                <input type="text" class="form-control" id="avg-1-${cycleNum}" placeholder="Enter value" style="width: 100%; max-width: 330px;" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tour-cycle-estimation-footer">
                    <button  class="bs-btn bs-btn-outline-primary">Cancel</button>
                    <button type="button" class="bs-btn bs-btn-primary tour-cycle-save-session-btn tour-cycle-save-session-btn-${cycleNum}">Save Session</button>
                </div>
            </div>
            <div class="tour-cyle-step tour-cyle-step-completed tour-cyle-step-completed-${cycleNum} bs-fade-elem" style="display: ${isCompleted ? 'block' : 'none'};">
                <div class="tour-cyle-card-lists"></div>
            </div>
        </div>
    `;

    const parentElement = document.querySelector(".tour-cycle-card-panel-lists");
    if (parentElement) {
        parentElement.appendChild(newCycle);
        if (!isCompleted) {
            newCycle.classList.add("bs-card-toggler-is-active");
        } else if (cycleData) {
            const completedSection = newCycle.querySelector('.tour-cyle-step-completed');
            renderCompletedSection(completedSection, cycleData);
        }
    }
    $(`#productSelect-${cycleNum}`).select2({
        minimumResultsForSearch: -1,
        dropdownAutoWidth: true,
        width: '100%',
    });
}

function renderCompletedSection(completedSection, cycleData) {
    const container = completedSection.querySelector('.tour-cyle-card-lists');
    if (!container) {
        console.error("Summary container (.tour-cyle-card-lists) not found in completed section");
        return;
    }

    console.log("Rendering summary with cycleData:", cycleData);

    const wtSandwichRows = cycleData.wtSandwich.map((wt, index) => `
        <tr>
            <td style="color: black; font-weight: bold; text-align: center; padding: 8px; border: 1px solid #e0e0e0;">${wt || ''}</td>
            <td style="color: black; font-weight: bold; text-align: center; padding: 8px; border: 1px solid #e0e0e0;">${index < cycleData.wtShell.length ? (cycleData.wtShell[index] || '') : ''}</td>
            <td style="color: black; font-weight: bold; text-align: center; padding: 8px; border: 1px solid #e0e0e0;">${index < cycleData.creamPercentage.length ? (cycleData.creamPercentage[index] || '') : ''}</td>
            ${index === 0 ? `<td rowspan="${cycleData.wtSandwich.length}" style="color: black; font-weight: bold; text-align: center; padding: 8px; border: 1px solid #e0e0e0; vertical-align: middle;">${cycleData.average}</td>` : ''}
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="bs-card bs-card-light bs-card-sm card-opened" style="margin: 10px 0; border: 1px solid #e0e0e0;">
            <div class="bs-card-header" style="padding: 10px; background: #f8f9fa;">
                <h4 class="bs-card-title bs-font-color-error" style="margin: 0; color: #dc3545;">Summary</h4>
            </div>
            <div class="bs-card-body" style="padding: 0; overflow-x: auto;">
                <div class="bs-table-container" style="width: 100%;">
                    <table class="bs-table" style="border-collapse: collapse; width: 100%; min-width: 600px; text-align: center; margin: 0;">
                        <thead>
                            <tr>
                                <th style="text-align: center; padding: 8px; border: 1px solid #e0e0e0; background: #f8f9fa;">Wt. of Sandwich</th>
                                <th style="text-align: center; padding: 8px; border: 1px solid #e0e0e0; background: #f8f9fa;">Wt. of Shell</th>
                                <th style="text-align: center; padding: 8px; border: 1px solid #e0e0e0; background: #f8f9fa;">Actual Cream %</th>
                                <th style="text-align: center; padding: 8px; border: 1px solid #e0e0e0; background: #f8f9fa;">AVG</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${wtSandwichRows}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    console.log("Summary rendered, container innerHTML:", container.innerHTML);
}

async function collectEstimationDataCycleSave(cycleNum) {
    const startDataStr = localStorage.getItem(`cycle-${cycleNum}-start-data`);
    const startData = startDataStr ? JSON.parse(startDataStr) : {};
    const product = startData.product || "N/A";
    const machineNo = startData.machineNo || "N/A";
    const lineNo = startData.lineNo || "N/A";
    const executiveName = startData.executiveName || "N/A";
    const standardCreamPercentage = startData.standardCreamPercentage || "N/A";

    const wtSandwich = [
        document.getElementById(`wt-sandwich-1-${cycleNum}`).value,
        document.getElementById(`wt-sandwich-2-${cycleNum}`).value,
        document.getElementById(`wt-sandwich-3-${cycleNum}`).value,
        document.getElementById(`wt-sandwich-4-${cycleNum}`).value
    ].filter(Boolean).map(v => Number(v).toFixed(2).toString());
    const wtShell = [
        document.getElementById(`wt-shell-1-${cycleNum}`).value,
        document.getElementById(`wt-shell-2-${cycleNum}`).value,
        document.getElementById(`wt-shell-3-${cycleNum}`).value,
        document.getElementById(`wt-shell-4-${cycleNum}`).value
    ].filter(Boolean).map(v => Number(v).toFixed(2).toString());
    const creamPercentage = [
        document.getElementById(`cream-percentage-1-${cycleNum}`).value,
        document.getElementById(`cream-percentage-2-${cycleNum}`).value,
        document.getElementById(`cream-percentage-3-${cycleNum}`).value,
        document.getElementById(`cream-percentage-4-${cycleNum}`).value
    ].filter(Boolean).map(v => Number(v).toFixed(2).toString());

    const creamPercent1 = (wtSandwich[0] && wtShell[0])
        ? (((wtSandwich[0] - wtShell[0]) / wtSandwich[0]) * 100).toFixed(2).toString()
        : null;

    const creamPercent2 = (wtSandwich[1] && wtShell[1])
        ? (((wtSandwich[1] - wtShell[1]) / wtSandwich[1]) * 100).toFixed(2).toString()
        : null;

    const creamPercent3 = (wtSandwich[2] && wtShell[2])
        ? (((wtSandwich[2] - wtShell[2]) / wtSandwich[2]) * 100).toFixed(2).toString()
        : null;

    const creamPercent4 = (wtSandwich[3] && wtShell[3])
        ? (((wtSandwich[3] - wtShell[3]) / wtSandwich[3]) * 100).toFixed(2).toString()
        : null;

    const average = document.getElementById(`avg-1-${cycleNum}`).value;

    const creamValues = [creamPercent1, creamPercent2, creamPercent3, creamPercent4]
        .filter(val => val !== null)
        .map(val => parseFloat(val));

    const averageCream = creamValues.length
        ? (creamValues.reduce((acc, curr) => acc + curr, 0) / creamValues.length).toFixed(2).toString()
        : null;


    const data = {
        "cr3ea_qualitytourid": QualityTourId,
        "cr3ea_title": 'CreamPercentage_' + moment().format('MM-DD-YYYY'),
        "cr3ea_cycle": `Cycle-${cycleNum}`,
        "cr3ea_shift": sessionStorage.getItem("shiftValue") || "shift 1",
        "cr3ea_tourstartdate": moment().format('MM-DD-YYYY'),
        "cr3ea_observedby": UserName || null,
        "cr3ea_creampercent1": creamPercent1 || null,
        "cr3ea_creampercent2": creamPercent2 || null,
        "cr3ea_creampercent3": creamPercent3 || null,
        "cr3ea_creampercent4": creamPercent4 || null,
        "cr3ea_wtofsandwich1": wtSandwich[0] || null,
        "cr3ea_wtofsandwich2": wtSandwich[1] || null,
        "cr3ea_wtofsandwich3": wtSandwich[2] || null,
        "cr3ea_wtofsandwich4": wtSandwich[3] || null,
        "cr3ea_wtofshell1": wtShell[0] || null,
        "cr3ea_wtofshell2": wtShell[1] || null,
        "cr3ea_wtofshell3": wtShell[2] || null,
        "cr3ea_wtofshell4": wtShell[3] || null,
        "cr3ea_avg": averageCream || null,
        "cr3ea_productname": product,
        "cr3ea_stdcreampercent": standardCreamPercentage,
        "cr3ea_machineno": machineNo,
        "cr3ea_lineno": lineNo,
        "cr953_executivename": executiveName
    };

    await savesectionApicall([data]);
    localStorage.removeItem(`cycle-${cycleNum}-start-data`);

    return {
        cycleNum,
        wtSandwich,
        wtShell,
        creamPercentage,
        average,
        product,
        machineNo,
        lineNo,
        executiveName,
        standardCreamPercentage
    };
}

async function savesectionApicall(data) {
    try {
        const AccessToken = await getAccessToken();
        if (!AccessToken) throw new Error("Access token is invalid or missing");

        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
            "OData-MaxVersion": "4.0",
            "OData-Version": "4.0",
            "Prefer": "return=representation",
            "Authorization": `Bearer ${AccessToken}`
        };

        const apiVersion = "9.2";
        const tableName = "cr3ea_prod_creams";
        const apiUrl = `${environmentUrl}/api/data/v${apiVersion}/${tableName}`;

        for (const record of data) {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(record)
            });

            if (!response.ok) throw new Error(`Failed to save record: ${response.status} - ${await response.text()}`);
            console.log('Record saved:', await response.json());
        }

        showSuccessNotification(`${data.length} records saved successfully`, data);
    } catch (error) {
        console.error('Error saving records:', error);
        showErrorNotification('Failed to save records. Please try again.');
    }
}

// Utility Functions

function showSuccessNotification(message, result) {
    console.log(message);
    alert(message);
}

function showErrorNotification(message) {
    console.error(message);
    alert(message);
}

function initializeApplication() {
    document.querySelector('.tour-date').textContent = moment().format('DD/MM/YYYY');
}
//shift popup select 2 dropdown initialize
$(document).ready(function () {
    $(`#shiftSelect`).select2({
        minimumResultsForSearch: -1,
        dropdownAutoWidth: true,
        width: '100%',
    });
});