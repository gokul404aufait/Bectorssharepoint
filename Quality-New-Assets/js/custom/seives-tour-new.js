// Global variables
let cycleCounter = 1; // Start from 1, will be updated based on fetched data
let QualityTourId = GetQueryStringParams('TourId');


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
});

async function reloadFetchCycleData() {
  const existingCycles = await fetchCycleData();
  console.log("Fetched cycles:", existingCycles);

  // Clear existing content to prevent duplicates
  const parentElement = document.querySelector(".tour-cycle-card-panel-lists");
  if (parentElement) parentElement.innerHTML = '';

  if (existingCycles.length > 0) {
    existingCycles.forEach(cycleData => {
      createCycleSection(cycleData.cycleNum, true, cycleData);
    });
    cycleCounter = Math.max(...existingCycles.map(c => parseInt(c.cycleNum))) + 1;
    // Create and show the next cycle form
    createCycleSection(cycleCounter, false);
  } else {
    createCycleSection(1, false);
  }
  console.log("Initial cycleCounter:", cycleCounter);

  // Remove any existing event listeners to prevent duplicates
  document.removeEventListener('click', toggleCardHandler);
  document.removeEventListener('click', saveSessionHandler);

  document.addEventListener('click', toggleCardHandler);
  document.addEventListener('click', saveSessionHandler);
}

function toggleCardHandler(event) {
  const btn = event.target.closest('.bs-card-toggler-btn');
  if (btn) {
    const currentPanel = btn.closest('.bs-card-toggler');
    const currentPanelBody = currentPanel.querySelector('.bs-card-body');
    const form = currentPanel.querySelector('.tour-cyle-step-form');
    const estimationLists = form ? form.querySelector('.tour-cycle-estimation-lists') : null;
    const completedSection = currentPanel.querySelector('.tour-cyle-step-completed');

    currentPanel.classList.toggle('bs-card-toggler-is-active');
    const isActive = currentPanel.classList.contains('bs-card-toggler-is-active');

    currentPanelBody.style.maxHeight = isActive ? "none" : "0";

    // Manage form and its estimation lists visibility
    if (form && estimationLists) {
      form.style.display = isActive ? "block" : "none";
      estimationLists.style.display = isActive ? "block" : "none";
    }
    // Manage completed section visibility
    if (completedSection) {
      completedSection.style.display = isActive ? "block" : "none";
    }
  }
}

async function saveSessionHandler(event) {
  const btn = event.target.closest('.tour-cycle-save-session-btn');
  if (btn) {
    const cycleNum = btn.classList[btn.classList.length - 1].split('-').pop();
    console.log(`Saving Cycle ${cycleNum}`);
    await saveSectionButtonClick(btn, cycleNum);
  }
}

