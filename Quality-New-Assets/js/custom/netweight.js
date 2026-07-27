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

    const product = document.getElementById(`productSelect\-${cycleNum}`).value;
    const executiveName = document.getElementById(`executive-name-${cycleNum}`).value;
    const batchNo = document.getElementById(`batch-no-${cycleNum}`).value;
    const package = document.getElementById(`packagedDate-${cycleNum}`).value;
    const expiry = document.getElementById(`expiryDate-${cycleNum}`).value;

    const startData = {
        product,
        executiveName,
        batchNo,
        package,
        expiry
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
                <p class="item-label">Batch No</p>
                <p class="item-value" id="machine-no-display-${cycleNum}">${batchNo}</p>
            </div>
            <div class="start-info-item">
                <p class="item-label">Packaged</p>
                <p class="item-value">${package}</p>
            </div>
            <div class="start-info-item">
                <p class="item-label">expiry</p>
                <p class="item-value">${expiry}</p>
            </div>
        </div>
    `;

    const startFormClone = startForm.cloneNode(true);
    startForm.remove();

    infoWrapper.style.display = "block";
    formSection.style.display = "block";
    formSection.classList.add("bs-fade-active", "bs-fade-in");
    infoWrapper.classList.add("bs-fade-active", "bs-fade-in");

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
        const tableName = "cr3ea_prod_netweights";
        const apiUrl = `${environmentUrl}/api/data/v${apiVersion}/${tableName}?$filter=cr3ea_qualitytourid eq '${QualityTourId}'&$select=cr3ea_cycle,cr3ea_mc1inspection1,cr3ea_mc1inspection2,cr3ea_mc1inspection3,cr3ea_mc1inspection4,cr3ea_mc1inspection5,cr3ea_mc1avg,cr3ea_mc2inspection1,cr3ea_mc2inspection2,cr3ea_mc2inspection3,cr3ea_mc2inspection4,cr3ea_mc2inspection5,cr3ea_mc2avg,cr3ea_mc3inspection1,cr3ea_mc3inspection2,cr3ea_mc3inspection3,cr3ea_mc3inspection4,cr3ea_mc3inspection5,cr3ea_mc3avg,cr3ea_mc4inspection1,cr3ea_mc4inspection2,cr3ea_mc4inspection3,cr3ea_mc4inspection4,cr3ea_mc4inspection5,cr3ea_productname,cr3ea_mc4avg,cr3ea_batchno,cr3ea_packeddate,cr3ea_expirydate,cr3ea_executivename`;

        const response = await fetch(apiUrl, { headers });
        if (!response.ok) throw new Error(`Failed to fetch data: ${response.status} - ${await response.text()}`);

        const data = await response.json();
        const cycles = {};

        data.value.forEach(record => {
            const cycleNum = record.cr3ea_cycle.replace('Cycle-', '');
            if (!cycles[cycleNum]) {
                cycles[cycleNum] = {
                    cycleNum,
                    mc1: [record.cr3ea_mc1inspection1, record.cr3ea_mc1inspection2, record.cr3ea_mc1inspection3, record.cr3ea_mc1inspection4,record.cr3ea_mc1inspection5].filter(Boolean),
                    mc2: [record.cr3ea_mc2inspection1, record.cr3ea_mc2inspection2, record.cr3ea_mc2inspection3, record.cr3ea_mc2inspection4,record.cr3ea_mc2inspection5].filter(Boolean),
                    mc3: [record.cr3ea_mc3inspection1, record.cr3ea_mc3inspection2, record.cr3ea_mc3inspection3, record.cr3ea_mc3inspection4,record.cr3ea_mc3inspection5].filter(Boolean),
                    mc4: [record.cr3ea_mc4inspection1, record.cr3ea_mc4inspection2, record.cr3ea_mc4inspection3, record.cr3ea_mc4inspection4,record.cr3ea_mc4inspection5].filter(Boolean),
                    product: record?.cr3ea_productname || "N/A",
                    executiveName: record?.cr3ea_executivename || "N/A",
                    batchNo:record?.cr3ea_batchno || "N/A",
                    packageDate:record?.cr3ea_packeddate || "N/A",
                    expiryDate:record?.cr3ea_expirydate || "N/A"
                };
                const storedData = localStorage.getItem(`cycle-${cycleNum}-start-data`);
                if (storedData) {
                    const { product } = JSON.parse(storedData);
                    cycles[cycleNum].product = product || "N/A";
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
                          <label class="form-label" for="Product">Product</label>
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
                          <label class="form-label" for="bs-secondary-executive-name-${cycleNum}">Executive Name</label>
                          <input type="text" class="form-control" id="executive-name-${cycleNum}" placeholder="" />
                        </div>
                        <div class="form-group">
                          <label class="form-label" for="bs-secondary-batch-no-${cycleNum}">Batch No</label>
                          <input type="text" class="form-control" id="batch-no-${cycleNum}" placeholder="" />
                        </div>
                        <div class="form-group datepicker-field">
                          <label class="form-label" for="packagedDate-${cycleNum}">Packaged</label>
                          <input type="text" class="form-control" id="packagedDate-${cycleNum}"
                            placeholder="" />
                        </div>
                        <div class="form-group datepicker-field">
                          <label class="form-label" for="expiryDate-${cycleNum}">Expiry</label>
                          <input type="text" class="form-control" id="expiryDate-${cycleNum}" placeholder="" />
                        </div>
                        <div class="form-footer">
                        <button type="button" id="bs-startSession-${cycleNum}" class="bs-btn bs-btn-primary">Start Session</button>
                    </div>
                      </div>
            </div>
            <div class="tour-cycle-info-wrapper tour-cycle-info-wrapper-${cycleNum} bs-fade-elem" style="display: ${isCompleted ? 'block' : 'none'};">
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
                            <p class="item-label">Standard Cream Percentage</p>
                            <p class="item-value">${cycleData.standardCreamPercentage}</p>
                        </div>
                    </div>
                ` : ''}
            </div>
            <div class="tour-cyle-step tour-cyle-step-form tour-cyle-step-form-${cycleNum} bs-fade-elem" style="display: none;">
                  <div class="tour-cycle-estimation-lists">
                        <div class="bs-card bs-card-toggler bs-card-light bs-card-sm tour-cycle-estimation-item">
                          <!-- <div class="bs-card" style="border: none;"> -->
                          <div class="form-group-title">
                            <h4 class="bs-card-title">M/C-1</h4>
                          </div>
                          <div class="estimation-grid" style="display: flex; justify-content: space-between;">
                            <!-- Left Title -->

                            <div class="form-group" style="flex: 1;padding:10px;">
                              <label class="form-label" for="mc1-inspection-1-${cycleNum}">M/C-1-Inspection-1</label>
                              <input type="text" class="form-control" id="mc1-inspection-1-${cycleNum}" placeholder="Enter value"
                                value="" style="width: 100%; max-width: 500px;" />
                            </div>
                            <div class="form-group" style="flex: 1;padding:10px;">
                              <label class="form-label" for="mc1-inspection-2-${cycleNum}">M/C-1-Inspection-2</label>
                              <input type="text" class="form-control" id="mc1-inspection-2-${cycleNum}" placeholder="Enter value"
                                value="" style="width: 100%; max-width: 500px;" />
                            </div>
                            <div class="form-group" style="flex: 1;padding:10px;">
                              <label class="form-label" for="mc1-inspection-3-${cycleNum}">M/C-1-Inspection-3</label>
                              <input type="text" class="form-control" id="mc1-inspection-3-${cycleNum}" placeholder="Enter value"
                                value="" style="width: 100%; max-width: 500px;" />
                            </div>
                            <div class="form-group" style="flex: 1;padding:10px;">
                              <label class="form-label" for="mc1-inspection-4-${cycleNum}">M/C-1-Inspection-4</label>
                              <input type="text" class="form-control" id="mc1-inspection-4-${cycleNum}" placeholder="Enter value"
                                value="" style="width: 100%; max-width: 500px;" />
                            </div>
                            <div class="form-group" style="flex: 1;padding:10px;">
                              <label class="form-label" for="mc1-inspection-5-${cycleNum}">M/C-1-Inspection-5</label>
                              <input type="text" class="form-control" id="mc1-inspection-5-${cycleNum}" placeholder="Enter value"
                                value="" style="width: 100%; max-width: 500px;" />
                            </div>
                          </div>
                          <!-- </div> -->
                        </div>

                        <div class="bs-card bs-card-toggler bs-card-light bs-card-sm tour-cycle-estimation-item">
                          <!-- <div class="bs-card" style="border: none;"> -->
                          <div class="form-group-title">
                            <h4 class="bs-card-title">M/C-2</h4>
                          </div>
                          <div class="estimation-grid" style="display: flex; justify-content: space-between;">
                            <!-- Left Title -->

                            <div class="form-group" style="flex: 1;padding:10px;">
                              <label class="form-label" for="mc2-inspection-1-${cycleNum}">M/C-2-Inspection-1</label>
                              <input type="text" class="form-control" id="mc2-inspection-1-${cycleNum}" placeholder="Enter value"
                                value="" style="width: 100%; max-width: 500px;" />
                            </div>
                            <div class="form-group" style="flex: 1;padding:10px;">
                              <label class="form-label" for="mc2-inspection-2-${cycleNum}">M/C-2-Inspection-2</label>
                              <input type="text" class="form-control" id="mc2-inspection-2-${cycleNum}" placeholder="Enter value"
                                value="" style="width: 100%; max-width: 500px;" />
                            </div>
                            <div class="form-group" style="flex: 1;padding:10px;">
                              <label class="form-label" for="mc2-inspection-3-${cycleNum}">M/C-2-Inspection-3</label>
                              <input type="text" class="form-control" id="mc2-inspection-3-${cycleNum}" placeholder="Enter value"
                                value="" style="width: 100%; max-width: 500px;" />
                            </div>
                            <div class="form-group" style="flex: 1;padding:10px;">
                              <label class="form-label" for="mc2-inspection-4-${cycleNum}">M/C-2-Inspection-4</label>
                              <input type="text" class="form-control" id="mc2-inspection-4-${cycleNum}" placeholder="Enter value"
                                value="" style="width: 100%; max-width: 500px;" />
                            </div>
                            <div class="form-group" style="flex: 1;padding:10px;">
                              <label class="form-label" for="mc2-inspection-5-${cycleNum}">M/C-2-Inspection-5</label>
                              <input type="text" class="form-control" id="mc2-inspection-5-${cycleNum}" placeholder="Enter value"
                                value="" style="width: 100%; max-width: 500px;" />
                            </div>
                          </div>
                          <!-- </div> -->
                        </div>

                        <div class="bs-card bs-card-toggler bs-card-light bs-card-sm tour-cycle-estimation-item">
                          <!-- <div class="bs-card" style="border: none;"> -->
                          <div class="form-group-title">
                            <h4 class="bs-card-title">M/C-3</h4>
                          </div>
                          <div class="estimation-grid" style="display: flex; justify-content: space-between;">
                            <!-- Left Title -->

                            <div class="form-group" style="flex: 1;padding:10px;">
                              <label class="form-label" for="mc3-inspection-1-${cycleNum}">M/C-3-Inspection-1</label>
                              <input type="text" class="form-control" id="mc3-inspection-1-${cycleNum}" placeholder="Enter value"
                                value="" style="width: 100%; max-width: 500px;" />
                            </div>
                            <div class="form-group" style="flex: 1;padding:10px;">
                              <label class="form-label" for="mc3-inspection-2-${cycleNum}">M/C-3-Inspection-2</label>
                              <input type="text" class="form-control" id="mc3-inspection-2-${cycleNum}" placeholder="Enter value"
                                value="" style="width: 100%; max-width: 500px;" />
                            </div>
                            <div class="form-group" style="flex: 1;padding:10px;">
                              <label class="form-label" for="mc3-inspection-3-${cycleNum}">M/C-3-Inspection-3</label>
                              <input type="text" class="form-control" id="mc3-inspection-3-${cycleNum}" placeholder="Enter value"
                                value="" style="width: 100%; max-width: 500px;" />
                            </div>
                            <div class="form-group" style="flex: 1;padding:10px;">
                              <label class="form-label" for="mc3-inspection-4-${cycleNum}">M/C-3-Inspection-4</label>
                              <input type="text" class="form-control" id="mc3-inspection-4-${cycleNum}" placeholder="Enter value"
                                value="" style="width: 100%; max-width: 500px;" />
                            </div>
                            <div class="form-group" style="flex: 1;padding:10px;">
                              <label class="form-label" for="mc3-inspection-5-${cycleNum}">M/C-3-Inspection-5</label>
                              <input type="text" class="form-control" id="mc3-inspection-5-${cycleNum}" placeholder="Enter value"
                                value="" style="width: 100%; max-width: 500px;" />
                            </div>
                          </div>
                          <!-- </div> -->
                        </div>

                        <div class="bs-card bs-card-toggler bs-card-light bs-card-sm tour-cycle-estimation-item">
                          <!-- <div class="bs-card" style="border: none;"> -->
                          <div class="form-group-title">
                            <h4 class="bs-card-title">M/C-4</h4>
                          </div>
                          <div class="estimation-grid" style="display: flex; justify-content: space-between;">
                            <!-- Left Title -->

                            <div class="form-group" style="flex: 1;padding:10px;">
                              <label class="form-label" for="mc4-inspection-1-${cycleNum}">M/C-4-Inspection-1</label>
                              <input type="text" class="form-control" id="mc4-inspection-1-${cycleNum}" placeholder="Enter value"
                                value="" style="width: 100%; max-width: 500px;" />
                            </div>
                            <div class="form-group" style="flex: 1;padding:10px;">
                              <label class="form-label" for="mc4-inspection-2-${cycleNum}">M/C-4-Inspection-2</label>
                              <input type="text" class="form-control" id="mc4-inspection-2-${cycleNum}" placeholder="Enter value"
                                value="" style="width: 100%; max-width: 500px;" />
                            </div>
                            <div class="form-group" style="flex: 1;padding:10px;">
                              <label class="form-label" for="mc4-inspection-3-${cycleNum}">M/C-4-Inspection-3</label>
                              <input type="text" class="form-control" id="mc4-inspection-3-${cycleNum}" placeholder="Enter value"
                                value="" style="width: 100%; max-width: 500px;" />
                            </div>
                            <div class="form-group" style="flex: 1;padding:10px;">
                              <label class="form-label" for="mc4-inspection-4-${cycleNum}">M/C-4-Inspection-4</label>
                              <input type="text" class="form-control" id="mc4-inspection-4-${cycleNum}" placeholder="Enter value"
                                value="" style="width: 100%; max-width: 500px;" />
                            </div>
                            <div class="form-group" style="flex: 1;padding:10px;">
                              <label class="form-label" for="mc4-inspection-5-${cycleNum}">M/C-4-Inspection-5</label>
                              <input type="text" class="form-control" id="mc4-inspection-5-${cycleNum}" placeholder="Enter value"
                                value="" style="width: 100%; max-width: 500px;" />
                            </div>
                          </div>
                          <!-- </div> -->
                        </div>

                      </div>
                <div class="tour-cycle-estimation-footer">
                    <button class="bs-btn bs-btn-outline-primary">Cancel</button>
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
    const data = [
        `packagedDate-${cycleNum}`,
        `expiryDate-${cycleNum}`

    ]
    initializeDatePickers(cycleNum);
}
function initializeDatePickers(cycleNum) {
  new tempusDominus.TempusDominus(document.getElementById(`packagedDate-${cycleNum}`), {
      localization: { locale: "en-GB" },
      display: {
        viewMode: "calendar",
        components: {
          decades: true,
          year: true,
          month: true,
          date: true,
          hours: false,
          minutes: false,
          seconds: false,
        },
      },
    });


        $(`packagedDate-${cycleNum}`).on("change.td", (e) => {
        let selectedDate = e.date;
        console.log(`${prefix}-1: `, selectedDate, moment(selectedDate).format("MM-DD-YYYY"));
      });
      new tempusDominus.TempusDominus(document.getElementById(`expiryDate-${cycleNum}`), {
      localization: { locale: "en-GB" },
      display: {
        viewMode: "calendar",
        components: {
          decades: true,
          year: true,
          month: true,
          date: true,
          hours: false,
          minutes: false,
          seconds: false,
        },
      },
    });


        $(`expiryDate-${cycleNum}`).on("change.td", (e) => {
        let selectedDate = e.date;
        console.log(`${prefix}-1: `, selectedDate, moment(selectedDate).format("MM-DD-YYYY"));
      });
}
function renderCompletedSection(completedSection, cycleData) {
    const container = completedSection.querySelector('.tour-cyle-card-lists');
    if (!container) {
        console.error("Summary container (.tour-cyle-card-lists) not found in completed section");
        return;
    }

    console.log("Rendering summary with cycleData:", cycleData);
    const sumMC1 = cycleData?.mc1?.reduce((total, val) => total + parseFloat(val || 0), 0);
    const avgMC1 = (sumMC1 / cycleData.mc1.length).toFixed(2);
    const sumMC2 = cycleData?.mc2?.reduce((total, val) => total + parseFloat(val || 0), 0);
    const avgMC2 = (sumMC2 / cycleData.mc2.length).toFixed(2);
    const sumMC3 = cycleData?.mc3?.reduce((total, val) => total + parseFloat(val || 0), 0);
    const avgMC3 = (sumMC3 / cycleData.mc3.length).toFixed(2);
    const sumMC4 = cycleData?.mc4?.reduce((total, val) => total + parseFloat(val || 0), 0);
    const avgMC4 = (sumMC4 / cycleData.mc4.length).toFixed(2);


    container.innerHTML = `
        <div class="tour-cyle-start-info" style="padding: 10px;">
            <div class="start-info-item">
                <p class="item-label" style="margin: 0; font-weight: bold;">Product</p>
                <p class="item-value" style="margin: 0;">${cycleData.product}</p>
            </div>
            <div class="start-info-item">
                <p class="item-label" style="margin: 0; font-weight: bold;">Executive Name</p>
                <p class="item-value" style="margin: 0;">${cycleData.executiveName}</p>
            </div>
            <div class="start-info-item">
                <p class="item-label" style="margin: 0; font-weight: bold;">Batch No</p>
                <p class="item-value" style="margin: 0;">${cycleData.batchNo}</p>
            </div>
            <div class="start-info-item">
                <p class="item-label" style="margin: 0; font-weight: bold;">Packaged</p>
                <p class="item-value" style="margin: 0;">${cycleData.packageDate}</p>
            </div>
            <div class="start-info-item">
                <p class="item-label" style="margin: 0; font-weight: bold;">Expiry</p>
                <p class="item-value" style="margin: 0;">${cycleData.expiryDate}</p>
            </div>
        </div>
        <div class="bs-card bs-card-light bs-card-sm card-opened">
                                <div class="bs-card-header">
                                    <h4 class="bs-card-title bs-font-color-error">Summary</h4>
                                </div>
                                <div class="bs-card-body">
                                    <div class="bs-table-container" style="
                                        max-width: 80vw;
                                        overflow-x: scroll;
                                        padding: 10px;
                                    ">
                                        <table class="bs-table" border="1" style="border-collapse: collapse; width: 100%; min-width: 900px; text-align: center;">
                                            <thead>
                                                <tr style="border: 1px solid #ebeef4;">
                                                    <th colspan="5" style="text-align: center; border: 1px solid #e0e0e0; border-right: none;">M/C-1</th>
                                                    <th rowspan="2" style="text-align: center; border: 1px solid #e0e0e0;">Avg.</th>
                                                    <th colspan="5" style="text-align: center; border: 1px solid #e0e0e0; border-right: none;"">M/C-2</th>
                                                    <th rowspan="2" style="text-align: center; border: 1px solid #e0e0e0;">Avg.</th>
                                                    <th colspan="5" style="text-align: center; border: 1px solid #e0e0e0; border-right: none;">M/C-3</th>
                                                    <th rowspan="2" style="text-align: center;border: 1px solid #e0e0e0;">Avg.</th>
                                                    <th colspan="5" style="text-align: center; border: 1px solid #e0e0e0; border-right: none;">M/C-4</th>
                                                    <th rowspan="2" style="text-align: center; border: 1px solid #e0e0e0;">Avg.</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr style="border: 1px solid #ebeef4;">
                                                    <!-- M/C-1 Data -->
                                                     ${cycleData?.mc1?.map((value) => `<td style="color: black;">${value}</td>`).join('')}
                                                     <td style="color: black;">${avgMC1}</td>
                                                    
                                                    <!-- M/C-2 Data -->
                                                     ${cycleData?.mc2?.map((value) => `<td style="color: black;">${value}</td>`).join('')}
                                                     <td style="color: black;">${avgMC2}</td>
                                                    <!-- M/C-3 Data -->
                                                     ${cycleData?.mc3?.map((value) => `<td style="color: black;">${value}</td>`).join('')}
                                                     <td style="color: black;">${avgMC3}</td>
                                                    <!-- M/C-4 Data -->
                                                     ${cycleData?.mc4?.map((value) => `<td style="color: black;">${value}</td>`).join('')}
                                                     <td style="color: black;">${avgMC4}</td>
                                                </tr>
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
    const executiveName = startData.executiveName || "N/A";
    const batchNo = startData.batchNo || "N/A";
    const package = startData.package || "N/A";
    const expiry = startData.expiry || "N/A";

    const mc1 = [
        document.getElementById(`mc1-inspection-1-${cycleNum}`).value,
        document.getElementById(`mc1-inspection-2-${cycleNum}`).value,
        document.getElementById(`mc1-inspection-3-${cycleNum}`).value,
        document.getElementById(`mc1-inspection-4-${cycleNum}`).value,
        document.getElementById(`mc1-inspection-5-${cycleNum}`).value
    ].filter(Boolean);
    const mc2 = [
        document.getElementById(`mc2-inspection-1-${cycleNum}`).value,
        document.getElementById(`mc2-inspection-2-${cycleNum}`).value,
        document.getElementById(`mc2-inspection-3-${cycleNum}`).value,
        document.getElementById(`mc2-inspection-4-${cycleNum}`).value,
        document.getElementById(`mc2-inspection-5-${cycleNum}`).value
    ].filter(Boolean);
    const mc3 = [
        document.getElementById(`mc3-inspection-1-${cycleNum}`).value,
        document.getElementById(`mc3-inspection-2-${cycleNum}`).value,
        document.getElementById(`mc3-inspection-3-${cycleNum}`).value,
        document.getElementById(`mc3-inspection-4-${cycleNum}`).value,
        document.getElementById(`mc3-inspection-5-${cycleNum}`).value
    ].filter(Boolean);
        const mc4 = [
        document.getElementById(`mc4-inspection-1-${cycleNum}`).value,
        document.getElementById(`mc4-inspection-2-${cycleNum}`).value,
        document.getElementById(`mc4-inspection-3-${cycleNum}`).value,
        document.getElementById(`mc4-inspection-4-${cycleNum}`).value,
        document.getElementById(`mc4-inspection-5-${cycleNum}`).value
    ].filter(Boolean);

    const data = {
        "cr3ea_title": 'NetWeights_' + moment().format('MM-DD-YYYY'),
        "cr3ea_cycle": `Cycle-${cycleNum}`,
        "cr3ea_shift": sessionStorage.getItem("shiftValue") || "shift 1",
        "cr3ea_tourstartdate": moment().format('MM-DD-YYYY'),
        "cr3ea_observedby": UserName || null,
        "cr3ea_productname": product,
        "cr3ea_executivename": executiveName,
        "cr3ea_batchno": batchNo,
        "cr3ea_expirydate": expiry,
        "cr3ea_packeddate": package,
        "cr3ea_qualitytourid": QualityTourId,
        "cr3ea_mc1inspection1": mc1[0],
        "cr3ea_mc1inspection2": mc1[1],
        "cr3ea_mc1inspection3": mc1[2],
        "cr3ea_mc1inspection4": mc1[3],
        "cr3ea_mc1inspection5": mc1[4],
        "cr3ea_mc1avg": mc1[5],
        "cr3ea_mc2inspection1": mc2[0],
        "cr3ea_mc2inspection2": mc2[1],
        "cr3ea_mc2inspection3": mc2[2],
        "cr3ea_mc2inspection4": mc2[3],
        "cr3ea_mc2inspection5": mc2[4],
        "cr3ea_mc2avg": mc2[5],
        "cr3ea_mc3inspection1": mc3[0],
        "cr3ea_mc3inspection2": mc3[1],
        "cr3ea_mc3inspection3": mc3[2],
        "cr3ea_mc3inspection4": mc3[3],
        "cr3ea_mc3inspection5": mc3[4],
        "cr3ea_mc3avg": mc3[5],
        "cr3ea_mc4inspection1": mc4[0],
        "cr3ea_mc4inspection2": mc4[1],
        "cr3ea_mc4inspection3": mc4[2],
        "cr3ea_mc4inspection4": mc4[3],
        "cr3ea_mc4inspection5": mc4[4],
        "cr3ea_mc4avg": mc4[5]
    };

    await savesectionApicall([data]);
    localStorage.removeItem(`cycle-${cycleNum}-start-data`);

    return {
        cycleNum,
        mc1,
        mc2,
        mc3,
        mc4,
        product,
        batchNo,
        executiveName,
        package,
        expiry
    };
}

async function savesectionApicall(data) {
    try {
         // Disable all buttons while API is running
        const buttons = document.querySelectorAll("button");
        buttons.forEach(button => button.disabled = true);
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
        const tableName = "cr3ea_prod_netweights";
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
        // Enable all buttons while API is running
        buttons.forEach(button => button.disabled = false);
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
    document.querySelector('.tour-date').textContent =  moment().format('DD/MM/YYYY');
}
//shift popup select 2 dropdown initialize
$(document).ready(function () {
  $(`#shiftSelect`).select2({
    minimumResultsForSearch: -1,
    dropdownAutoWidth: true,
    width: '100%',
  });
});
