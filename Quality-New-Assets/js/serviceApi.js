QualityTourId = GetQueryStringParams('TourId');
$(document).ready(function () {
  getEmployeeDetails(EmployeeDetailsSuccess, EmployeeDetailsFailure);
  populateCyclePreview();
  showSummaryPage(false);

})

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

function EmployeeDetailsFailure() {

}

// API call for Start session

async function startSessionFn(cycleNum) {
  const cycle = document.getElementById(`bsCardTitle-${cycleNum}`).innerText;
  const product = document.getElementById(`product-input-${cycleNum}`).value;
  const BatchNo = document.getElementById(`batch-no-${cycleNum}`).value;
  const LineNo = document.getElementById(`line-no-${cycleNum}`).value;
  const ExecutiveName = document.getElementById(`executive-name-${cycleNum}`).value;
  const Expiry = document.getElementById(`expiryDatepicker-${cycleNum}`).value;
  const Packaged = document.getElementById(`packagedDatepicker-${cycleNum}`).value;
  sessionStorage.setItem('cycle', cycle)
  sessionStorage.setItem('product', product)
  sessionStorage.setItem('BatchNo', BatchNo)
  sessionStorage.setItem('LineNo', LineNo)
  sessionStorage.setItem('ExecutiveName', ExecutiveName)
  sessionStorage.setItem('Expiry', Expiry)
  sessionStorage.setItem('Packaged', Packaged)
  newFormCycleDisplayFn(cycleNum)
  updateProductNamecbb(cycleNum)
}
//save section for secondary
async function startSessionSecondaryFn(cycleNum) {
  const cycle = document.getElementById(`bs-secondary-CardTitle-${cycleNum}`).innerText;
  const product = document.getElementById(`bs-secondary-product-input-${cycleNum}`).value;
  const BatchNo = document.getElementById(`bs-secondary-batch-no-${cycleNum}`).value;
  const LineNo = document.getElementById(`bs-secondary-line-no-${cycleNum}`).value;
  const ExecutiveName = document.getElementById(`bs-secondary-executive-name-${cycleNum}`).value;
  const Expiry = document.getElementById(`bs-secondary-expiryDatepicker-${cycleNum}`).value;
  const Packaged = document.getElementById(`bs-secondary-packagedDatepicker-${cycleNum}`).value;
  sessionStorage.setItem('cycle', cycle)
  sessionStorage.setItem('product', product)
  sessionStorage.setItem('BatchNo', BatchNo)
  sessionStorage.setItem('LineNo', LineNo)
  sessionStorage.setItem('ExecutiveName', ExecutiveName)
  sessionStorage.setItem('Expiry', Expiry)
  sessionStorage.setItem('Packaged', Packaged)
  newFormCycleDisplaysecondaryFn(cycleNum)
  updateProductNamesecondary(cycleNum)
}
//save section for primary
async function startSessionprimaryFn(cycleNum) {
  const cycle = document.getElementById(`bs-primary-CardTitle-${cycleNum}`).innerText;
  const product = document.getElementById(`bs-primary-product-input-${cycleNum}`).value;
  const BatchNo = document.getElementById(`bs-primary-batch-no-${cycleNum}`).value;
  const LineNo = document.getElementById(`bs-primary-line-no-${cycleNum}`).value;
  const ExecutiveName = document.getElementById(`bs-primary-executive-name-${cycleNum}`).value;
  const Expiry = document.getElementById(`bs-primary-expiryDatepicker-${cycleNum}`).value;
  const Packaged = document.getElementById(`bs-primary-packagedDatepicker-${cycleNum}`).value;
  sessionStorage.setItem('cycle', cycle)
  sessionStorage.setItem('product', product)
  sessionStorage.setItem('BatchNo', BatchNo)
  sessionStorage.setItem('LineNo', LineNo)
  sessionStorage.setItem('ExecutiveName', ExecutiveName)
  sessionStorage.setItem('Expiry', Expiry)
  sessionStorage.setItem('Packaged', Packaged)
  newFormCycleDisplayprimaryFn(cycleNum)
  updateProductNameprimary(cycleNum)
}
//save section for product
async function startSessionProductFn(cycleNum) {
  const cycle = document.getElementById(`bs-product-CardTitle-${cycleNum}`).innerText;
  const product = document.getElementById(`bs-product-product-input-${cycleNum}`).value;
  const BatchNo = document.getElementById(`bs-product-batch-no-${cycleNum}`).value;
  const LineNo = document.getElementById(`bs-product-line-no-${cycleNum}`).value;
  const ExecutiveName = document.getElementById(`bs-product-executive-name-${cycleNum}`).value;
  const Expiry = document.getElementById(`bs-product-expiryDatepicker-${cycleNum}`).value;
  const Packaged = document.getElementById(`bs-product-packagedDatepicker-${cycleNum}`).value;
  sessionStorage.setItem('cycle', cycle)
  sessionStorage.setItem('product', product)
  sessionStorage.setItem('BatchNo', BatchNo)
  sessionStorage.setItem('LineNo', LineNo)
  sessionStorage.setItem('ExecutiveName', ExecutiveName)
  sessionStorage.setItem('Expiry', Expiry)
  sessionStorage.setItem('Packaged', Packaged)
  newFormCycleDisplayproductFn(cycleNum)
  updateProductNameproduct(cycleNum)
}