// Fetch Existing Cycle Data from API
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
    const tableName = "cr3ea_prod_sievesandmagnetsnewplants";
    const apiUrl = `${environmentUrl}/api/data/v${apiVersion}/${tableName}?$filter=cr3ea_qualitytourid eq '${QualityTourId}'&$select=cr3ea_cycle,cr3ea_criteria,cr3ea_defectremarks,cr3ea_description`;

    const response = await fetch(apiUrl, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} - ${await response.text()}`);
    }

    const data = await response.json();
    const cycles = {};

    data.value.forEach(record => {
      const cycleNum = record.cr3ea_cycle.replace('Cycle-', '');
      if (!cycles[cycleNum]) {
        cycles[cycleNum] = { cycleNum, defects: [], okays: [] };
      }
      if (record.cr3ea_criteria === "Not Okay") {
        cycles[cycleNum].defects.push({ title: record.cr3ea_description, remarks: record.cr3ea_defectremarks || "No remarks" });
      } else if (record.cr3ea_criteria === "Okay") {
        cycles[cycleNum].okays.push(record.cr3ea_description);
      }
    });

    return Object.values(cycles);
  } catch (error) {
    console.error('Error fetching cycle data:', error);
    return [];
  }
}

// Save Section Button Click Handler
async function saveSectionButtonClick(btn, cycleNum) {
  if (!btn) return;

  const currentParentPanel = btn.closest(`.tour-cycle-panel-${cycleNum}`);
  if (!currentParentPanel) {
    console.error(`Element .tour-cycle-panel-${cycleNum} not found.`);
    return;
  }

  const stepForm = currentParentPanel.querySelector(`.tour-cyle-step-form-${cycleNum}`);
  const estimationLists = stepForm ? stepForm.querySelector('.tour-cycle-estimation-lists') : null;
  const stepCompleted = currentParentPanel.querySelector(`.tour-cyle-step-completed-${cycleNum}`);

  if (!stepForm || !estimationLists || !stepCompleted) {
    console.error(`Elements .tour-cyle-step-form-${cycleNum}, .tour-cycle-estimation-lists, or .tour-cyle-step-completed-${cycleNum} not found.`);
    return;
  }

  const cycleData = await collectEstimationDataCycleSave(cycleNum);
  renderCompletedSection(stepCompleted, cycleData);

  // Hide form and show completed section
  stepForm.classList.remove("bs-fade-active", "bs-fade-in");
  stepForm.style.display = "none";
  estimationLists.style.display = "none";
  stepCompleted.style.display = "block";
  stepCompleted.classList.add("bs-fade-active", "bs-fade-in");

  // Create and show next cycle form
  const nextCycleNum = parseInt(cycleNum) + 1;
  if (!document.getElementById(`cycle-${nextCycleNum}`)) {
    createCycleSection(nextCycleNum, false);
    cycleCounter = nextCycleNum + 1; // Update cycleCounter for next creation
  }

  // Ensure only the newest form is active
  document.querySelectorAll('.bs-card-toggler').forEach(panel => {
    panel.classList.remove('bs-card-toggler-is-active');
    const panelBody = panel.querySelector('.bs-card-body');
    const form = panel.querySelector('.tour-cyle-step-form');
    const estimationListsInner = form ? form.querySelector('.tour-cycle-estimation-lists') : null;
    const completed = panel.querySelector('.tour-cyle-step-completed');
    if (panelBody) panelBody.style.maxHeight = "0";
    if (form) form.style.display = "none";
    if (estimationListsInner) estimationListsInner.style.display = "none";
    if (completed) completed.style.display = "none";
  });
  const nextCyclePanel = document.getElementById(`cycle-${nextCycleNum}`);
  if (nextCyclePanel) {
    nextCyclePanel.classList.add('bs-card-toggler-is-active');
    const nextPanelBody = nextCyclePanel.querySelector('.bs-card-body');
    const nextForm = nextCyclePanel.querySelector(`.tour-cyle-step-form-${nextCycleNum}`);
    const nextEstimationLists = nextForm ? nextForm.querySelector('.tour-cycle-estimation-lists') : null;
    if (nextPanelBody) nextPanelBody.style.maxHeight = "none";
    if (nextForm) nextForm.style.display = "block";
    if (nextEstimationLists) nextEstimationLists.style.display = "block";
  }
}

// Dynamic Cycle Defect Generation
function defectCycleDynamic(cycleNum) {
  const titles = [
    "Sugar Sifter", "Maida Sifter Sieve Double Decker L-5&7", "Maida Sifter Sieve Double Decker L-6",
    "Biscuits Dust 1 (L-5&7)", "Biscuits Dust 2 (L-6)", "Chemical Sifter 1", "Chemical Sifter 2",
    "Chemical Sifter 3 (Cocoa powder)", "Chemical Sifter 4 (SMP)", "Invert Syrup - Bucket Filter",
    "Black jack - Bucket Filter", "Sugar Grinding Room", "Packing Temp L-5", "Packing Temp L-6",
    "Packing Temp L-7", "L-5 Cooling tunnel temp. Zone-1", "L-5 Cooling tunnel temp. Zone-2",
    "L-5 Cooling tunnel temp. Zone-3", "Cold Storage-1", "Cold Storage-2", "Flavour Room"
  ];

  const container = document.getElementById(`dynamic-section-${cycleNum}`);
  if (!container) {
    console.error(`Container dynamic-section-${cycleNum} not found!`);
    return;
  }

  container.innerHTML = '';

  // 🔹 Product + Executive section (inline)
  const productExecHTML = `
    <div class="bs-card bs-card-light bs-card-sm" style="margin:10px">
      <div class="bs-card-header">
        <h4 class="bs-card-title">Product & Executive Details</h4>
      </div>
      <div class="bs-card-body">
        <div style="display:flex; gap:20px; align-items:center;">
          <div style="flex:1;">
            <label class="form-label" for="productInput-${cycleNum}">Product</label>
            <input type="text" class="form-control" id="productInput-${cycleNum}" 
                   placeholder="Enter Product Name..." />
          </div>
          <div style="flex:1;">
            <label class="form-label" for="executiveInput-${cycleNum}">Executive Name</label>
            <input type="text" class="form-control" id="executiveInput-${cycleNum}" 
                   placeholder="Enter Executive Name..." />
          </div>
        </div>
      </div>
    </div>
  `;
  container.insertAdjacentHTML("beforeend", productExecHTML);

  // 🔹 Add your defect items below
  titles.forEach((title, index) => {
    const uniqueId = `sieves-new-not-okay-remarks-no-${cycleNum}-${index + 1}`;
    const cardHTML = `
      <div class="bs-card bs-card-toggler bs-card-light bs-card-sm tour-cycle-estimation-item" 
           id="pr-${cycleNum}-${index + 1}" style="margin:10px">
        <div class="bs-card-header">
          <h4 class="bs-card-title">${title}</h4>
          <div class="tour-cycle-estimation-actions">
            <span class="badge badge-lg badge-error cycle-estimation-action-elem" data-status="not-okay">Not Okay</span>
            <span class="badge badge-lg badge-success cycle-estimation-action-elem" data-status="okay">Okay</span>
          </div>
        </div>
        <div class="bs-card-body" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
          <div class="estimation-not-okay-wrapper">
            <div class="form-group estimation-item-category">
              <div class="form-group">
                <label class="form-label" for="${uniqueId}">Major Defects and Remarks</label>
                <input type="text" class="form-control" id="${uniqueId}" placeholder="Type Here..." />
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", cardHTML);
  });


