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
    let thecurrenttime = moment().format("hh:mm:ss A");
    const product = document.getElementById(`productSelect-${cycleNum}`).value;
    const executiveName = document.getElementById(`executive-name-${cycleNum}`).value;

    const startData = {
        product,
        thecurrenttime,
        executiveName
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
                <p class="item-value" id="executiveName-${cycleNum}">${executiveName}</p>
            </div>
             <div class="start-info-item">
                <p class="item-label">Time</p>
                <p class="item-value" id="Time-${cycleNum}">${thecurrenttime}</p>
            </div>
            
        </div>
    `;

    const startFormClone = startForm.cloneNode(true);
    startForm.remove();

    infoWrapper.style.display = "block";
    formSection.style.display = "block";
    infoWrapper.classList.add("bs-fade-active", "bs-fade-in");
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
        const tableName = "cr3ea_prod_vlts";
        const apiUrl = `${environmentUrl}/api/data/v${apiVersion}/${tableName}?$filter=cr3ea_qualitytourid eq '${QualityTourId}'&$select=cr3ea_cycle,cr3ea_observedtime,cr3ea_productname,cr3ea_machineno,cr3ea_sampleqty,cr3ea_leakageno,cr3ea_leakagetype,cr3ea_executivename`;

        const response = await fetch(apiUrl, { headers });
        if (!response.ok) throw new Error(`Failed to fetch data: ${response.status} - ${await response.text()}`);

        const data = await response.json();
        const cycles = {};

        data.value.forEach(record => {
            const cycleNum = record.cr3ea_cycle.replace('Cycle-', '');
            if (!cycles[cycleNum]) {
                cycles[cycleNum] = {
                    cycleNum,
                    observedtime: record.cr3ea_observedtime || "N/A",
                    product: record?.cr3ea_productname || "N/A",
                    executiveName: record?.cr3ea_executivename || "N/A",
                    machineNo: record?.cr3ea_machineno || "N/A",
                    sampleqty:record?.cr3ea_sampleqty || "N/A",
                    leakageno:record?.cr3ea_leakageno || "N/A",
                    leakagetype:record?.cr3ea_leakagetype || "N/A",
                    standardCreamPercentage: record?.cr3ea_stdcreampercent || "N/A"
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
    const startDataStr = localStorage.getItem(`cycle-${cycleNum}-start-data`);
    const startData = startDataStr ? JSON.parse(startDataStr) : {};
    const product = startData.product || "N/A";
    const thecurrenttime = startData.thecurrenttime || "N/A";

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
                <form class="tour-cyle-info-form">
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
                    <div class="form-footer">
                        <button type="button" id="bs-startSession-${cycleNum}" class="bs-btn bs-btn-primary">Start Session</button>
                    </div>
                </form>
            </div>
            <div class="tour-cycle-info-wrapper tour-cycle-info-wrapper-${cycleNum} bs-fade-elem" style="display: ${isCompleted ? 'block' : 'none'};">
                <div class="tour-cyle-start-info">
                        <div class="start-info-item">
                            <p class="item-label">Product</p>
                            <p class="item-value" id="product-${cycleNum}">${product}</p>
                        </div>
                        <div class="start-info-item">
                            <p class="item-label">Time</p>
                            <p class="item-value" id="Time-${cycleNum}">${thecurrenttime}</p>
                        </div>
                    </div>
            </div>
            <div class="tour-cyle-step tour-cyle-step-form tour-cyle-step-form-${cycleNum} bs-fade-elem" style="display: none;">
               <div class="tour-cycle-estimation-lists">
                            <div class="bs-card bs-card-toggler bs-card-light bs-card-sm tour-cycle-estimation-item">
                                <!-- <div class="bs-card" style="border: none;"> -->
                                    <div class="estimation-grid" style="display: flex; justify-content: space-between;">
                                      <!-- Left Title -->
                                      
                                      <div class="form-group" style="flex: 1;padding:10px;">
                                        <label class="form-label" for="machine-no-${cycleNum}">Machine No.</label>
                                        <input type="text" class="form-control" id="machine-no-${cycleNum}" placeholder="Enter value" value="" style="width: 100%; max-width: 500px;"/>
                                      </div>
                                      <div class="form-group" style="flex: 1;padding:10px;">
                                        <label class="form-label" for="sample-quantity-${cycleNum}">Sample Quantity</label>
                                        <input type="text" class="form-control" id="sample-quantity-${cycleNum}" placeholder="Enter value" value="" style="width: 100%; max-width: 500px;"/>
                                      </div>
                                      <div class="form-group" style="flex: 1;padding:10px;">
                                        <label class="form-label" for="leakage-${cycleNum}">No. of leakage</label>
                                        <input type="text" class="form-control" id="leakage-${cycleNum}" placeholder="Enter value" value="" style="width: 100%; max-width: 500px;"/>
                                      </div>
                                      <div class="form-group" style="flex: 1;padding:10px;">
                                        <label class="form-label" for="leakage-type-${cycleNum}">Type of leakage</label>
                                        <input type="text" class="form-control" id="leakage-type-${cycleNum}" placeholder="Enter value" value="" style="width: 100%; max-width: 500px;"/>
                                      </div>
                                    </div>
                                  <!-- </div> -->
                            </div>

                      </div>
                <div class="tour-cycle-estimation-footer">
                    <button type="button" class="bs-btn bs-btn-outline-primary">Cancel</button>
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

    container.innerHTML = `
        <div class="tour-cyle-start-info" style="padding: 10px;">
            <div class="start-info-item">
                <p class="item-label" style="margin: 0; font-weight: bold;">Product</p>
                <p class="item-value" style="margin: 0;">${cycleData.product}</p>
            </div>
            <div class="start-info-item">
                <p class="item-label" style="margin: 0; font-weight: bold;">Time</p>
                <p class="item-value" style="margin: 0;">${cycleData.observedtime}</p>
            </div>
            <div class="start-info-item">
                <p class="item-label" style="margin: 0; font-weight: bold;">Executive Name</p>
                <p class="item-value" style="margin: 0;">${cycleData.executiveName}</p>
            </div>
        </div>
         <div class="bs-card bs-card-light bs-card-sm card-opened">
                          <div class="bs-card-header">
                            <h4 class="bs-card-title bs-font-color-error">Summary</h4>
                          </div>
                          <div class="bs-card-body" style="overflow-x: auto;">
                            <div class="bs-table-container">
                              <table class="bs-table"
                                style="border: 1px solid #ebeef4;border-collapse: collapse; width: 100%; min-width: 600px; text-align: center;">
                                <thead>
                                  <tr>
                                    <th style="text-align: center; border: 1px solid #e0e0e0;">M/C No.</th>
                                    <th style="text-align: center; border: 1px solid #e0e0e0;">Sample Qty</th>
                                    <th style="text-align: center; border: 1px solid #e0e0e0;">No. of Leakage</th>
                                    <th style="text-align: center; border: 1px solid #e0e0e0;">Type of Leakage</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td style="border: 1px solid #e0e0e0;color: black; font-weight: bold; text-align: center;">${cycleData.machineNo}</td>
                                    <td style="border: 1px solid #e0e0e0;color: black; font-weight: bold; text-align: center;">${cycleData.sampleqty}</td>
                                    <td style="border: 1px solid #e0e0e0;color: black; font-weight: bold; text-align: center;">${cycleData.leakageno}</td>
                                    <td style="border: 1px solid #e0e0e0;color: black; font-weight: bold; text-align: center;">${cycleData.leakagetype}</td>
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
    const thecurrenttime = startData.thecurrenttime || "N/A";

    const machinenumber=document.getElementById(`machine-no-${cycleNum}`).value;
    const sampleqty=document.getElementById(`sample-quantity-${cycleNum}`).value;
    const leakageno=document.getElementById(`leakage-${cycleNum}`).value;
    const leakagetype=document.getElementById(`leakage-type-${cycleNum}`).value;

    const data = {
        "cr3ea_qualitytourid": QualityTourId,
        "cr3ea_title": 'CreamPercentage_' + moment().format('MM-DD-YYYY'),
        "cr3ea_cycle": `Cycle-${cycleNum}`,
        "cr3ea_shift": sessionStorage.getItem("shiftValue") || "shift 1",
        "cr3ea_tourstartdate": moment().format('MM-DD-YYYY'),
        "cr3ea_observedtime": thecurrenttime,
        "cr3ea_observedby": UserName || null,
        "cr3ea_productname": product,
        "cr3ea_machineno": machinenumber,
        "cr3ea_sampleqty": sampleqty,
        "cr3ea_leakageno": leakageno,
        "cr3ea_leakagetype": leakagetype,
        "cr3ea_executivename": executiveName
    };

    await savesectionApicall([data]);
    localStorage.removeItem(`cycle-${cycleNum}-start-data`);

    return {
        cycleNum,
        machinenumber,
        sampleqty,
        leakageno,
        leakagetype,
        product,
        executiveName,
        observedtime
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
        const tableName = "cr3ea_prod_vlts";
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
        reloadFetchCycleData();
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