//function is used to display based on cycle actions
function newFormCycleDisplayFn(cycleNum) {
  const currentParentPanel = document.querySelector(`.tour-cycle-panel-${cycleNum}`);
  if (!currentParentPanel) {
    console.error("Error: .tour-cycle-panel not found");
    return;
  }
  const currenParentPanelBody = currentParentPanel.querySelector('.bs-card-body');
  if (!currenParentPanelBody) {
    console.error("Error: .bs-card-body not found");
    return;
  }
  const stepElement = document.querySelector(`.tour-cyle-step-start-${cycleNum}`);
  const stepStartElement = document.querySelector(`.tour-cyle-step-start-${cycleNum}`);
  const stepFormElement = document.querySelector(`.tour-cyle-step-form-${cycleNum}`);
  const infoWrapperElement = document.querySelector(`.tour-cycle-info-wrapper-${cycleNum}`);

  if (!stepElement || !stepStartElement || !stepFormElement || !infoWrapperElement) {
    console.error("Error: One or more required elements not found");
    return;
  }
  stepElement.classList.remove("bs-fade-in");
  setTimeout(function () {
    stepStartElement.classList.remove("bs-fade-active");
    stepFormElement.classList.remove("bs-fade-in");

    setTimeout(function () {
      infoWrapperElement.classList.add("bs-fade-in");
      infoWrapperElement.classList.add("bs-fade-active")
      stepFormElement.classList.add("bs-fade-in");
      stepFormElement.classList.add("bs-fade-active")

      currenParentPanelBody.style.maxHeight =
        currenParentPanelBody.offsetHeight +
        infoWrapperElement.scrollHeight +
        stepFormElement.scrollHeight + 'px';

      console.log("Updated maxHeight:", currenParentPanelBody.style.maxHeight);
    }, 10);
  }, 300);
}
//function is used to display based on cycle actions secondary
function newFormCycleDisplaysecondaryFn(cycleNum) {
  const currentParentPanel = document.querySelector(`.secondary-tour-cycle-panel-${cycleNum}`);
  if (!currentParentPanel) {
    console.error("Error: .tour-cycle-panel not found");
    return;
  }
  const currenParentPanelBody = currentParentPanel.querySelector('.bs-card-body');
  if (!currenParentPanelBody) {
    console.error("Error: .bs-card-body not found");
    return;
  }
  const stepElement = document.querySelector(`.secondary-tour-cyle-step-start-${cycleNum}`);
  const stepStartElement = document.querySelector(`.secondary-tour-cyle-step-start-${cycleNum}`);
  const stepFormElement = document.querySelector(`.secondary-tour-cyle-step-form-${cycleNum}`);
  const infoWrapperElement = document.querySelector(`.secondary-tour-cycle-info-wrapper-${cycleNum}`);

  if (!stepElement || !stepStartElement || !stepFormElement || !infoWrapperElement) {
    console.error("Error: One or more required elements not found");
    return;
  }
  stepElement.classList.remove("bs-fade-in");
  setTimeout(function () {
    stepStartElement.classList.remove("bs-fade-active");
    stepFormElement.classList.remove("bs-fade-in");

    setTimeout(function () {
      infoWrapperElement.classList.add("bs-fade-in");
      infoWrapperElement.classList.add("bs-fade-active")
      stepFormElement.classList.add("bs-fade-in");
      stepFormElement.classList.add("bs-fade-active")

      currenParentPanelBody.style.maxHeight =
        currenParentPanelBody.offsetHeight +
        infoWrapperElement.scrollHeight +
        stepFormElement.scrollHeight + 'px';

      console.log("Updated maxHeight:", currenParentPanelBody.style.maxHeight);
    }, 10);
  }, 300);
}
//function is used to display based on cycle actions primary
function newFormCycleDisplayprimaryFn(cycleNum) {
  const currentParentPanel = document.querySelector(`.primary-tour-cycle-panel-${cycleNum}`);
  if (!currentParentPanel) {
    console.error("Error: .tour-cycle-panel not found");
    return;
  }
  const currenParentPanelBody = currentParentPanel.querySelector('.bs-card-body');
  if (!currenParentPanelBody) {
    console.error("Error: .bs-card-body not found");
    return;
  }
  const stepElement = document.querySelector(`.primary-tour-cyle-step-start-${cycleNum}`);
  const stepStartElement = document.querySelector(`.primary-tour-cyle-step-start-${cycleNum}`);
  const stepFormElement = document.querySelector(`.primary-tour-cyle-step-form-${cycleNum}`);
  const infoWrapperElement = document.querySelector(`.primary-tour-cycle-info-wrapper-${cycleNum}`);

  if (!stepElement || !stepStartElement || !stepFormElement || !infoWrapperElement) {
    console.error("Error: One or more required elements not found");
    return;
  }
  stepElement.classList.remove("bs-fade-in");
  setTimeout(function () {
    stepStartElement.classList.remove("bs-fade-active");
    stepFormElement.classList.remove("bs-fade-in");

    setTimeout(function () {
      infoWrapperElement.classList.add("bs-fade-in");
      infoWrapperElement.classList.add("bs-fade-active")
      stepFormElement.classList.add("bs-fade-in");
      stepFormElement.classList.add("bs-fade-active")

      currenParentPanelBody.style.maxHeight =
        currenParentPanelBody.offsetHeight +
        infoWrapperElement.scrollHeight +
        stepFormElement.scrollHeight + 'px';

      console.log("Updated maxHeight:", currenParentPanelBody.style.maxHeight);
    }, 10);
  }, 300);
}
//function is used to display based on cycle actions product
function newFormCycleDisplayproductFn(cycleNum) {
  const currentParentPanel = document.querySelector(`.product-tour-cycle-panel-${cycleNum}`);
  if (!currentParentPanel) {
    console.error("Error: .tour-cycle-panel not found");
    return;
  }
  const currenParentPanelBody = currentParentPanel.querySelector('.bs-card-body');
  if (!currenParentPanelBody) {
    console.error("Error: .bs-card-body not found");
    return;
  }
  const stepElement = document.querySelector(`.product-tour-cyle-step-start-${cycleNum}`);
  const stepStartElement = document.querySelector(`.product-tour-cyle-step-start-${cycleNum}`);
  const stepFormElement = document.querySelector(`.product-tour-cyle-step-form-${cycleNum}`);
  const infoWrapperElement = document.querySelector(`.product-tour-cycle-info-wrapper-${cycleNum}`);

  if (!stepElement || !stepStartElement || !stepFormElement || !infoWrapperElement) {
    console.error("Error: One or more required elements not found");
    return;
  }
  stepElement.classList.remove("bs-fade-in");
  setTimeout(function () {
    stepStartElement.classList.remove("bs-fade-active");
    stepFormElement.classList.remove("bs-fade-in");

    setTimeout(function () {
      infoWrapperElement.classList.add("bs-fade-in");
      infoWrapperElement.classList.add("bs-fade-active")
      stepFormElement.classList.add("bs-fade-in");
      stepFormElement.classList.add("bs-fade-active")

      currenParentPanelBody.style.maxHeight =
        currenParentPanelBody.offsetHeight +
        infoWrapperElement.scrollHeight +
        stepFormElement.scrollHeight + 'px';

      console.log("Updated maxHeight:", currenParentPanelBody.style.maxHeight);
    }, 10);
  }, 300);
}