container.addEventListener("click", function (event) {
  const selectedBadge = event.target.closest(".cycle-estimation-action-elem");
  if (!selectedBadge) return;

  const card = selectedBadge.closest(".bs-card");
  if (!card) return;

  const cardBody = card.querySelector(".bs-card-body");
  const notOkayBadge = card.querySelector('[data-status="not-okay"]');
  const okayBadge = card.querySelector('[data-status="okay"]');

  const isActive = card.classList.contains("bs-card-toggler-is-active");

  if (selectedBadge.dataset.status === "not-okay") {
    if (isActive) {
      // Remove active state if already active
      card.classList.remove("bs-card-toggler-is-active");
      cardBody.style.maxHeight = "0";
      notOkayBadge.classList.remove("badge-fill");
    } else {
      // Apply active state
      card.classList.add("bs-card-toggler-is-active");
      cardBody.style.maxHeight = "100px";
      notOkayBadge.classList.add("badge-fill");
      okayBadge.classList.remove("badge-fill");
    }
  } else {
    // Toggle okay state
    card.classList.remove("bs-card-toggler-is-active");
    cardBody.style.maxHeight = "0";
    okayBadge.classList.add("badge-fill");
    notOkayBadge.classList.remove("badge-fill");
  }
});
}

// Create Cycle Section
function createCycleSection(cycleNum, isCompleted = false, cycleData = null) {
  const existingCycle = document.getElementById(`cycle-${cycleNum}`);
  if (existingCycle) {
    console.log(`Cycle ${cycleNum} already exists, updating if necessary`);
    if (isCompleted && cycleData) {
      const completedSection = existingCycle.querySelector(`.tour-cyle-step-completed-${cycleNum}`);
      renderCompletedSection(completedSection, cycleData);
      completedSection.classList.add("bs-fade-active", "bs-fade-in");
      const stepForm = existingCycle.querySelector(`.tour-cyle-step-form-${cycleNum}`);
      stepForm.classList.remove("bs-fade-active", "bs-fade-in");
      stepForm.style.display = "none";
      const estimationLists = stepForm.querySelector('.tour-cycle-estimation-lists');
      if (estimationLists) estimationLists.style.display = "none";
      completedSection.style.display = "block";
    }
    return;
  }

  console.log(`Creating Cycle ${cycleNum}, isCompleted: ${isCompleted}`);

  const newCycle = document.createElement("div");
  newCycle.classList.add("bs-card-toggler", "bs-card", "bs-card-secondary", "tour-cycle-panel", `tour-cycle-panel-${cycleNum}`);
  newCycle.setAttribute("id", `cycle-${cycleNum}`);

  const formVisibility = isCompleted ? '' : 'bs-fade-active bs-fade-in';
  const completedVisibility = isCompleted ? 'bs-fade-active bs-fade-in' : '';

  // Set initial max-height to 0 for completed cycles, none for new form
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
            <div class="tour-cyle-step tour-cyle-step-form tour-cyle-step-form-${cycleNum} bs-fade-elem ${formVisibility}" style="display: ${isCompleted ? 'none' : 'block'};">
                <div class="tour-cycle-estimation-lists" style="display: ${isCompleted ? 'none' : 'block'};">
                    <div id="dynamic-section-${cycleNum}"></div>
                    <div class="tour-cycle-estimation-footer">
                        <button type="button" class="bs-btn bs-btn-outline-primary">Cancel</button>
                        <button type="button" class="bs-btn bs-btn-primary tour-cycle-save-session-btn tour-cycle-save-session-btn-${cycleNum}">Save Session</button>
                    </div>
                </div>
            </div>
            <div class="tour-cyle-step tour-cyle-step-completed tour-cyle-step-completed-${cycleNum} bs-fade-elem ${completedVisibility}" style="display: ${isCompleted ? 'block' : 'none'};">
                <div class="tour-cyle-card-lists"></div>
            </div>
        </div>
    `;

  const parentElement = document.querySelector(".tour-cycle-card-panel-lists");
  if (parentElement) {
    console.log("Appending Cycle", cycleNum, "to parent element");
    parentElement.appendChild(newCycle);
    if (!isCompleted) {
      defectCycleDynamic(cycleNum);
      newCycle.classList.add("bs-card-toggler-is-active");
      const form = newCycle.querySelector(`.tour-cyle-step-form-${cycleNum}`);
      const estimationLists = form.querySelector('.tour-cycle-estimation-lists');
      form.style.display = "block";
      estimationLists.style.display = "block";
      form.style.visibility = "visible";
    } else if (cycleData) {
      const completedSection = newCycle.querySelector(`.tour-cyle-step-completed-${cycleNum}`);
      renderCompletedSection(completedSection, cycleData);
    }
  } else {
    console.error("Parent element .tour-cycle-card-panel-lists not found");
  }
}

// Render Completed Section Dynamically
function renderCompletedSection(completedSection, cycleData) {
  const { defects, okays } = cycleData;
  const container = completedSection.querySelector('.tour-cyle-card-lists');
  if (!container) {
    console.error("Completed section container not found");
    return;
  }

  container.innerHTML = '';

  let defectsHTML = `
        <div class="bs-card bs-card-light bs-card-sm card-opened">
            <div class="bs-card-header">
                <h4 class="bs-card-title bs-font-color-error">Defects</h4>
            </div>
            <div class="bs-card-body">
                <div class="bs-table-container">
                    <table class="bs-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
    `;
  if (defects.length > 0) {
    defects.forEach(defect => {
      defectsHTML += `
                <tr>
                    <td>${defect.title}</td>
                    <td>${defect.remarks}</td>
                </tr>
            `;
    });
  } else {
    defectsHTML += `
            <tr>
                <td colspan="2">No defects reported</td>
            </tr>
        `;
  }
  defectsHTML += `
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
  container.insertAdjacentHTML("beforeend", defectsHTML);

  let resultsHTML = `
        <div class="bs-card bs-card-light bs-card-sm">
            <div class="submission-result-sec" style="display: flex; gap: 20px;">
                <div class="submission-result-wrapper" style="flex: 1;">
                    <h4 class="bs-card-title bs-font-color-success">Okays</h4>
                    <div class="submission-result-lists" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
    `;
  if (okays.length > 0) {
    okays.forEach(okay => {
      resultsHTML += `<p class="list-item">${okay}</p>`;
    });
  } else {
    resultsHTML += `<p class="list-item">None</p>`;
  }
  resultsHTML += `
                    </div>
                </div>
                <div class="submission-result-wrapper" style="flex: 1;">
                    <h4 class="bs-card-title">Defects</h4>
                    <div class="submission-result-lists" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
    `;
  if (defects.length > 0) {
    defects.forEach(defect => {
      resultsHTML += `<p class="list-item">${defect.title}</p>`;
    });
  } else {
    resultsHTML += `<p class="list-item">None</p>`;
  }
  resultsHTML += `
                    </div>
                </div>
            </div>
        </div>
    `;
  container.insertAdjacentHTML("beforeend", resultsHTML);
}

