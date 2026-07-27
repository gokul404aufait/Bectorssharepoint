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
    reloadFetchCycleData();
    initializeApplication();

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

    // Toggle active state
    currentPanel.classList.toggle('bs-card-toggler-is-active');
    const isActive = currentPanel.classList.contains('bs-card-toggler-is-active');
    console.log("Toggle state (isActive):", isActive);

    // Apply styles based on whether it's completed or not
    if (isActive) {
        console.log("Entering expand block");
        if (isCompleted) {
            // For completed cycles, ensure full visibility with min-height fallback
            currentPanelBody.style.cssText = "max-height: none !important; height: auto !important; min-height: 200px !important; overflow: visible !important; display: block !important;";
        } else {
            // For active cycles, use scrollHeight for dynamic expansion
            currentPanelBody.style.cssText = "max-height: none !important; height: auto !important; overflow: visible !important; display: block !important;";
            void currentPanelBody.offsetHeight; // Force reflow
            if (currentPanelBody.scrollHeight > 0) {
                currentPanelBody.style.maxHeight = `${currentPanelBody.scrollHeight}px !important`;
                setTimeout(() => {
                    currentPanelBody.style.maxHeight = "none !important";
                }, 300);
            }
        }
    } else {
        console.log("Entering collapse block");
        currentPanelBody.style.cssText = "max-height: 0px !important; height: 0px !important; overflow: hidden !important; display: block !important;";
    }
    console.log("Panel body styles applied:", {
        maxHeight: currentPanelBody.style.maxHeight,
        height: currentPanelBody.style.height,
        minHeight: currentPanelBody.style.minHeight,
        overflow: currentPanelBody.style.overflow,
        display: currentPanelBody.style.display
    });

    const computedStyles = window.getComputedStyle(currentPanelBody);
    console.log("Computed styles after toggle:", {
        maxHeight: computedStyles.maxHeight,
        height: computedStyles.height,
        minHeight: computedStyles.minHeight,
        overflow: computedStyles.overflow,
        display: computedStyles.display
    });

    // Handle section visibility based on cycle state
    const startSection = currentPanel.querySelector('.tour-cyle-step-start');
    const infoWrapper = currentPanel.querySelector('.tour-cycle-info-wrapper');
    const form = currentPanel.querySelector('.tour-cyle-step-form');
    const completedSection = currentPanel.querySelector('.tour-cyle-step-completed');

    if (isCompleted) {
        // For completed cycles, only show completed section and info wrapper when expanded
        if (completedSection) {
            completedSection.style.display = isActive ? "block" : "none";
            console.log("Completed section toggled:", completedSection.style.display);
            if (isActive) {
                const summaryContainer = completedSection.querySelector('.tour-cyle-card-lists');
                console.log("Summary container exists:", !!summaryContainer);
                console.log("Summary container innerHTML:", summaryContainer ? summaryContainer.innerHTML : "Not found");
            }
        }
        if (infoWrapper) {
            infoWrapper.style.display = isActive ? "block" : "none";
            console.log("Info wrapper toggled (completed):", infoWrapper.style.display);
        }
        if (startSection) startSection.style.display = "none";
        if (form) form.style.display = "none";
    } else {
        // For active cycles, show start/form sections as needed
        if (startSection) {
            startSection.style.display = isActive ? "block" : "none";
            console.log("Start section toggled:", startSection.style.display);
        }
        if (infoWrapper) {
            infoWrapper.style.display = isActive ? "block" : "none";
            console.log("Info wrapper toggled (active):", infoWrapper.style.display);
        }
        if (form) {
            form.style.display = isActive ? "block" : "none";
            console.log("Form section toggled:", form.style.display);
        }
        if (completedSection) {
            completedSection.style.display = "none"; // Hide completed section for active cycles
            console.log("Completed section hidden for active cycle");
        }
    }
}

