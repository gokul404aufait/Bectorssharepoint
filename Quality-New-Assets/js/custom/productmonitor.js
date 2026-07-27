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
    const executiveName = document.getElementById(`executive-name-${cycleNum}`).value;

    const startData = {
      product,
      executiveName
    };
    localStorage.setItem(`cycle-${cycleNum}-start-data`, JSON.stringify(startData));
    console.log("Start data saved to localStorage:", startData);

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
    const tableName = "cr3ea_prod_productmonitorings";
    const apiUrl = `${environmentUrl}/api/data/v${apiVersion}/${tableName}?$filter=cr3ea_qualitytourid eq '${QualityTourId}'&$select=cr3ea_productname,cr3ea_cycle,cr3ea_moisture,cr3ea_gaugeoperating,cr3ea_gaugenonoperating,cr3ea_gaugecentre,cr3ea_dryweightovenendoperating,cr3ea_dryweightovenendnonoperating,cr3ea_dryweightovenendcentre,cr3ea_dimensionoperating,cr3ea_dimensionnonoperating,cr3ea_dimensioncentre,cr953_executivename`;

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
          cr3ea_moisture: record.cr3ea_moisture,
          cr3ea_gaugeoperating: record.cr3ea_gaugeoperating,
          cr3ea_gaugenonoperating: record.cr3ea_gaugenonoperating,
          cr3ea_gaugecentre: record.cr3ea_gaugecentre,
          cr3ea_dryweightovenendoperating: record.cr3ea_dryweightovenendoperating,
          cr3ea_dryweightovenendnonoperating: record.cr3ea_dryweightovenendnonoperating,
          cr3ea_dryweightovenendcentre: record.cr3ea_dryweightovenendcentre,
          cr3ea_dimensionoperating: record.cr3ea_dimensionoperating,
          cr3ea_dimensionnonoperating: record.cr3ea_dimensionnonoperating,
          cr3ea_dimensioncentre: record.cr3ea_dimensioncentre,
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
<div class="bs-card-body" style="${initialMaxHeight}margin-top:10px;">
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
<label class="form-label" for="executive-name-${cycleNum}">Executive Name</label>
<input type="text" class="form-control" id="executive-name-${cycleNum}" placeholder="" />
</div>
<div class="form-group" style="display: none;">
<label class="form-label" for="batch-no">Baking Time</label>
<input type="text" class="form-control" id="baking-time" placeholder="" />
</div>
<div class="form-group datepicker-field" style="display: none;">
<label class="form-label" for="packaged">Packaged</label>
<input type="text" class="form-control" id="packagedDatepicker-1" placeholder="" />
</div>
<div class="form-group datepicker-field" style="display: none;">
<label class="form-label" for="expiry">Expiry</label>
<input type="text" class="form-control" id="expiryDatepicker-1" placeholder="" />
</div>
<div class="form-footer">
<button type="button" class="bs-btn bs-btn-primary">Start Session</button>
</div>
</form>
</div>
<div class="tour-cycle-info-wrapper" style="display: none;">
</div>
<div class="tour-cyle-step tour-cyle-step-form bs-fade-elem" style="display: none;">
<div class="tour-cycle-estimation-lists">
<div class="bs-card bs-card-toggler bs-card-light bs-card-sm tour-cycle-estimation-item">
<div class="form-group-title">
<h4 class="bs-card-title">Dry Weight Oven End</h4>
</div>
<div class="estimation-grid" style="display: flex; justify-content: space-between;">
<div class="form-group" style="flex: 1; margin: 10px;">
<label class="form-label" for="operating-dry-weight-${cycleNum}">Operating</label>
<input type="text" class="form-control" id="operating-dry-weight-${cycleNum}" placeholder="Enter value" value="" />
</div>
<div class="form-group" style="flex: 1; margin: 10px;">
<label class="form-label" for="centre-dry-weight-${cycleNum}">Centre</label>
<input type="text" class="form-control" id="centre-dry-weight-${cycleNum}" placeholder="Enter value" value="" />
</div>
<div class="form-group" style="flex: 1; margin: 10px;">
<label class="form-label" for="non-operating-dry-weight-${cycleNum}">Non-Operating</label>
<input type="text" class="form-control" id="non-operating-dry-weight-${cycleNum}" placeholder="Enter value" value="" />
</div>
</div>
</div>
<div class="bs-card bs-card-toggler bs-card-light bs-card-sm tour-cycle-estimation-item">
<div class="form-group-title">
<h4 class="bs-card-title">Dimension</h4>
</div>
<div class="estimation-grid" style="display: flex; justify-content: space-between;">
<div class="form-group" style="flex: 1; margin: 10px;">
<label class="form-label" for="operating-dimension-${cycleNum}">Operating</label>
<input type="text" class="form-control" id="operating-dimension-${cycleNum}" placeholder="Enter value" value="" />
</div>
<div class="form-group" style="flex: 1; margin: 10px;">
<label class="form-label" for="centre-dimension-${cycleNum}">Centre</label>
<input type="text" class="form-control" id="centre-dimension-${cycleNum}" placeholder="Enter value" value="" />
</div>
<div class="form-group" style="flex: 1; margin: 10px;">
<label class="form-label" for="non-operating-dimension-${cycleNum}">Non-Operating</label>
<input type="text" class="form-control" id="non-operating-dimension-${cycleNum}" placeholder="Enter value" value="" />
</div>
</div>
</div>
<div class="bs-card bs-card-toggler bs-card-light bs-card-sm tour-cycle-estimation-item">
<div class="form-group-title">
<h4 class="bs-card-title">Gauge</h4>
</div>
<div class="estimation-grid" style="display: flex; justify-content: space-between;">
<div class="form-group" style="flex: 1; margin: 10px;">
<label class="form-label" for="operating-gauge-${cycleNum}">Operating</label>
<input type="text" class="form-control" id="operating-gauge-${cycleNum}" placeholder="Enter value" value="" />
</div>
<div class="form-group" style="flex: 1; margin: 10px;">
<label class="form-label" for="centre-gauge-${cycleNum}">Centre</label>
<input type="text" class="form-control" id="centre-gauge-${cycleNum}" placeholder="Enter value" value="" />
</div>
<div class="form-group" style="flex: 1; margin: 10px;">
<label class="form-label" for="non-operating-gauge-${cycleNum}">Non-Operating</label>
<input type="text" class="form-control" id="non-operating-gauge-${cycleNum}" placeholder="Enter value" value="" />
</div>
</div>
</div>
<div class="bs-card bs-card-toggler bs-card-light bs-card-sm tour-cycle-estimation-item">
<div class="form-group-title">
<h4 class="bs-card-title">Moisture</h4>
</div>
<div class="estimation-grid" style="display: flex; justify-content: space-between;">
<div class="form-group" style="flex: 1; margin: 10px;">
<input type="text" class="form-control" id="moisture-${cycleNum}" placeholder="Enter value" value="" style="width: 100%; max-width: 330px;" />
</div>
</div>
</div>
</div>
<div class="tour-cycle-estimation-footer">
<button class="bs-btn bs-btn-outline-primary">Cancel</button>
<button type="button" class="bs-btn bs-btn-primary tour-cycle-save-session-btn">Save Session</button>
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
    } else if (cycleData) {
      const completedSection = newCycle.querySelector('.tour-cyle-step-completed');
      const infoWrapper = newCycle.querySelector('.tour-cycle-info-wrapper');
      infoWrapper.style.display = "block";
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
        <div class="bs-card bs-card-light bs-card-sm card-opened">
            <div class="bs-card-header">
                <h4 class="bs-card-title bs-font-color-error">Summary</h4>
            </div>
            <div class="bs-card-body">
                <div class="bs-table-container">
                    <table class="bs-table">
                        <thead>
                          <tr style="border: 1px solid #ebeef4;;">
                            <th colspan="3" style="text-align: center;">Dry Weight Oven End</th>
                            <th colspan="3" style="text-align: center;">Dimension</th>
                            <th colspan="3" style="text-align: center;">Gauges</th>
                            <th rowspan="1" style="text-align: center;">Moisture %</th>
                          </tr>
                          <tr style="border: 1px solid #ebeef4;;">
                            <th style="border: 1px solid #ebeef4; text-align: center;">Operating</th>
                            <th style="border: 1px solid #ebeef4; text-align: center;">Centre</th>
                            <th style="border: 1px solid #ebeef4; text-align: center;">Non Operating</th>
                            <th style="border: 1px solid #ebeef4; text-align: center;">Operating</th>
                            <th style="border: 1px solid #ebeef4; text-align: center;">Centre</th>
                            <th style="border: 1px solid #ebeef4; text-align: center;">Non Operating</th>
                            <th style="border: 1px solid #ebeef4; text-align: center;">Operating</th>
                            <th style="border: 1px solid #ebeef4; text-align: center;">Centre</th>
                            <th style="border: 1px solid #ebeef4; text-align: center;">Non Operating</th>
                            <th style="border: 1px solid #ebeef4; text-align: center;"></th>
                          </tr>
                        </thead>
                        <tbody>
                           <tr>
                            <td style="border: 1px solid #ebeef4;text-align: center;">${cycleData?.cr3ea_dryweightovenendoperating}</td>
                            <td style="border: 1px solid #ebeef4;text-align: center;">${cycleData?.cr3ea_dryweightovenendcentre}</td>
                            <td style="border: 1px solid #ebeef4;text-align: center;">${cycleData?.cr3ea_dryweightovenendnonoperating}</td>
                            <td style="border: 1px solid #ebeef4;text-align: center;">${cycleData?.cr3ea_dimensionoperating}</td>
                            <td style="border: 1px solid #ebeef4;text-align: center;">${cycleData?.cr3ea_dimensioncentre}</td>
                            <td style="border: 1px solid #ebeef4;text-align: center;">${cycleData?.cr3ea_dimensionnonoperating}</td>
                            <td style="border: 1px solid #ebeef4;text-align: center;">${cycleData?.cr3ea_gaugeoperating}</td>
                            <td style="border: 1px solid #ebeef4;text-align: center;">${cycleData?.cr3ea_gaugecentre}</td>
                            <td style="border: 1px solid #ebeef4;text-align: center;">${cycleData?.cr3ea_gaugenonoperating}</td>
                            <td style="border: 1px solid #ebeef4;text-align: center;">${cycleData?.cr3ea_moisture}</td>
                          </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
  console.log("Summary rendered, container innerHTML:", container.innerHTML);
}