// Collect Estimation Data for Saving and Return Processed Data
async function collectEstimationDataCycleSave(cycleNum) {
  const savedData = [];
  const defects = [];
  const okays = [];
  const titles = [
    "Sugar Sifter", "Maida Sifter Sieve Double Decker L-5&7", "Maida Sifter Sieve Double Decker L-6",
    "Biscuits Dust 1 (L-5&7)", "Biscuits Dust 2 (L-6)", "Chemical Sifter 1", "Chemical Sifter 2",
    "Chemical Sifter 3 (Cocoa powder)", "Chemical Sifter 4 (SMP)", "Invert Syrup - Bucket Filter",
    "Black jack - Bucket Filter", "Sugar Grinding Room", "Packing Temp L-5", "Packing Temp L-6",
    "Packing Temp L-7", "L-5 Cooling tunnel temp. Zone-1", "L-5 Cooling tunnel temp. Zone-2",
    "L-5 Cooling tunnel temp. Zone-3", "Cold Storage-1", "Cold Storage-2", "Flavour Room"
  ];

  for (let i = 1; i <= 21; i++) {
    const cardId = `pr-${cycleNum}-${i}`;
    const card = document.getElementById(cardId);
    const productValue = document.getElementById(`productInput-${cycleNum}`)?.value || null;
    const executiveName = document.getElementById(`executiveInput-${cycleNum}`)?.value || null;

    if (card) {
      const selectedBadge = card.querySelector(".badge-fill");
      const cr3ea_criteria = selectedBadge?.innerText.trim() || null;
      const title = titles[i - 1];

      if (cr3ea_criteria) {
        let data = {
          "cr3ea_criteria": cr3ea_criteria,
          "cr3ea_qualitytourid": QualityTourId || 'N/A',
          "cr3ea_title": `QA_${moment().format('MM-DD-YYYY')}`,
          "cr3ea_cycle": `Cycle-${cycleNum}`,
          "cr3ea_shift": sessionStorage.getItem("shiftValue") || null,
          "cr3ea_defectremarks": null,
          "cr3ea_tourstartdate": moment().format('MM-DD-YYYY'),
          "cr3ea_observedby": UserName || null,
          "cr3ea_description": title,
          "cr3ea_productname": productValue,
          "cr953_executivename": executiveName
        };

        if (cr3ea_criteria === "Not Okay") {
          const remarksEl = document.getElementById(`sieves-new-not-okay-remarks-no-${cycleNum}-${i}`);
          data.cr3ea_defectremarks = remarksEl?.value || null;
          defects.push({ title: title, remarks: data.cr3ea_defectremarks || "No remarks" });
        } else if (cr3ea_criteria === "Okay") {
          okays.push(title);
        }
        savedData.push(data);
      }
    }
  }

  if (savedData.length > 0) {
    await savesectionApicall(savedData);
    console.log(savedData, "Collected Estimation Data");
  }

  return { defects, okays };
}

// Save Section API Call
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
    const tableName = "cr3ea_prod_sievesandmagnetsnewplants";
    const apiUrl = `${environmentUrl}/api/data/v${apiVersion}/${tableName}`;

    for (const record of data) {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(record)
      });

      if (!response.ok) {
        throw new Error(`Failed to save record: ${response.status} - ${await response.text()}`);
      }

      const result = await response.json();
      console.log('Record saved:', result);
    }

    reloadFetchCycleData();
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
  alert(message); // Replace with your preferred notification system
}

function showErrorNotification(message) {
  console.error(message);
  alert(message); // Replace with your preferred notification system
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