async function startSessionHandler(event) {
    const btn = event.target.closest('.tour-cyle-info-form .bs-btn-primary');
    if (btn && btn.textContent === "Start Session") {
        event.preventDefault();
        console.log("Start Session button clicked");

        const cyclePanel = btn.closest('.tour-cycle-panel');
        if (!cyclePanel) {
            console.error("Cycle panel not found");
            return;
        }

        const cycleNum = cyclePanel.querySelector('.bs-card-title').textContent.split(' ')[1];
        console.log("Cycle number:", cycleNum);

        const startForm = cyclePanel.querySelector('.tour-cyle-step-start');
        const infoWrapper = cyclePanel.querySelector('.tour-cycle-info-wrapper');
        const formSection = cyclePanel.querySelector('.tour-cyle-step-form');

        if (!startForm || !infoWrapper || !formSection) {
            console.error("Required elements not found:", { startForm, infoWrapper, formSection });
            return;
        }

        const product = startForm.querySelector(`#productSelect-${cycleNum}`).value;
        const executiveName = startForm.querySelector('#executive-name').value;
        const batchNo = startForm.querySelector('#batch-no').value;
        const location = startForm.querySelector('#location-no')?.value || "N/A";
        const category = startForm.querySelector(`#categorySelect-${cycleNum}`).value;

        const startData = {
            product,
            batchNo,
            location,
            category,
            executiveName
        };
        localStorage.setItem(`cycle-${cycleNum}-start-data`, JSON.stringify(startData));
        console.log("Start data saved to localStorage:", startData);

        infoWrapper.querySelector('.tour-cyle-start-info').innerHTML = `
            <div class="start-info-item">
                <p class="item-label">Product</p>
                <p class="item-value">${product}</p>
            </div>
            <div class="start-info-item">
                <p class="item-label">Executive Name</p>
                <p class="item-value">${executiveName}</p>
            </div>
            <div class="start-info-item">
                <p class="item-label">Batch Code</p>
                <p class="item-value">${batchNo}</p>
            </div>
            <div class="start-info-item">
                <p class="item-label">Location & Frequency</p>
                <p class="item-value">${location}</p>
            </div>
            <div class="start-info-item">
                <p class="item-label">Category</p>
                <p class="item-value">${category}</p>
            </div>
        `;

        const startFormClone = startForm.cloneNode(true);
        startForm.remove();

        infoWrapper.style.display = "block";
        formSection.style.display = "block";
        formSection.classList.add("bs-fade-active", "bs-fade-in");

        console.log("Start form removed from DOM");
        console.log("Info wrapper display style:", infoWrapper.style.display);
        console.log("Form section display style:", formSection.style.display);

        const cancelBtn = formSection.querySelector('.bs-btn-outline-primary');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function restoreStartForm(e) {
                e.preventDefault();
                window.location.reload()
                formSection.style.display = "none";
                infoWrapper.style.display = "none";
                cyclePanel.querySelector('.bs-card-body').insertBefore(startFormClone, infoWrapper);
                console.log("Start form restored on cancel");
            }, { once: true });
        }
    }
}