function updatetheForm() {
  document.querySelector('.tour-cyle-step').classList.remove('bs-fade-in');
  const currentParentPanel = form.closest('.tour-cycle-panel');
  const currenParentPanelBody = currentParentPanel.querySelector('.bs-card-body');

  const tourCyleStepStart = currentParentPanel.querySelector('.tour-cyle-step-start');
  const tourCyleStepInfoElem = currentParentPanel.querySelector('.tour-cycle-info-wrapper');
  const tourCyleStepForm = currentParentPanel.querySelector('.tour-cyle-step-form');

  tourCyleStepStart.classList.remove('bs-fade-in');
  setTimeout(function () {
    tourCyleStepStart.classList.remove('bs-fade-active');

    tourCyleStepInfoElem.classList.add('bs-fade-active');
    tourCyleStepForm.classList.add('bs-fade-active');
    setTimeout(function () {
      tourCyleStepInfoElem.classList.add('bs-fade-in');
      tourCyleStepForm.classList.add('bs-fade-in');
      // update the parent accordion body
      currenParentPanelBody.style.maxHeight =
        currenParentPanelBody.offsetHeight + tourCyleStepInfoElem.scrollHeight + tourCyleStepForm.scrollHeight + 'px';
    }, 10);
  }, 300);
}
//for cbb save section api body
function collectEstimationDataCycleSave(cycleNum) {
  const savedData = [];
  const j = cycleNum;

  for (let i = 1; i <= 10; i++) {
    const cardId = `cbb-${j}-${i}`;
    const evaluation = `CBB ${i}`
    const card = document.getElementById(cardId);

    if (card) {
      const selectedBadge = card.querySelector(".badge-fill"); // Find selected badge
      const cr3ea_criteria = selectedBadge ? selectedBadge.innerText.trim() : null;

      if (cr3ea_criteria !== null) {
        let data = {
          cr3ea_evaluationtype: evaluation,
          cr3ea_criteria: cr3ea_criteria,
          cr3ea_cycle: `Cycle-${cycleNum}`,
          cr3ea_title: 'QA_' + moment().format('MM-DD-YYYY'),
          cr3ea_expiry: sessionStorage.getItem("Expiry"),
          cr3ea_shift: sessionStorage.getItem("shiftValue"),
          cr3ea_batchno: sessionStorage.getItem("BatchNo"),
          cr3ea_lineno: sessionStorage.getItem("LineNo"),
          cr953_executivename: sessionStorage.getItem("ExecutiveName"),
          cr3ea_category: 'CBB Evaluation',
          cr3ea_pkd: sessionStorage.getItem("Packaged"),
          cr3ea_tourstartdate: moment().format('MM-DD-YYYY'),
          cr3ea_productname: sessionStorage.getItem("product"),
          cr3ea_observedby: UserName,
          cr3ea_qualitytourid: QualityTourId
        };

        if (cr3ea_criteria === "Not Okay") {
          const categoryEl = document.querySelector(`input[name="not-okay-category-${j}-${i}"]:checked`);
          const defectEl = document.getElementById(`not-okay-defect-${j}-${i}`);
          const remarksEl = document.getElementById(`not-okay-remarks-no-${j}-${i}`);

          data.cr3ea_defectcategory = categoryEl ? categoryEl.value : null;
          data.cr3ea_defect = defectEl?.value || null;
          data.cr3ea_defectremarks = remarksEl?.value || null;

        }
        savedData.push(data);
      }
    }
  }
  savesectionApicall(savedData)
  console.log(savedData, "Collected Estimation Data");
}
//for secondary save section api body
function collectEstimationDataCyclesecondarySave(cycleNum) {
  const savedData = [];
  const j = cycleNum;

  for (let i = 1; i <= 10; i++) {
    const cardId = `sp-${j}-${i}`;
    const evaluation = `SP ${i}`
    const card = document.getElementById(cardId);

    if (card) {
      const selectedBadge = card.querySelector(".badge-fill"); // Find selected badge
      const cr3ea_criteria = selectedBadge ? selectedBadge.innerText.trim() : null;

      if (cr3ea_criteria !== null) {
        let data = {
          cr3ea_evaluationtype: evaluation,
          cr3ea_criteria: cr3ea_criteria,
          cr3ea_cycle: `Cycle-${cycleNum}`,
          cr3ea_title: 'QA_' + moment().format('MM-DD-YYYY'),
          cr3ea_expiry: sessionStorage.getItem("Expiry"),
          cr3ea_shift: sessionStorage.getItem("shiftValue"),
          cr3ea_batchno: sessionStorage.getItem("BatchNo"),
          cr3ea_lineno: sessionStorage.getItem("LineNo"),
          cr953_executivename: sessionStorage.getItem("ExecutiveName"),
          cr3ea_category: 'Secondary',
          cr3ea_pkd: sessionStorage.getItem("Packaged"),
          cr3ea_tourstartdate: moment().format('MM-DD-YYYY'),
          cr3ea_productname: sessionStorage.getItem("product"),
          cr3ea_observedby: UserName,
          cr3ea_qualitytourid: QualityTourId
        };

        if (cr3ea_criteria === "Not Okay") {
          const categoryEl = document.querySelector(`input[name="secondary-not-okay-category-${j}-${i}"]:checked`);
          const defectEl = document.getElementById(`secondary-not-okay-defect-${j}-${i}`);
          const remarksEl = document.getElementById(`secondary-not-okay-remarks-no-${j}-${i}`);

          data.cr3ea_defectcategory = categoryEl ? categoryEl.value : null;
          data.cr3ea_defect = defectEl?.value || null;
          data.cr3ea_defectremarks = remarksEl?.value || null;

        }
        savedData.push(data);
      }
    }
  }
  savesectionApicall(savedData)
  console.log(savedData, "Collected Estimation Data");
}
//for primary save section api body
function collectEstimationDataCycleprimarySave(cycleNum) {
  const savedData = [];
  const j = cycleNum;

  for (let i = 1; i <= 10; i++) {
    const cardId = `pp-${j}-${i}`;
    const evaluation = `PP ${i}`
    const card = document.getElementById(cardId);

    if (card) {
      const selectedBadge = card.querySelector(".badge-fill"); // Find selected badge
      const cr3ea_criteria = selectedBadge ? selectedBadge.innerText.trim() : null;

      if (cr3ea_criteria !== null) {
        let data = {
          cr3ea_evaluationtype: evaluation,
          cr3ea_criteria: cr3ea_criteria,
          cr3ea_cycle: `Cycle-${cycleNum}`,
          cr3ea_title: 'QA_' + moment().format('MM-DD-YYYY'),
          cr3ea_expiry: sessionStorage.getItem("Expiry"),
          cr3ea_shift: sessionStorage.getItem("shiftValue"),
          cr3ea_batchno: sessionStorage.getItem("BatchNo"),
          cr3ea_lineno: sessionStorage.getItem("LineNo"),
          cr953_executivename: sessionStorage.getItem("ExecutiveName"),
          cr3ea_category: 'Primary',
          cr3ea_pkd: sessionStorage.getItem("Packaged"),
          cr3ea_tourstartdate: moment().format('MM-DD-YYYY'),
          cr3ea_productname: sessionStorage.getItem("product"),
          cr3ea_observedby: UserName,
          cr3ea_qualitytourid: QualityTourId
        };

        if (cr3ea_criteria === "Not Okay") {
          const categoryEl = document.querySelector(`input[name="primary-not-okay-category-${j}-${i}"]:checked`);
          const defectEl = document.getElementById(`primary-not-okay-defect-${j}-${i}`);
          const remarksEl = document.getElementById(`primary-not-okay-remarks-no-${j}-${i}`);

          data.cr3ea_defectcategory = categoryEl ? categoryEl.value : null;
          data.cr3ea_defect = defectEl?.value || null;
          data.cr3ea_defectremarks = remarksEl?.value || null;

        }
        savedData.push(data);
      }
    }
  }
  savesectionApicall(savedData)
  console.log(savedData, "Collected Estimation Data");
}
//for product save section api body
function collectEstimationDataCycleproductSave(cycleNum) {
  const savedData = [];
  const j = cycleNum;

  for (let i = 1; i <= 10; i++) {
    const cardId = `pr-${j}-${i}`;
    const evaluation = `PP ${i}`
    const card = document.getElementById(cardId);

    if (card) {
      const selectedBadge = card.querySelector(".badge-fill"); // Find selected badge
      const cr3ea_criteria = selectedBadge ? selectedBadge.innerText.trim() : null;

      if (cr3ea_criteria !== null) {
        let data = {
          cr3ea_evaluationtype: evaluation,
          cr3ea_criteria: cr3ea_criteria,
          cr3ea_cycle: `Cycle-${cycleNum}`,
          cr3ea_title: 'QA_' + moment().format('MM-DD-YYYY'),
          cr3ea_expiry: sessionStorage.getItem("Expiry"),
          cr3ea_shift: sessionStorage.getItem("shiftValue"),
          cr3ea_batchno: sessionStorage.getItem("BatchNo"),
          cr3ea_lineno: sessionStorage.getItem("LineNo"),
          cr953_executivename: sessionStorage.getItem("ExecutiveName"),
          cr3ea_category: 'Product',
          cr3ea_pkd: sessionStorage.getItem("Packaged"),
          cr3ea_tourstartdate: moment().format('MM-DD-YYYY'),
          cr3ea_productname: sessionStorage.getItem("product"),
          cr3ea_observedby: UserName,
          cr3ea_qualitytourid: QualityTourId
        };

        if (cr3ea_criteria === "Not Okay") {
          const categoryEl = document.querySelector(`input[name="product-not-okay-category-${j}-${i}"]:checked`);
          const defectEl = document.getElementById(`product-not-okay-defect-${j}-${i}`);
          const remarksEl = document.getElementById(`product-not-okay-remarks-no-${j}-${i}`);

          data.cr3ea_defectcategory = categoryEl ? categoryEl.value : null;
          data.cr3ea_defect = defectEl?.value || null;
          data.cr3ea_defectremarks = remarksEl?.value || null;

        }
        savedData.push(data);
      }
    }
  }
  savesectionApicall(savedData)
  console.log(savedData, "Collected Estimation Data");
}