// Collect Estimation Data for Saving and Return Processed Data
async function collectEstimationDataCycleSave(cycleNum) {
  const startDataStr = localStorage.getItem(`cycle-${cycleNum}-start-data`);
  const startData = startDataStr ? JSON.parse(startDataStr) : {};
  const savedData = [];
  const cardId = `cycle-${cycleNum}`;
  const card = document.getElementById(cardId);
  const executiveName = startData.executiveName || "N/A";

  if (card) {
    const operatingdryweight = document.getElementById(`operating-dry-weight-${cycleNum}`);
    const centredryweight = document.getElementById(`centre-dry-weight-${cycleNum}`);
    const nonoperatingdryweight = document.getElementById(`non-operating-dry-weight-${cycleNum}`);
    const operatingdimension = document.getElementById(`operating-dimension-${cycleNum}`);
    const centredimension = document.getElementById(`centre-dimension-${cycleNum}`);
    const nonoperatingdimension = document.getElementById(`non-operating-dimension-${cycleNum}`);
    const operatinggauge = document.getElementById(`operating-gauge-${cycleNum}`);
    const centregauge = document.getElementById(`centre-gauge-${cycleNum}`);
    const nonoperatinggauge = document.getElementById(`non-operating-gauge-${cycleNum}`);
    const moisture = document.getElementById(`moisture-${cycleNum}`);
    let data = {
      "cr3ea_qualitytourid": QualityTourId,
      "cr3ea_title": 'QAT_' + moment().format('MM-DD-YYYY'),
      "cr3ea_cycle": `Cycle-${cycleNum}`,
      "cr3ea_shift": sessionStorage.getItem("shiftValue") || "shift 1",
      "cr3ea_tourstartdate": moment().format('MM-DD-YYYY'),
      "cr3ea_observedby": UserName || null,
      "cr3ea_dimensioncentre": centredimension?.value,
      "cr3ea_dimensionnonoperating": nonoperatingdimension?.value,
      "cr3ea_dimensionoperating": operatingdimension?.value,
      "cr3ea_dryweightovenendcentre": centredryweight?.value,
      "cr3ea_dryweightovenendnonoperating": nonoperatingdryweight?.value,
      "cr3ea_dryweightovenendoperating": operatingdryweight?.value,
      "cr3ea_gaugecentre": centregauge?.value,
      "cr3ea_gaugenonoperating": nonoperatinggauge?.value,
      "cr3ea_gaugeoperating": operatinggauge?.value,
      "cr3ea_moisture": moisture?.value,
      "cr3ea_productname": sessionStorage.getItem('product'),
      "cr953_executivename": executiveName
    }
    savedData.push(data);
  }

  if (savedData.length > 0) {
    await saveSectionApiCall(savedData);
    console.log(savedData, "Collected Estimation Data");
  }
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
    const tableName = "cr3ea_prod_productmonitorings";
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