async function saveSessionHandler(event) {
    const btn = event.target.closest('.tour-cycle-save-session-btn');
    if (btn) {
        const cyclePanel = btn.closest('.tour-cycle-panel');
        const cycleNum = cyclePanel.querySelector('.bs-card-title').textContent.split(' ')[1];
        console.log(`Saving Cycle ${cycleNum}`);
        await saveSectionButtonClick(cyclePanel, cycleNum);
    }
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
        const tableName = "cr3ea_prod_oprpandcpps";
        const apiUrl = `${environmentUrl}/api/data/v${apiVersion}/${tableName}?$filter=cr3ea_qualitytourid eq '${QualityTourId}'&$select=cr3ea_cycle,cr3ea_productname,cr3ea_batchno,cr3ea_location,cr3ea_category,cr3ea_fecentrepass1,cr3ea_fecentrepass2,cr3ea_nfecentrepass1,cr3ea_nfecentrepass2,cr3ea_sscentrepass1,cr3ea_sscentrepass2,cr3ea_mdsensitivity,cr953_executivename`;

        const response = await fetch(apiUrl, { headers });
        if (!response.ok) throw new Error(`Failed to fetch data: ${response.status} - ${await response.text()}`);

        const data = await response.json();
        const cycles = {};

        data.value.forEach(record => {
            const cycleNum = record.cr3ea_cycle.replace('Cycle-', '');
            if (!cycles[cycleNum]) {
                cycles[cycleNum] = {
                    cycleNum,
                    product: record.cr3ea_productname,
                    executiveName: record.cr953_executivename,
                    batchNo: record.cr3ea_batchno,
                    location: record.cr3ea_location,
                    category: record.cr3ea_category,
                    fecentrepass1: record.cr3ea_fecentrepass1 || "OK",
                    fecentrepass2: record.cr3ea_fecentrepass2 || "OK",
                    nfecentrepass1: record.cr3ea_nfecentrepass1 || "OK",
                    nfecentrepass2: record.cr3ea_nfecentrepass2 || "OK",
                    sscentrepass1: record.cr3ea_sscentrepass1 || "OK",
                    sscentrepass2: record.cr3ea_sscentrepass2 || "OK",
                    md: record.cr3ea_mdsensitivity || "OK"
                };
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
    const estimationLists = stepForm.querySelector('.tour-cycle-estimation-lists');
    const stepCompleted = cyclePanel.querySelector('.tour-cyle-step-completed');
    const infoWrapper = cyclePanel.querySelector('.tour-cycle-info-wrapper');

    const cycleData = await collectEstimationDataCycleSave(cycleNum);
    console.log("Cycle data before rendering:", cycleData);
    renderCompletedSection(stepCompleted, cycleData);

    stepForm.classList.remove("bs-fade-active", "bs-fade-in");
    stepForm.style.display = "none";
    estimationLists.style.display = "none";
    stepCompleted.style.display = "block";
    stepCompleted.classList.add("bs-fade-active", "bs-fade-in");

    // Mark this cycle as completed
    cyclePanel.classList.add('completed-cycle');
    cyclePanel.classList.remove('bs-card-toggler-is-active'); // Collapse by default after saving
    const panelBody = cyclePanel.querySelector('.bs-card-body');
    panelBody.style.cssText = "max-height: 0px !important; height: 0px !important; overflow: hidden !important; display: block !important;";

    const nextCycleNum = parseInt(cycleNum) + 1;
    if (!document.querySelector(`#cycle-${nextCycleNum}`)) {
        createCycleSection(nextCycleNum, false);
        cycleCounter = nextCycleNum + 1;
    }

    // Collapse all panels except the next cycle
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

    // Open the next cycle
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

function defectCycleDynamic(cycleNum) {
    const container = document.querySelector(`#dynamic-section-${cycleNum}`);
    if (!container) {
        console.error(`Dynamic section container #dynamic-section-${cycleNum} not found`);
        return;
    }

    console.log(`Starting to generate dynamic content for cycle ${cycleNum}`);
    container.innerHTML = '';

    const groups = [
        { title: "FE", items: ["Centre 1st Pass", "Centre 2nd Pass"], keys: ["fecentrepass1", "fecentrepass2"] },
        { title: "NFE", items: ["Centre 1st Pass", "Centre 2nd Pass"], keys: ["nfecentrepass1", "nfecentrepass2"] },
        { title: "SS", items: ["Centre 1st Pass", "Centre 2nd Pass"], keys: ["sscentrepass1", "sscentrepass2"] }
    ];

    groups.forEach(group => {
        const groupHTML = `
            <div class="card-border bs-card-light bs-card">
                <div class="form-group-title">
                    <h4 class="bs-card-title">${group.title}</h4>
                </div>
                ${group.items.map((item, index) => `
                    <div class="bs-card bs-card-toggler bs-card-light bs-card-sm tour-cycle-estimation-item" id="pr-${cycleNum}-${group.title}-${index + 1}" style="margin-top:10px;">
                        <div class="bs-card-header">
                            <h4 class="bs-card-title">${item}</h4>
                            <div class="tour-cycle-estimation-actions">
                                <span class="badge badge-lg badge-error cycle-estimation-action-elem" data-status="not-okay">Not Okay</span>
                                <span class="badge badge-lg badge-success cycle-estimation-action-elem" data-status="okay">Okay</span>
                            </div>
                        </div>
                        <div class="bs-card-body" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
                            <div class="estimation-not-okay-wrapper">
                                <div class="form-group">
                                    <label class="form-label" for="not-okay-remarks-${cycleNum}-${group.keys[index]}">Major Defects and Remarks</label>
                                    <input type="text" class="form-control" id="not-okay-remarks-${cycleNum}-${group.keys[index]}" placeholder="Type Here..." />
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        container.insertAdjacentHTML("beforeend", groupHTML);
    });

    const mdHTML = `
        <div class="bs-card bs-card-toggler bs-card-light bs-card-sm tour-cycle-estimation-item" id="pr-${cycleNum}-md">
            <div class="bs-card-header">
                <h4 class="bs-card-title">M.D. Sensitivity & Rejection in Time</h4>
                <div class="tour-cycle-estimation-actions">
                    <span class="badge badge-lg badge-error cycle-estimation-action-elem" data-status="not-okay">Not Okay</span>
                    <span class="badge badge-lg badge-success cycle-estimation-action-elem" data-status="okay">Okay</span>
                </div>
            </div>
            <div class="bs-card-body" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
                <div class="estimation-not-okay-wrapper">
                    <div class="form-group">
                        <label class="form-label" for="not-okay-remarks-${cycleNum}-mdsensitivity">Major Defects and Remarks</label>
                        <input type="text" class="form-control" id="not-okay-remarks-${cycleNum}-mdsensitivity" placeholder="Type Here..." />
                    </div>
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML("beforeend", mdHTML);

    console.log(`Dynamic content generated for cycle ${cycleNum}`);

    container.addEventListener("click", function (event) {
        console.log("Badge click event triggered");
        const selectedBadge = event.target.closest(".cycle-estimation-action-elem");
        if (!selectedBadge) return;

        const card = selectedBadge.closest(".bs-card");
        if (!card) return;

        const cardBody = card.querySelector(".bs-card-body");
        const notOkayBadge = card.querySelector('[data-status="not-okay"]');
        const okayBadge = card.querySelector('[data-status="okay"]');

        if (selectedBadge.dataset.status === "not-okay") {
            card.classList.add("bs-card-toggler-is-active");
            cardBody.style.maxHeight = "100px";
            notOkayBadge.classList.add("badge-fill");
            okayBadge.classList.remove("badge-fill");
            console.log("Set to Not Okay");
        } else {
            card.classList.remove("bs-card-toggler-is-active");
            cardBody.style.maxHeight = "0";
            okayBadge.classList.add("badge-fill");
            notOkayBadge.classList.remove("badge-fill");
            console.log("Set to Okay");
        }
    });
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
            infoWrapper.style.display = "block";
            stepForm.style.display = "none";
            completedSection.style.display = "block";
            existingCycle.classList.add('completed-cycle');
            existingCycle.classList.remove('bs-card-toggler-is-active');
            const panelBody = existingCycle.querySelector('.bs-card-body');
            panelBody.style.cssText = "max-height: 0px !important; height: 0px !important; overflow: hidden !important; display: block !important;";
        }
        return;
    }

    const newCycle = document.createElement("div");
    newCycle.classList.add("bs-card-toggler", "bs-card", "bs-card-secondary", "tour-cycle-panel");
    if (isCompleted) newCycle.classList.add("completed-cycle");
    newCycle.setAttribute("id", `cycle-${cycleNum}`);

    const formVisibility = isCompleted ? '' : 'bs-fade-active bs-fade-in';
    const initialMaxHeight = isCompleted ? 'max-height: 0;' : 'max-height: none; height: auto; overflow: visible;';

    newCycle.innerHTML = `
        <div class="bs-card-header">
            <h4 class="bs-card-title">Cycle ${cycleNum}</h4>
            <button type="button" class="bs-btn icon-btn bs-card-toggler-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3.66667 5.66666L8.33333 10.3333L13 5.66666" stroke="#0C0D10" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>
        </div>
        <div class="bs-card-body" style="${initialMaxHeight}">
            <div class="tour-cyle-step tour-cyle-step-start bs-fade-elem ${formVisibility}" style="display: ${isCompleted ? 'none' : 'block'};">
                <form class="tour-cyle-info-form">
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
                        <label class="form-label" for="executive-name">Executive Name</label>
                        <input type="text" class="form-control" id="executive-name" placeholder="" />
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="batch-no">Batch No</label>
                        <input type="text" class="form-control" id="batch-no" placeholder="" />
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="location-no">Location & Frequency</label>
                        <input type="text" class="form-control" id="location-no" placeholder="" />
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="category-no">Category</label>
                        <div class="select2-parent">
                            <select id="categorySelect-${cycleNum}" class="form-select" name="category-dropdown">
                                <option value="OPRP Old Plant">OPRP Old Plant</option>
                                <option value="CCP Old Plant">CCP Old Plant</option>
                                <option value="OPRP New Plant">OPRP New Plant</option>
                                <option value="CCP New Plant">CCP New Plant</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-footer">
                        <button type="button" class="bs-btn bs-btn-primary">Start Session</button>
                    </div>
                </form>
            </div>
            <div class="tour-cycle-info-wrapper" style="display: none;">
                <div class="tour-cyle-start-info"></div>
            </div>
            <div class="tour-cyle-step tour-cyle-step-form bs-fade-elem" style="display: none;">
                <div class="tour-cycle-estimation-lists">
                    <div id="dynamic-section-${cycleNum}"></div>
                    <div class="tour-cycle-estimation-footer">
                        <button type="button" class="bs-btn bs-btn-outline-primary">Cancel</button>
                        <button type="button" class="bs-btn bs-btn-primary tour-cycle-save-session-btn">Save Session</button>
                    </div>
                </div>
            </div>
            <div class="tour-cyle-step tour-cyle-step-completed" style="display: ${isCompleted ? 'block' : 'none'};">
                <div class="tour-cyle-card-lists"></div>
            </div>
        </div>
    `;

    const parentElement = document.querySelector(".tour-cycle-card-panel-lists");
    if (parentElement) {
        parentElement.appendChild(newCycle);
        if (!isCompleted) {
            newCycle.classList.add("bs-card-toggler-is-active");
            defectCycleDynamic(cycleNum);
        } else if (cycleData) {
            const completedSection = newCycle.querySelector('.tour-cyle-step-completed');
            const infoWrapper = newCycle.querySelector('.tour-cycle-info-wrapper');
            const startDataStr = localStorage.getItem(`cycle-${cycleNum}-start-data`);
            const startData = startDataStr ? JSON.parse(startDataStr) : {};
            
            infoWrapper.innerHTML = `
                <div class="tour-cyle-start-info">
                    <div class="start-info-item">
                        <p class="item-label">Product</p>
                        <p class="item-value" id="product-${cycleNum}">${cycleData.product}</p>
                    </div>
                    <div class="start-info-item">
                        <p class="item-label">Executive Name</p>
                        <p class="item-value">${cycleData.executiveName}</p>
                    </div>
                    <div class="start-info-item">
                        <p class="item-label">Batch Code</p>
                        <p class="item-value">${cycleData.batchNo}</p>
                    </div>
                    <div class="start-info-item">
                        <p class="item-label">Location & Frequency</p>
                        <p class="item-value">${cycleData.location}</p>
                    </div>
                    <div class="start-info-item">
                        <p class="item-label">Category</p>
                        <p class="item-value">${cycleData.category}</p>
                    </div>
                </div>
            `;
            infoWrapper.style.display = "block";
            renderCompletedSection(completedSection, cycleData);
        }
    }
    $(`#productSelect-${cycleNum}`).select2({
        minimumResultsForSearch: -1,
        dropdownAutoWidth: true,
        width: '100%',
      });

    $(`#categorySelect-${cycleNum}`).select2({
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
        <div class="bs-card bs-card-light bs-card-sm card-opened">
            <div class="bs-card-header">
                <h4 class="bs-card-title bs-font-color-error">Summary</h4>
            </div>
            <div class="bs-card-body">
                <div class="bs-table-container">
                    <table class="bs-table">
                        <thead>
                            <tr>
                                <th colspan="2" style="text-align: center; border: 1px solid #e0e0e0;">FE</th>
                                <th colspan="2" style="text-align: center; border: 1px solid #e0e0e0;">NFE</th>
                                <th colspan="2" style="text-align: center; border: 1px solid #e0e0e0;">SS</th>
                                <th rowspan="2" style="text-align: center; border: 1px solid #e0e0e0;">M.D. Sensitivity Rejection in Time</th>
                            </tr>
                            <tr>
                                <th style="text-align: center; border: 1px solid #e0e0e0;">Centre 1st Pass</th>
                                <th style="text-align: center; border: 1px solid #e0e0e0;">Centre 2nd Pass</th>
                                <th style="text-align: center; border: 1px solid #e0e0e0;">Centre 1st Pass</th>
                                <th style="text-align: center; border: 1px solid #e0e0e0;">Centre 2nd Pass</th>
                                <th style="text-align: center; border: 1px solid #e0e0e0;">Centre 1st Pass</th>
                                <th style="text-align: center; border: 1px solid #e0e0e0;">Centre 2nd Pass</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
    <td class="${cycleData.fecentrepass1.includes('Not Okay') ? 'not-ok' : 'ok'}" style="text-align: center; border: 1px solid #e0e0e0;">${cycleData.fecentrepass1.includes('Not Okay') ? 'Not Okay' : cycleData.fecentrepass1}</td>
    <td class="${cycleData.fecentrepass2.includes('Not Okay') ? 'not-ok' : 'ok'}" style="text-align: center; border: 1px solid #e0e0e0;">${cycleData.fecentrepass2.includes('Not Okay') ? 'Not Okay' : cycleData.fecentrepass2}</td>
    <td class="${cycleData.nfecentrepass1.includes('Not Okay') ? 'not-ok' : 'ok'}" style="text-align: center; border: 1px solid #e0e0e0;">${cycleData.nfecentrepass1.includes('Not Okay') ? 'Not Okay' : cycleData.nfecentrepass1}</td>
    <td class="${cycleData.nfecentrepass2.includes('Not Okay') ? 'not-ok' : 'ok'}" style="text-align: center; border: 1px solid #e0e0e0;">${cycleData.nfecentrepass2.includes('Not Okay') ? 'Not Okay' : cycleData.nfecentrepass2}</td>
    <td class="${cycleData.sscentrepass1.includes('Not Okay') ? 'not-ok' : 'ok'}" style="text-align: center; border: 1px solid #e0e0e0;">${cycleData.sscentrepass1.includes('Not Okay') ? 'Not Okay' : cycleData.sscentrepass1}</td>
    <td class="${cycleData.sscentrepass2.includes('Not Okay') ? 'not-ok' : 'ok'}" style="text-align: center; border: 1px solid #e0e0e0;">${cycleData.sscentrepass2.includes('Not Okay') ? 'Not Okay' : cycleData.sscentrepass2}</td>
    <td class="${cycleData.md.includes('Not Okay') ? 'not-ok' : 'ok'}" style="text-align: center; border: 1px solid #e0e0e0;">${cycleData.md.includes('Not Okay') ? 'Not Okay' : cycleData.md}</td>
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
    const product = startData.cr3ea_productname || "N/A";
    const executiveName = startData.cr953_executivename || "N/A";
    const batchNo = startData.cr3ea_batchno || "N/A";
    const location = startData.cr3ea_location || "N/A";
    const category = startData.cr3ea_category || "N/A";

    let fecentrepass1 = "OK", fecentrepass2 = "OK", nfecentrepass1 = "OK", nfecentrepass2 = "OK",
        sscentrepass1 = "OK", sscentrepass2 = "OK", md = "OK";

    const items = [
        { id: `pr-${cycleNum}-FE-1`, key: "fecentrepass1" },
        { id: `pr-${cycleNum}-FE-2`, key: "fecentrepass2" },
        { id: `pr-${cycleNum}-NFE-1`, key: "nfecentrepass1" },
        { id: `pr-${cycleNum}-NFE-2`, key: "nfecentrepass2" },
        { id: `pr-${cycleNum}-SS-1`, key: "sscentrepass1" },
        { id: `pr-${cycleNum}-SS-2`, key: "sscentrepass2" },
        { id: `pr-${cycleNum}-md`, key: "mdsensitivity" }
    ];

    items.forEach(item => {
        const card = document.getElementById(item.id);
        if (card) {
            const selectedBadge = card.querySelector(".badge-fill");
            const status = selectedBadge?.innerText.trim();
            if (status === "Not Okay") {
                const remarksInput = card.querySelector(`#not-okay-remarks-${cycleNum}-${item.key}`);
                const remarkValue = remarksInput?.value || "No remarks";
                if (item.key === "fecentrepass1") fecentrepass1 = `Not Okay (${remarkValue})`;
                if (item.key === "fecentrepass2") fecentrepass2 = `Not Okay (${remarkValue})`;
                if (item.key === "nfecentrepass1") nfecentrepass1 = `Not Okay (${remarkValue})`;
                if (item.key === "nfecentrepass2") nfecentrepass2 = `Not Okay (${remarkValue})`;
                if (item.key === "sscentrepass1") sscentrepass1 = `Not Okay (${remarkValue})`;
                if (item.key === "sscentrepass2") sscentrepass2 = `Not Okay (${remarkValue})`;
                if (item.key === "mdsensitivity") md = `Not Okay (${remarkValue})`;
            }
        }
    });

    const data = {
        "cr3ea_qualitytourid": QualityTourId || 'N/A',
        "cr3ea_title": `OPRP_${moment().format('MM-DD-YYYY')}`,
        "cr3ea_cycle": `Cycle-${cycleNum}`,
        "cr3ea_shift": sessionStorage.getItem("shiftValue") || null,
        "cr3ea_tourstartdate": moment().format('MM-DD-YYYY'),
        "cr3ea_observedby": UserName || null,
        "cr3ea_batchno": batchNo,
        "cr3ea_category": category,
        "cr3ea_location": location,
        "cr3ea_fecentrepass1": fecentrepass1,
        "cr3ea_fecentrepass2": fecentrepass2,
        "cr3ea_nfecentrepass1": nfecentrepass1,
        "cr3ea_nfecentrepass2": nfecentrepass2,
        "cr3ea_sscentrepass1": sscentrepass1,
        "cr3ea_sscentrepass2": sscentrepass2,
        "cr3ea_mdsensitivity": md,
        "cr3ea_productname": product,
        "cr953_executivename": executiveName
    };

    await saveSectionApiCall([data]);

    localStorage.removeItem(`cycle-${cycleNum}-start-data`);

    return {
        cycleNum,
        product,
        executiveName,
        batchNo,
        location,
        category,
        fecentrepass1,
        fecentrepass2,
        nfecentrepass1,
        nfecentrepass2,
        sscentrepass1,
        sscentrepass2,
        md
    };
}

async function saveSectionApiCall(data) {
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
        const tableName = "cr3ea_prod_oprpandcpps";
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
