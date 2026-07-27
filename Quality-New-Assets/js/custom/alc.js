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
    const lineNo = document.getElementById(`line-no-${cycleNum}`).value;
    const executiveName = document.getElementById(`executive-name-${cycleNum}`).value;
    const preRuning = document.getElementById(`pre-running-variety-no-${cycleNum}`).value;
    const runing = document.getElementById(`running-variety-no-${cycleNum}`).value;

    const startData = {
        product,
        lineNo,
        executiveName,
        preRuning,
        runing
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
                <p class="item-value" id="executive-name-${cycleNum}">${executiveName}</p>
            </div>
            <div class="start-info-item">
                <p class="item-label">Line No</p>
                <p class="item-value" id="line-no-${cycleNum}">${lineNo}</p>
            </div>
           <div class="start-info-item">
                <p class="item-label">Name Of The Previous Running Variety
</p>
                <p class="item-value" id="pre-running-variety-no-${cycleNum}">${preRuning}</p>
            </div>
            <div class="start-info-item">
                <p class="item-label">Name Of The Running Variety</p>
                <p class="item-value" id="running-variety-no-${cycleNum}">${runing}</p>
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
        const tableName = "cr3ea_prod_alcs";
        const apiUrl = `${environmentUrl}/api/data/v${apiVersion}/${tableName}?$filter=cr3ea_qualitytourid eq '${QualityTourId}'&$select=cr3ea_cycle,cr3ea_productname,cr3ea_lineno,cr3ea_previousrunningvariety,cr3ea_runningvariety,cr3ea_area,cr3ea_criteria,cr3ea_status,cr3ea_defectcategory,cr3ea_defectremarks,cr3ea_executivename`;

        const response = await fetch(apiUrl, { headers });
        if (!response.ok) throw new Error(`Failed to fetch data: ${response.status} - ${await response.text()}`);
        const data = await response.json();

        const groupedData = {};

        data.value.forEach(record => {
            const cycle = record.cr3ea_cycle || 'Cycle-undefined';
            const product = record.cr3ea_productname;
            const executiveName = record.cr3ea_executivename;
            const lineno = record.cr3ea_lineno;
            const previous = record.cr3ea_previousrunningvariety;
            const running = record.cr3ea_runningvariety;
            const area = record.cr3ea_area || 'Area-undefined';

            if (!groupedData[cycle]) {
                groupedData[cycle] = { cycle, product, executiveName, lineno, previous, running, data: {} };
            }

            if (!groupedData[cycle].data[area]) {
                groupedData[cycle].data[area] = [];
            }

            groupedData[cycle].data[area].push({
                criteria: record.cr3ea_criteria,
                status: record.cr3ea_status,
                category: record.cr3ea_defectcategory,
                remarks: record.cr3ea_defectremarks
            });
        });

        // Convert object to an array format
        const resultArray = Object.values(groupedData).map(cycle => ({
            cycleNum: cycle.cycle.replace('Cycle-', ''),
            product: cycle.product,
            executiveName: cycle.executiveName,
            lineno: cycle.lineno,
            previous: cycle.previous,
            running: cycle.running,
            data: Object.entries(cycle.data).map(([area, records]) => ({
                area,
                records
            }))
        }));

        return Object.values(resultArray);
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
            if (infoWrapper) {
                infoWrapper.style.display = "block";
                infoWrapper.classList.add("bs-fade-active", "bs-fade-in");
            }
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
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            viewBox="0 0 16 16" fill="none">
            <path d="M3.66667 5.66666L8.33333 10.3333L13 5.66666" stroke="#0C0D10"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    </button>
</div>
<div class="bs-card-body" style="${initialBodyStyle}">
    <div
        class="tour-cyle-step tour-cyle-step-start tour-cyle-step-start-${cycleNum} bs-fade-elem ${isCompleted ? '' : 'bs-fade-active bs-fade-in'}" style="display: ${initialDisplay};padding: 15px;">
        <!-- Cycle info -->
        <div class="tour-cyle-info-form">
            <div class="form-group">
                <label class="form-label" for="productSelect-${cycleNum}">Product</label>
                <div class="select2-parent">
                    <select id="productSelect-${cycleNum}" class="form-select"
                        name="product-dropdown">
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
                <label class="form-label" for="line-no-${cycleNum}">Line No</label>
                <input type="text" class="form-control" id="line-no-${cycleNum}" placeholder="" />
            </div>
            <div class="form-group">
                <label class="form-label" for="pre-running-variety-no-${cycleNum}">Name Of The
                    Previous Running Variety</label>
                <input type="text" class="form-control" id="pre-running-variety-no-${cycleNum}"
                    placeholder="" />
            </div>
            <div class="form-group">
                <label class="form-label" for="running-variety-no-${cycleNum}">Name Of The Running
                    Variety</label>
                <input type="text" class="form-control" id="running-variety-no-${cycleNum}"
                    placeholder="" />
            </div>
            <div class="form-group datepicker-field" style="display: none;">
                <label class="form-label" for="packaged-${cycleNum}">Packaged</label>
                <input type="text" class="form-control" id="packagedDatepicker-${cycleNum}"
                    placeholder="" />
            </div>
            <div class="form-group datepicker-field" style="display: none;">
                <label class="form-label" for="expiry">Expiry</label>
                <input type="text" class="form-control" id="expiryDatepicker-${cycleNum}"
                    placeholder="" />
            </div>
            <div class="form-footer">
                <button type="button" class="bs-btn bs-btn-primary" id="bs-startSession-${cycleNum}">Start Session</button>
            </div>
        </div>
    </div>

    <div class="tour-cycle-info-wrapper tour-cycle-info-wrapper-${cycleNum} bs-fade-elem bs-fade-active bs-fade-in" style="display: ${isCompleted ? 'block' : 'none'};">
        ${isCompleted && cycleData ? `
        <div class="tour-cyle-start-info">
            <div class="start-info-item">
                <p class="item-label">Product</p>
                <p class="item-value" id="product-${cycleNum}">${cycleData?.product}</p>
            </div>
            <div class="start-info-item">
                <p class="item-label">Executive Name</p>
                <p class="item-value" id="executiveName-${cycleNum}">${cycleData?.executiveName}</p>
            </div>
            <div class="start-info-item">
                <p class="item-label">Line No.</p>
                <p class="item-value" id="lineno-${cycleNum}">${cycleData?.lineno}</p>
            </div>
            <div class="start-info-item">
                <p class="item-label">Name Of The Previous Running Variety</p>
                <p class="item-value" id="previousrunning-${cycleNum}">${cycleData?.previous}</p>
            </div>
            <div class="start-info-item">
                <p class="item-label">Name Of The Running Variety</p>
                <p class="item-value" id="running-${cycleNum}">${cycleData?.running}</p>
            </div>
        </div>
        ` : ''}
    </div>
    <div class="tour-cyle-step tour-cyle-step-form tour-cyle-step-form-${cycleNum} bs-fade-elem">
        <div class="tour-cycle-estimation-lists">
            <div id="dynamic-section-${cycleNum}"></div>
            <div class="tour-cycle-estimation-footer">
                <button  class="bs-btn bs-btn-outline-primary">Cancel</button>
                <button type="button" class="bs-btn bs-btn-primary tour-cycle-save-session-btn">Save
                    Session</button>
            </div>
        </div>
    </div>
    <div class="tour-cyle-step tour-cyle-step-completed tour-cyle-step-completed-${cycleNum}" style="display: ${isCompleted ? 'block' : 'none'};">
        <div class="tour-cyle-card-lists">                                
        </div>
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

    let tableContent = `
  <div class="bs-card bs-card-light bs-card-sm card-opened">
    <div class="bs-card-header">
      <h4 class="bs-card-title">Quality Tour Summary</h4>
    </div>
    <div class="bs-card-body" style="overflow-x: auto;">
      <div class="bs-table-container">
        <table class="bs-table" border="1" 
          style="border-collapse: collapse; width: 100%; min-width: 800px; text-align: center; font-size: 14px;">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Area</th>
              <th>Description</th>
              <th>Status</th>
              <th>Compliance Score</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
`;

    let totalScore = 0;
    let okayCount = 0;

    cycleData.data.forEach((item, index) => {
        item.records.forEach((record, recordIndex) => {
            if (record.status === "Okay") okayCount++;
            tableContent += `<tr>`;

            if (recordIndex === 0) {
                tableContent += `
        <td rowspan="${item.records.length}">${index + 1}</td>
        <td rowspan="${item.records.length}">${item.area}</td>
      `;
            }

            const score = parseFloat(record.category) || 0;
            totalScore += score;

            tableContent += `
      <td>${record.criteria}</td>
      <td>${record.status}</td>
      <td style="text-align: center;">${record.category}</td>
      <td style="text-align: center;">${record.remarks}</td>
    </tr>`;
        });
    });
    
    let alcScore = (okayCount / 46) * 100;
    let alcScoreFormatted = alcScore.toFixed(2);

    // Add the Total Row
    tableContent += `
  <tr style="font-weight: bold; background-color: #f8f8f8;">
    <td colspan="4" style="text-align: right;">Total Score</td>
    <td colspan="2" style="text-align: center;"><strong>${alcScoreFormatted}%</strong></td>
  </tr>
`;

    tableContent += `</tbody></table></div></div></div>`;

    container.innerHTML = tableContent;
    console.log("Summary rendered, container innerHTML:", container.innerHTML);

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
        { title: "RM Store", items: ["No scrap at RM storage area", "Floor Condition- To be cleaned", "Free from Infestations/Sign of infestation like crawling marks etc."], keys: ["rmstore1", "rmstore2", "rmstore3"] },
        { title: "Flour & Sugar Handling", items: ["Maida and Sugar handling area Cleanliness -Floor, wall, ceiling, railing, cuving.", "Sieve Condition- free from damage and Cleanliness", "Magnet Position and cleanliness.", "Free from Infestations/Sign of infestation like crawling marks etc.", "No damage and loose thread in cotton bellows."], keys: ["floorsugar1", "floorsugar2", "floorsugar3", "floorsugar4", "floorsugar5"] },
        { title: "Chemical Handling Area", items: ["All utensils to be clean and free from damage.", "All sieve condition- Free from damage and cleanliness.", "All Magnets in place and to be clean.", "All ingredient trollies to be identified.", "All trollleys to be clean and free from damage.", "Check for overall area cleaniness."], keys: ["chemicalhandling1", "chemicalhandling2", "chemicalhandling3", "chemicalhandling4", "chemicalhandling5", "chemicalhandling6"] },
        { title: "Mixing", items: ["All gasket to be free from damage", "Floor condition - to be clean", "Free from scrap accumulation at mixing", "No loose nut, bolts, electrical cable on floor/equipment.", "No damage and loose thread in cotton bellows", "All utensils are clean and free from damage", "All catch trays are in place and clean", "No damage or loose threads in cotton conveyors", "All previous running variety which will not be used in next running variety should be transferred back to RM store", "All hoppers and sprinklinlers should be clean and free from extraneous material", "Dough trollies in use are properly cleaned", "Running variety should be dispalyed on board", "Mixer should be clean and free from any left over dough", "Rotary Moulder,Cross Over Conveyor and Feed rollers should be cleaned"], keys: ["mixing1", "mixing2", "mixing3", "mixing4", "mixing5", "mixing6", "mixing7", "mixing8", "mixing9", "mixing10", "mixing11", "mixing12", "mixing13", "mixing14"] },
        { title: "Oven", items: ["Check for overall area cleaniness", "Remove all broken from Oven end", "All trollies used to be clean and free from damage"], keys: ["oven1", "oven2", "oven3"] },
        { title: "Packing Area", items: ["Check for overall area cleaniness", "Return back all previous laminate/Trays/CBB/Tins and get issued running variety with proper checking", "All catch trays are in place and clean", "All ingredient trollies to be identified.", "No old Biscuits are present in packing area including MD Rejection bin", "All crates and trollies are clean and free from damage", "No loose nut, bolts, electrical cable on floor/equipment", "Conveyor rollers should be cleaned", "No WIP/Previous variety material to be kept on shopfloor", "All Packing machines and its contact surfaces should be clean", "Proper arrangement of RC and identification on the same"], keys: ["packagingarea1", "packagingarea2", "packagingarea3", "packagingarea4", "packagingarea5", "packagingarea6", "packagingarea7", "packagingarea8", "packagingarea9", "packagingarea10", "packagingarea11"] },
        { title: "Biscuit Grinding", items: ["Check for overall area cleaniness", "All sieve condition- Free from damage and cleanliness", "All Magnets are in place and to be clean", "All Trollies used are clean"], keys: ["biscut1", "biscut2", "biscut3", "biscut4"] },

    ];

    groups.forEach(group => {
        const groupHTML = `
            <div class="card-border bs-card-light bs-card" style="margin-top:10px;">
                <div class="form-group-title">
                    <h4 class="bs-card-title">${group.title}</h4>
                </div>
                ${group.items.map((item, index) => `
                    <div class="bs-card bs-card-toggler bs-card-light bs-card-sm tour-cycle-estimation-item" id="pr-${cycleNum}-${group.title.replace(/\s/g, "")}-${index + 1}">
                        <div class="bs-card-header">
                            <h4 class="bs-card-title">${item}</h4>
                            <div class="tour-cycle-estimation-actions">
                                <span class="badge badge-lg badge-error cycle-estimation-action-elem" data-status="not-okay">Not Okay</span>
                                <span class="badge badge-lg badge-success cycle-estimation-action-elem" data-status="okay">Okay</span>
                                
                            </div>
                        </div>
                        <div class="bs-card-body" style="max-height: 0;">
                          <div class="estimation-not-okay-wrapper" style="padding:10px;">
                              <div class="form-group estimation-item-category">
                                  <label class="form-label"
                                      for="not-okay-category-1">Select Category <span
                                          class="required-elem">*</span></label> 
                                  <div class="form-check-lists">
                                      <div class="form-check">
                                          <input class="form-check-input" type="radio"
                                              id="not-okay-${cycleNum}-${group.title.replace(/\s/g, "")}-${index + 1}-1"
                                              name="not-okay-${cycleNum}-${group.title.replace(/\s/g, "")}-${index + 1}"
                                              value="0" checked>
                                          <label class="form-label form-check-label"
                                              for="not-okay-${cycleNum}-${group.title.replace(/\s/g, "")}-${index + 1}-1">Category
                                              0</label>
                                      </div>
                                      <div class="form-check">
                                          <input class="form-check-input" type="radio"
                                              id="not-okay-${cycleNum}-${group.title.replace(/\s/g, "")}-${index + 1}-2"
                                              name="not-okay-${cycleNum}-${group.title.replace(/\s/g, "")}-${index + 1}"
                                              value="1">
                                          <label class="form-label form-check-label"
                                              for="not-okay-${cycleNum}-${group.title.replace(/\s/g, "")}-${index + 1}-2">Category
                                              1</label>
                                      </div>
                                  </div>
                              </div>
                              <div class="form-group">
                                  <label class="form-label"
                                      for="not-okay-remarks-${cycleNum}-${group.title.replace(/\s/g, "")}-${index + 1}">Major Defects and
                                      Remarks</label>
                                  <input type="text" class="form-control"
                                      id="not-okay-remarks-${cycleNum}-${group.title.replace(/\s/g, "")}-${index + 1}"
                                      placeholder="Type Here..." />
                              </div>
                          </div>
                      </div>
                    </div>
                `).join('')}
            </div>
        `;
        container.insertAdjacentHTML("beforeend", groupHTML);
    });

    console.log(`Dynamic content generated for cycle ${cycleNum}`);

    document.addEventListener("click", function (event) {
        console.log("Badge click event triggered");

        const selectedBadge = event.target.closest(".cycle-estimation-action-elem");
        if (!selectedBadge) return; // Exit if no badge is clicked

        const card = selectedBadge.closest(".bs-card");
        if (!card) return; // Exit if no parent card found

        const cardBody = card.querySelector(".bs-card-body");
        const notOkayBadge = card.querySelector('[data-status="not-okay"]');
        const okayBadge = card.querySelector('[data-status="okay"]');

        if (selectedBadge.dataset.status === "not-okay") {
            card.classList.add("bs-card-toggler-is-active"); // Add active class
            cardBody.style.display = "block";
            cardBody.style.maxHeight = "100vh";
            notOkayBadge.classList.add("badge-fill");
            okayBadge.classList.remove("badge-fill");
            console.log("Set to Not Okay");
        } else {
            card.classList.remove("bs-card-toggler-is-active"); // Remove active class
            cardBody.style.maxHeight = "0";
            cardBody.style.display = "none";
            okayBadge.classList.add("badge-fill");
            notOkayBadge.classList.remove("badge-fill");
            console.log("Set to Okay");
        }
    });

}
async function collectEstimationDataCycleSave(cycleNum) {
    const startDataStr = localStorage.getItem(`cycle-${cycleNum}-start-data`);
    const startData = startDataStr ? JSON.parse(startDataStr) : {};
    const product = startData.product || "N/A";
    const executiveName = startData.executiveName || "N/A";
    const lineNo = startData.lineNo || "N/A";
    const preRuning = startData.preRuning || "N/A";
    const runing = startData.runing || "N/A";
    const shiftValue = sessionStorage.getItem("shiftValue") || null;
    const observedBy = UserName || null;
    const tourStartDate = moment().format('MM-DD-YYYY');

    const items = [
        { id: `pr-${cycleNum}-RMStore-1`, key: "rmstore1" },
        { id: `pr-${cycleNum}-RMStore-2`, key: "rmstore2" },
        { id: `pr-${cycleNum}-RMStore-3`, key: "rmstore3" },

        { id: `pr-${cycleNum}-Flour&SugarHandling-1`, key: "floorsugar1" },
        { id: `pr-${cycleNum}-Flour&SugarHandling-2`, key: "floorsugar2" },
        { id: `pr-${cycleNum}-Flour&SugarHandling-3`, key: "floorsugar3" },
        { id: `pr-${cycleNum}-Flour&SugarHandling-4`, key: "floorsugar4" },
        { id: `pr-${cycleNum}-Flour&SugarHandling-5`, key: "floorsugar5" },

        { id: `pr-${cycleNum}-ChemicalHandlingArea-1`, key: "chemicalhandling1" },
        { id: `pr-${cycleNum}-ChemicalHandlingArea-2`, key: "chemicalhandling2" },
        { id: `pr-${cycleNum}-ChemicalHandlingArea-3`, key: "chemicalhandling3" },
        { id: `pr-${cycleNum}-ChemicalHandlingArea-4`, key: "chemicalhandling4" },
        { id: `pr-${cycleNum}-ChemicalHandlingArea-5`, key: "chemicalhandling5" },
        { id: `pr-${cycleNum}-ChemicalHandlingArea-6`, key: "chemicalhandling6" },

        { id: `pr-${cycleNum}-Mixing-1`, key: "mixing1" },
        { id: `pr-${cycleNum}-Mixing-2`, key: "mixing2" },
        { id: `pr-${cycleNum}-Mixing-3`, key: "mixing3" },
        { id: `pr-${cycleNum}-Mixing-4`, key: "mixing4" },
        { id: `pr-${cycleNum}-Mixing-5`, key: "mixing5" },
        { id: `pr-${cycleNum}-Mixing-6`, key: "mixing6" },
        { id: `pr-${cycleNum}-Mixing-7`, key: "mixing7" },
        { id: `pr-${cycleNum}-Mixing-8`, key: "mixing8" },
        { id: `pr-${cycleNum}-Mixing-9`, key: "mixing9" },
        { id: `pr-${cycleNum}-Mixing-10`, key: "mixing10" },
        { id: `pr-${cycleNum}-Mixing-11`, key: "mixing11" },
        { id: `pr-${cycleNum}-Mixing-12`, key: "mixing12" },
        { id: `pr-${cycleNum}-Mixing-13`, key: "mixing13" },
        { id: `pr-${cycleNum}-Mixing-14`, key: "mixing14" },

        { id: `pr-${cycleNum}-Oven-1`, key: "oven1" },
        { id: `pr-${cycleNum}-Oven-2`, key: "oven2" },
        { id: `pr-${cycleNum}-Oven-3`, key: "oven3" },

        { id: `pr-${cycleNum}-PackingArea-1`, key: "packagingarea1" },
        { id: `pr-${cycleNum}-PackingArea-2`, key: "packagingarea2" },
        { id: `pr-${cycleNum}-PackingArea-3`, key: "packagingarea3" },
        { id: `pr-${cycleNum}-PackingArea-4`, key: "packagingarea4" },
        { id: `pr-${cycleNum}-PackingArea-5`, key: "packagingarea5" },
        { id: `pr-${cycleNum}-PackingArea-6`, key: "packagingarea6" },
        { id: `pr-${cycleNum}-PackingArea-7`, key: "packagingarea7" },
        { id: `pr-${cycleNum}-PackingArea-8`, key: "packagingarea8" },
        { id: `pr-${cycleNum}-PackingArea-9`, key: "packagingarea9" },
        { id: `pr-${cycleNum}-PackingArea-10`, key: "packagingarea10" },
        { id: `pr-${cycleNum}-PackingArea-11`, key: "packagingarea11" },

        { id: `pr-${cycleNum}-BiscuitGrinding-1`, key: "biscut1" },
        { id: `pr-${cycleNum}-BiscuitGrinding-2`, key: "biscut2" },
        { id: `pr-${cycleNum}-BiscuitGrinding-3`, key: "biscut3" },
        { id: `pr-${cycleNum}-BiscuitGrinding-4`, key: "biscut4" },
    ];

    const collectedData = [];

    for (const item of items) {
        const card = document.getElementById(item.id);
        let remarkValue = "";
        let categoryValue = "";
        let area = "";
        let criteria = "";
        if (card) {
            const selectedBadge = card.querySelector(".badge-fill");
            const status = selectedBadge?.innerText.trim() || "OK";
            criteria = card.querySelector(".bs-card-title")?.innerText;
            const match = item.id.match(/-(\D+)-/);
            const thenewarea = match ? match[1] : "";
            area = thenewarea.replace(/([a-z])([A-Z])|&/g, "$1 $2").replace(/&/g, " & ");

            if (status === "Not Okay") {
                const idcurrect = item.id.replace("pr-", "");
                const safeId = CSS.escape(`not-okay-remarks-${idcurrect}`);
                const remarksInput = document.querySelector(`#${safeId}`);
                const selectedCategory = card.querySelector(`input[name="not-okay-${idcurrect}"]:checked`);
                remarkValue = remarksInput?.value || "No remarks";
                categoryValue = selectedCategory?.value || "No category";
            }
            else if (status === "OK" || status === "Okay") {
                remarkValue = "No remarks";
                categoryValue = "2";
            }


            collectedData.push({
                "cr3ea_qualitytourid": QualityTourId || 'N/A',
                "cr3ea_title": `ALC_${tourStartDate}`,
                "cr3ea_cycle": `Cycle-${cycleNum}`,
                "cr3ea_shift": shiftValue,
                "cr3ea_tourstartdate": tourStartDate,
                "cr3ea_observedby": observedBy,
                "cr3ea_productname": product,
                "cr3ea_lineno": lineNo,
                "cr3ea_previousrunningvariety": preRuning,
                "cr3ea_runningvariety": runing,
                "cr3ea_area": area,
                "cr3ea_criteria": criteria,
                "cr3ea_status": status,
                "cr3ea_defectcategory": categoryValue,
                "cr3ea_defectremarks": remarkValue,
                "cr3ea_executivename": executiveName
            });
        }
    }

    if (collectedData.length > 0) {
        await savesectionApicall(collectedData);
    }
    localStorage.removeItem(`cycle-${cycleNum}-start-data`);
    return collectedData
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
        const tableName = "cr3ea_prod_alcs";
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
        reloadFetchCycleData()
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