//function used to save section productSelect
async function savesectionApicall(data) {
  var AccessToken = await getAccessToken();
   // Disable all buttons while API is running
   const buttons = document.querySelectorAll("button");
   buttons.forEach(button => button.disabled = true);
  if (!AccessToken) {
    console.error("Access token is invalid or missing");
    alert("Access token is invalid or missing");
    return;
  }

  var header = {
    "Accept": "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "OData-MaxVersion": "4.0",
    "OData-Version": "4.0",
    "Prefer": "return=representation",
    "Authorization": "Bearer " + AccessToken
  };

  var apiVersion = "9.2";
  var tableName = "cr3ea_prod_pqi_fronts";
  var apiUrl = environmentUrl + "/api/data/v" + apiVersion + "/" + tableName;
  for (const record of data) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(record),
      });

      if (!response.ok) {
        throw new Error(`Failed to save record: ${response.status}`);
      }

      const responseData = await response.json();
      sessionStorage.setItem('cycle', '')
      sessionStorage.setItem('product', '')
      sessionStorage.setItem('BatchNo', '')
      sessionStorage.setItem('LineNo', '')
      sessionStorage.setItem('ExecutiveName', '')
      sessionStorage.setItem('Expiry', '')
      sessionStorage.setItem('Packaged', '')
      console.log('Record created:', responseData);

      const uniqueId = responseData.cr3ea_pqi_frontid; // Return the newly created ID

      populateCyclePreview();
      showSummaryPage(false);
      // Enable all buttons while API is running
    buttons.forEach(button => button.disabled = false);
    } catch (error) {
      console.error('Error creating record:', error);
      return null;
    }
  }
}
// Summary dispaly functions

// Attach event listener to the toggle button
document.getElementById('toggleButton').addEventListener('click', toggleSummary);

// Function to fetch and display the summary data
async function showSummaryPage(isToggled) {
  const AccessToken = await getAccessToken();
  if (!AccessToken) {
    console.error("Access token is invalid or missing");
    alert("Access token is invalid or missing");
    return;
  }

  const header = {
    "Accept": "application/json",
    "Authorization": "Bearer " + AccessToken
  };

  const apiVersion = "9.2";
  const tableName = "cr3ea_prod_pqi_fronts";
  const apiUrl = `${environmentUrl}/api/data/v${apiVersion}/${tableName}?$filter=cr3ea_qualitytourid eq '${QualityTourId}'`;

  try {
    const response = await fetch(apiUrl, { headers: header });
    if (!response.ok) throw new Error("Error fetching data");

    const responseData = await response.json();
    console.log("Fetched Records:", responseData);

    if (!responseData.value || responseData.value.length === 0) {
      document.getElementById('planTourSummary').style.display = 'none';
      return;
    }

    document.getElementById('planTourSummary').style.display = 'block';

    if (!isToggled) {
      displaySummary(responseData.value);
      populateTable(responseData.value);
    } else {
      populateTable(responseData.value);
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

// Display the summary of defects by category
function displaySummary(data) {
  const defectCount = data.filter(item => item.cr3ea_criteria === 'Not Okay').length;
  document.getElementById('totalDefectsBadge').textContent = `${defectCount} Defects`;
}

// Process data by category and count defects
function processData(data) {
  const summary = {};
  const uniqueCycles = new Set();

  data.forEach(item => {
    const category = item.cr3ea_category || 'Unknown';
    const cycle = item.cr3ea_cycle;

    if (cycle) {
      uniqueCycles.add(cycle);
    }

    if (!summary[category]) {
      summary[category] = { okays: 0, aDefects: 0, bDefects: 0, cDefects: 0 };
    }

    if (item.cr3ea_criteria === 'Okay') {
      summary[category].okays++;
    } else {
      if (item.cr3ea_defectcategory === 'Category A') summary[category].aDefects++;
      if (item.cr3ea_defectcategory === 'Category B') summary[category].bDefects++;
      if (item.cr3ea_defectcategory === 'Category C') summary[category].cDefects++;
    }
  });

  // Return both summary and cycle count
  return {
    summary,
    totalCycles: uniqueCycles.size
  };
}

// Populate the table with data
function populateTable(data) {
  const tbody = document.getElementById('summaryTableBody');
  tbody.innerHTML = '';

  const { summary, totalCycles } = processData(data);
  console.log(summary, totalCycles);

  // Individual bonus scores
  let bonusScores = {
    cbb: 0,
    secondary: 0,
    primary: 0,
    product: 0
  };

  Object.entries(summary).forEach(([category, counts]) => {
    const row = document.createElement('tr');
    let maxPotentialScore = 0;
    let bonusMultiplier = 0.10; // Default

    if (category === "CBB Evaluation") {
      maxPotentialScore = 10 * 120 * totalCycles;
      bonusMultiplier = 0.10;
    } else if (category === "Secondary") {
      maxPotentialScore = 120 * 2 * totalCycles;
      bonusMultiplier = 0.15;
    } else if (category === "Primary") {
      maxPotentialScore = 120 * 2 * totalCycles;
      bonusMultiplier = 0.20;
    } else if (category === "Product") {
      maxPotentialScore = 120 * 2 * totalCycles;
      bonusMultiplier = 0.40;
    }

    const scoreDeduction = (counts.aDefects * 80) + (counts.bDefects * 30) + (counts.cDefects * 10);
    const finalScore = Math.max(maxPotentialScore - scoreDeduction, 0);
    const scorePercentageValue = maxPotentialScore > 0 ? (finalScore / maxPotentialScore) * 100 : 0;
    const scorePercentage = scorePercentageValue.toFixed(2) + '%';
    const bonusScoreValue = scorePercentageValue * bonusMultiplier;
    const bonusScore = bonusScoreValue.toFixed(2) + '%';

    // Store bonus scores individually
    if (category === "CBB Evaluation") bonusScores.cbb = bonusScoreValue;
    else if (category === "Secondary") bonusScores.secondary = bonusScoreValue;
    else if (category === "Primary") bonusScores.primary = bonusScoreValue;
    else if (category === "Product") bonusScores.product = bonusScoreValue;

    row.innerHTML = `
      <td class="td-bold">${category}</td>
      <td>${counts.okays}</td>
      <td>${counts.aDefects}</td>
      <td>${counts.bDefects}</td>
      <td>${counts.cDefects}</td>
      <td>${totalCycles}</td>
      <td>${maxPotentialScore}</td>
      <td>${scoreDeduction}</td>
      <td>${finalScore}</td>
      <td>${scorePercentage}</td>
      <td>${bonusScore}</td>
    `;
    tbody.appendChild(row);
  });

  // Net Wt.
  const netWtCycles = totalCycles;
  const netWtMaxScore = netWtCycles * 120 * 15.625;
  const netWtScoreObtained = netWtMaxScore;
  const netWtScorePercentage = 100.00;
  const netWtBonusScoreValue = netWtScorePercentage * 0.15;

  const netWtRow = document.createElement('tr');
  netWtRow.innerHTML = `
    <td class="td-bold">Net Wt.</td>
    <td colspan="4" style="text-align: center;"></td>
    <td>${netWtCycles}</td>
    <td>${netWtMaxScore}</td>
    <td>0</td>
    <td>${netWtScoreObtained}</td>
    <td>${netWtScorePercentage.toFixed(2)}%</td>
    <td>${netWtBonusScoreValue.toFixed(2)}%</td>
  `;
  tbody.appendChild(netWtRow);

  // Broken %
  const brokenPercentage = 0.00;
  const brokenRow = document.createElement('tr');
  brokenRow.innerHTML = `
    <td class="td-bold">Broken %</td>
    <td colspan="10" style="text-align: center;">${brokenPercentage.toFixed(2)}%</td>
  `;
  tbody.appendChild(brokenRow);

  // Final PQI Score = sum of all bonus scores - broken%
  const finalPQIScore = (
    bonusScores.cbb +
    bonusScores.secondary +
    bonusScores.primary +
    bonusScores.product +
    netWtBonusScoreValue
  ) - brokenPercentage;

  const finalPqiRow = document.createElement('tr');
  finalPqiRow.innerHTML = `
    <td class="td-bold">Final PQI Score post deduction of broken</td>
    <td colspan="10" style="text-align: center;">${finalPQIScore.toFixed(2)}%</td>
  `;
  tbody.appendChild(finalPqiRow);

  const pqiStatus = finalPQIScore >= 90 ? 'PASS' : 'HOLD';
  const statusRow = document.createElement('tr');
  statusRow.innerHTML = `
    <td class="td-bold">PQI Status</td>
    <td colspan="10" style="text-align: center; background-color: ${pqiStatus === 'PASS' ? '#28a745' : '#dc3545'}; color: white;">
      ${pqiStatus}
    </td>
  `;
  tbody.appendChild(statusRow);
}



async function toggleSummary() {
  const summaryWrapper = document.querySelector('.bs-card-body');
  const isHidden = summaryWrapper.classList.contains('hidden');
  const button = document.getElementById('toggleButton');

  if (isHidden) {
    // Fetch and display data before showing the table
    await showSummaryPage(true);
    summaryWrapper.classList.remove('hidden');
    button.textContent = 'View less';
  } else {
    summaryWrapper.classList.add('hidden');
    button.textContent = 'View more';
  }
}


// View details handler
function viewDetails(category) {
  alert(`Viewing details for category: ${category}`);
}

// Initial call to display summary on page load
showSummaryPage(false);


// Priview code

async function populateCyclePreview() {
  try {
    const AccessToken = await getAccessToken();
    if (!AccessToken) {
      console.error("Access token is invalid or missing");
      alert("Access token is invalid or missing");
      return;
    }

    const header = {
      "Accept": "application/json",
      "Authorization": `Bearer ${AccessToken}`
    };

    const apiVersion = "9.2";
    const tableName = "cr3ea_prod_pqi_fronts";
    const apiUrl = `${environmentUrl}/api/data/v${apiVersion}/${tableName}?$filter=cr3ea_qualitytourid eq '${QualityTourId}'`;

    const response = await fetch(apiUrl, { headers: header });
    if (!response.ok) throw new Error("Error fetching data");

    const responseData = await response.json();
    console.log("Fetched Records:", responseData);

    const summaryData = processDataForPreview(responseData.value);
    console.log("Processed Summary Data:", summaryData);

    // Iterate through categories
    Object.entries(summaryData).forEach(([category, categoryData]) => {
      // Iterate through cycles within each category
      Object.entries(categoryData.cycles).forEach(([cycle, cycleData]) => {
        const safeGeneratedId = `${categoryData?.generatedId}_${cycle.replace(/[-\s]+/g, '').toLowerCase()}`;

        // Populate defects table
        populateDefectsTable(safeGeneratedId, cycleData.defects);

        // Populate okays section
        populateResultSection(safeGeneratedId, 'okays', cycleData.okays);

        // Populate missed/defects section
        populateResultSection(safeGeneratedId, 'missed', cycleData.defects);
      });
    });

  } catch (error) {
    console.error("Error populating cycle preview:", error);
  }
}

function processDataForPreview(data) {
  return data.reduce((summaryData, item) => {
    const mainCategory = item.cr3ea_category || 'Unknown_Category';
    const cycle = item.cr3ea_cycle || 'Unknown_Cycle';

    // Create a unique generated ID for the main category
    const generatedId = mainCategory.replace(/\s+/g, '').toLowerCase();

    // Initialize category data if not exists
    if (!summaryData[mainCategory]) {
      summaryData[mainCategory] = {
        category: mainCategory,
        generatedId: generatedId,
        cycles: {}
      };
    }

    // Initialize cycle data within the category if not exists
    if (!summaryData[mainCategory].cycles[cycle]) {
      summaryData[mainCategory].cycles[cycle] = {
        okays: [],
        defects: {}
      };
    }

    // Process based on criteria
    if (item.cr3ea_criteria === 'Okay') {
      summaryData[mainCategory].cycles[cycle].okays.push(item);
    } else if (item.cr3ea_criteria === 'Not Okay') {
      const defectCategory = item.cr3ea_defectcategory || 'Uncategorized';

      // Ensure defect category exists for this cycle
      if (!summaryData[mainCategory].cycles[cycle].defects[defectCategory]) {
        summaryData[mainCategory].cycles[cycle].defects[defectCategory] = [];
      }

      // Add the defect item
      summaryData[mainCategory].cycles[cycle].defects[defectCategory].push(item);
    }

    return summaryData;
  }, {});
}

function populateDefectsTable(generatedId, defects) {
  // Find the table body for this specific generated ID
  const tableBody = document.getElementById(`defectsTableBody_${generatedId}`);

  if (!tableBody) {
    console.warn(`No table body found for ID: defectsTableBody_${generatedId}`);
    return;
  }

  // Extract the category and cycle parts from generatedId
  const [categoryPart, cyclePart] = generatedId.split('_');
  console.log(categoryPart, "categoryPart");
  console.log(cyclePart, "cyclePart");

  // Flatten defects from all categories
  const defectEntries = Object.values(defects).flat().filter(item => {
    // Normalize the item's category and cycle for comparison
    const itemCategory = item.cr3ea_category.replace(/\s+/g, '').toLowerCase();
    // Remove hyphens and convert to lowercase
    const itemCycle = item.cr3ea_cycle.replace(/[-\s]+/g, '').toLowerCase();
    const filterCyclePart = cyclePart.replace(/[-\s]+/g, '').toLowerCase();

    // Check both category and cycle
    return itemCategory === categoryPart.toLowerCase() &&
      itemCycle === filterCyclePart;
  });

  // Populate table
  tableBody.innerHTML = defectEntries.length
    ? defectEntries.map(item => `
      <tr>
        <td class="td-bold">${item.cr3ea_evaluationtype || 'N/A'}</td>
        <td>${item.cr3ea_defectcategory || 'N/A'}</td>
        <td>${item.cr3ea_defect || 'N/A'}</td>
        <td>${item.cr3ea_defectremarks || 'N/A'}</td>
      </tr>`
    ).join('')
    : '<tr><td colspan="4" class="td-bold">No Defects</td></tr>';
}

function populateResultSection(generatedId, type, data) {
  const resultList = document.getElementById(`${type}List_${generatedId}`);
  if (resultList && resultList.children.length > 0) {
    const element = document.getElementById(`${type}List_${generatedId}`);
    // const currentParentPanel = element.closest(".bs-card");
    const id = `${type}List_${generatedId}`
    const matchtxt = id.match(/_(.*?)_/);
    const extractedText = matchtxt[1];
    const matchNum = id.match(/\d+$/);
    const cycleNum = parseInt(matchNum[0], 10);
    handleTourCycle(extractedText, element);
  } else {
    console.log("Table body is empty");
  }

  if (!resultList) {
    console.warn(`No result list found for ID: ${type}List_${generatedId}`);
    return;
  }

  // Extract the category and cycle parts from generatedId
  const [categoryPart, cyclePart] = generatedId.split('_');

  if (type === 'missed') {
    // Flatten the data and filter
    const defectEntries = Object.values(data).flat().filter(item => {
      // Normalize the item's category and cycle for comparison
      const itemCategory = item.cr3ea_category.replace(/\s+/g, '').toLowerCase();
      // Remove hyphens and convert to lowercase
      const itemCycle = item.cr3ea_cycle.replace(/[-\s]+/g, '').toLowerCase();
      const filterCyclePart = cyclePart.replace(/[-\s]+/g, '').toLowerCase();

      // Check both category and cycle
      return itemCategory === categoryPart.toLowerCase() &&
        itemCycle === filterCyclePart && item.cr3ea_criteria == "Not Okay"
    });

    resultList.innerHTML = defectEntries.length
      ? defectEntries.map(item => `
          <p class="list-item">${item.cr3ea_evaluationtype || 'Unknown'}</p>
        `).join('')
      : '<p class="list-item">No Missed Defects</p>';
    const cyclePreview= document.getElementById(`defectsTableBody_${generatedId}`);
    const badgeElement = cyclePreview.closest(".bs-card-toggler").querySelector(".badge-error");
    if (badgeElement) {
        badgeElement.style.display = "block";
        badgeElement.innerText = `${defectEntries.length} Defects`; 
    }
  } else {
    // Flatten and filter data based on category and cycle
    const filteredData = (Array.isArray(data) ? data : Object.values(data)).flat().filter(item => {
      const itemCategory = item.cr3ea_category.replace(/\s+/g, '').toLowerCase();
      // Remove hyphens and convert to lowercase
      const itemCycle = item.cr3ea_cycle.replace(/[-\s]+/g, '').toLowerCase();
      const filterCyclePart = cyclePart.replace(/[-\s]+/g, '').toLowerCase();

      return itemCategory === categoryPart.toLowerCase() &&
        itemCycle === filterCyclePart && item.cr3ea_criteria == "Okay"
    });

    resultList.innerHTML = filteredData.length
      ? filteredData.map(item => `<p class="list-item">${item.cr3ea_evaluationtype || 'Unknown'}</p>`).join('')
      : `<p class="list-item">No ${type.charAt(0).toUpperCase() + type.slice(1)}</p>`;
  }
}

function handleTourCycle(extractedText, element) {
  const currentParentPanel = element.closest('.tour-cycle-panel');
  const currenParentPanelBody = currentParentPanel.querySelector('.bs-card-body');
  const tourCyleStepResult = currentParentPanel.querySelector('.tour-cyle-step-completed');
  const tourCyleStepForm = currentParentPanel.querySelector('.tour-cyle-step-form');
  const planTourSummary = document.getElementById('planTourSummary');
  const tourCyleStepStart = currentParentPanel.querySelector('.tour-cyle-step-start');

  tourCyleStepForm.classList.remove('bs-fade-in');
  tourCyleStepStart.classList.remove('bs-fade-in');

  setTimeout(() => {
    tourCyleStepStart.classList.remove('bs-fade-active');
    tourCyleStepForm.classList.remove('bs-fade-active');
    tourCyleStepResult.classList.add('bs-fade-active');
    planTourSummary.classList.add('bs-fade-active');

    setTimeout(() => {
      tourCyleStepResult.classList.add('bs-fade-in');
      planTourSummary.classList.add('bs-fade-in');
      currenParentPanelBody.style.maxHeight = null;

      const nextPanel = currentParentPanel.nextElementSibling;
      if (nextPanel) {
        const nextPanelBody = nextPanel.querySelector('.bs-card-body');
        nextPanelBody.style.maxHeight = '100%';
      }
    }, 10);
  }, 300);

  const panelId = currentParentPanel.id;
  let newCycleId = incrementCycleId(panelId);
  let nextElement = document.getElementById(newCycleId);
  let nextCycleId = newCycleId ? incrementCycleId(newCycleId) : null;
  let nextCycleElement = nextCycleId ? document.getElementById(nextCycleId) : null;

  if (nextElement) {
    nextElement.style.display = "block";
  }
  if (nextCycleElement) {
    nextCycleElement.style.display = "block";
  }
}


// Example call
populateCyclePreview();
