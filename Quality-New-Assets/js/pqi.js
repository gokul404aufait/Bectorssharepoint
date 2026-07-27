// Global variables
let cycleCounter = 1;
QualityTourId = GetQueryStringParams('TourId');

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
function EmployeeDetailsFailure() { }

// ============================================================
// Tabs config (Crates / Packs / Product / Net Weight)
// NOTE: `count` here = items per SET
// ============================================================
const QUALITY_TABS = [
  { key: "CRATES", label: "Crates", count: 15 },
  { key: "PACKS", label: "Packs", count: 15 },
  { key: "PRODUCT", label: "Product", count: 4 },
  { key: "NETWEIGHT", label: "Net Weight", count: 15 },
];

// ============================================================
// Helpers
// ============================================================
function safeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getCycleStartData(cycleNum) {
  try {
    const startDataStr = localStorage.getItem(`cycle-${cycleNum}-start-data`);
    const startData = startDataStr ? JSON.parse(startDataStr) : {};
    return {
      product: (startData.product || "").trim(),
      batchNo: (startData.batchNo || "").trim(),
      lineNo: (startData.lineNo || "").trim(),
      executiveName: (startData.executiveName || "").trim(),
      packaged: (startData.packaged || "").trim(),
      expiry: (startData.expiry || "").trim(),
      standardWeight: (startData.standardWeight || "").trim(),
      standardWeightFromDB: (startData.standardWeightFromDB || "").trim(),
    };
  } catch (e) {
    return { product: "", batchNo: "", lineNo: "", executiveName: "", packaged: "", expiry: "", standardWeight: "", standardWeightFromDB: "" };
  }
}

function setRowHeaderFieldsForCycle(cycleNum, tabKey, setIndex, product, batchNo, lineNo, executiveName, packaged, expiry, standardWeight = "") {
  const p = (product || "").trim();
  const b = (batchNo || "").trim();
  const l = (lineNo || "").trim();
  const e = (executiveName || "").trim();
  const pk = (packaged || "").trim();
  const ex = (expiry || "").trim();
  const sw = (standardWeight || "").trim();

  const productField = document.getElementById(getSetHeaderFieldId(cycleNum, tabKey, setIndex, "product"));
  const batchField = document.getElementById(getSetHeaderFieldId(cycleNum, tabKey, setIndex, "batch"));
  const lineField = document.getElementById(getSetHeaderFieldId(cycleNum, tabKey, setIndex, "line"));
  const executiveField = document.getElementById(getSetHeaderFieldId(cycleNum, tabKey, setIndex, "executive"));
  const packagedField = document.getElementById(getSetHeaderFieldId(cycleNum, tabKey, setIndex, "packaged"));
  const expiryField = document.getElementById(getSetHeaderFieldId(cycleNum, tabKey, setIndex, "expiry"));
  const standardWeightField = document.getElementById(getSetHeaderFieldId(cycleNum, tabKey, setIndex, "standardWeight"));

  if (productField) productField.value = p;
  if (batchField) batchField.value = b;
  if (lineField) lineField.value = l;
  if (executiveField) executiveField.value = e;
  if (packagedField) packagedField.value = pk;
  if (expiryField) expiryField.value = ex;

  if (tabKey === "NETWEIGHT" && standardWeightField) standardWeightField.value = sw;
}

// Rating color helper for Summary cells
function getRatingCellStyle(ratingVal) {
  const v = ratingVal === null || ratingVal === undefined ? '' : String(ratingVal).trim();

  if (v === 'Okay') {
    return 'border:1px solid #e0e0e0;color:#0F5132;font-weight:bold;text-align:center;background:limegreen;';
  } else if (v === 'Not Okay') {
    return 'border:1px solid #e0e0e0;color:#842029;font-weight:bold;text-align:center;background:red;';
  }
  return `border:1px solid #e0e0e0;color:black;font-weight:bold;text-align:center;`;
}

// ============================================================
// ✅ NEW APPROACH: SETS (Set 1, Set 2...) per tab, per cycle
// - Each Set contains fixed items (count from QUALITY_TABS)
// - Delete button only at Set header (top-right)
// - Footer has "+ Add Set" which creates next Set
// ============================================================

function getItemLabelByTab(tabKey) {
  switch (tabKey) {
    case 'CRATES': return 'Crate';
    case 'PACKS': return 'PP';
    case 'PRODUCT': return 'P';
    case 'NETWEIGHT': return 'NW';
    default: return 'Item';
  }
}

// ----- Row helpers updated for SET context -----
function updateRowIndexForTab(rowEl, cycleNum, tabKey, setIndex, newItemIndex) {
  if (!rowEl) return;

  rowEl.setAttribute('data-row-index', String(newItemIndex));
  rowEl.setAttribute('data-tab', tabKey);
  rowEl.setAttribute('data-set-index', String(setIndex));

  const itemLabel = getItemLabelByTab(tabKey);
  const titleEl = rowEl.querySelector('.bs-card-title');
  if (titleEl) titleEl.textContent = `${itemLabel} ${newItemIndex}`;

  // ❌ REMOVE this (it clears Okay/Not Okay selection)
  // rowEl.querySelectorAll('.cycle-estimation-action-elem').forEach(b => b.classList.remove('badge-fill'));

  // Net weight input id
  const netW = rowEl.querySelector(`input[id^="net-weight-${cycleNum}-${tabKey}-"]`);
  if (netW) netW.id = `net-weight-${cycleNum}-${tabKey}-${setIndex}-${newItemIndex}`;

  // Defect + remarks
  const defect = rowEl.querySelector(`input[id^="defect-${cycleNum}-${tabKey}-"]`);
  if (defect) defect.id = `defect-${cycleNum}-${tabKey}-${setIndex}-${newItemIndex}`;

  const remarks = rowEl.querySelector(`input[id^="remarks-${cycleNum}-${tabKey}-"]`);
  if (remarks) remarks.id = `remarks-${cycleNum}-${tabKey}-${setIndex}-${newItemIndex}`;

  // Radio ids/names/labels
  const radios = rowEl.querySelectorAll('input[type="radio"]');
  radios.forEach(r => {
    const val = (r.value || '').toLowerCase();
    const isA = val.includes('a');
    const isB = val.includes('b');

    const newName = `category-${cycleNum}-${tabKey}-${setIndex}-${newItemIndex}`;
    r.name = newName;

    if (isA) r.id = `category-a-${cycleNum}-${tabKey}-${setIndex}-${newItemIndex}`;
    if (isB) r.id = `category-b-${cycleNum}-${tabKey}-${setIndex}-${newItemIndex}`;

    // ❌ REMOVE this (it clears Category A/B selection)
    // r.checked = false;
  });

  rowEl.querySelectorAll('label[for]').forEach(lbl => {
    const f = lbl.getAttribute('for') || '';
    if (f.startsWith(`category-a-${cycleNum}-${tabKey}-`)) lbl.setAttribute('for', `category-a-${cycleNum}-${tabKey}-${setIndex}-${newItemIndex}`);
    if (f.startsWith(`category-b-${cycleNum}-${tabKey}-`)) lbl.setAttribute('for', `category-b-${cycleNum}-${tabKey}-${setIndex}-${newItemIndex}`);
    if (f.startsWith(`defect-${cycleNum}-${tabKey}-`)) lbl.setAttribute('for', `defect-${cycleNum}-${tabKey}-${setIndex}-${newItemIndex}`);
    if (f.startsWith(`remarks-${cycleNum}-${tabKey}-`)) lbl.setAttribute('for', `remarks-${cycleNum}-${tabKey}-${setIndex}-${newItemIndex}`);
  });
}

function clearRowValues(rowEl) {
  if (!rowEl) return;

  rowEl.querySelectorAll('input').forEach(inp => {
    if (inp.type === 'radio' || inp.type === 'checkbox') inp.checked = false;
    else inp.value = '';
  });

  rowEl.querySelectorAll('.cycle-estimation-action-elem').forEach(b => b.classList.remove('badge-fill'));
  const wrapper = rowEl.querySelector('.estimation-not-okay-wrapper');
  if (wrapper) wrapper.style.display = 'none';
}

// ----- Set helpers -----
function getSetsContainerId(cycleNum, tabKey) {
  return `estimation-sets-${cycleNum}-${tabKey}`;
}
function getSetId(cycleNum, tabKey, setIndex) {
  return `estimation-set-${cycleNum}-${tabKey}-${setIndex}`;
}
function getSetListId(cycleNum, tabKey, setIndex) {
  return `estimation-list-${cycleNum}-${tabKey}-${setIndex}`;
}
function getSetHeaderPrefix(cycleNum, tabKey, setIndex) {
  return `set-header-${cycleNum}-${tabKey}-${setIndex}`;
}

function getSetHeaderFieldId(cycleNum, tabKey, setIndex, field) {
  return `${getSetHeaderPrefix(cycleNum, tabKey, setIndex)}-${field}`;
}

function setSetHeaderEditable(cycleNum, tabKey, setIndex, editable) {
  const fields = ["product", "batch", "line", "executive", "packaged", "expiry", "standardWeight"];
  fields.forEach(f => {
    const el = document.getElementById(getSetHeaderFieldId(cycleNum, tabKey, setIndex, f));
    if (!el) return;

    // only NETWEIGHT has standardWeight
    if (f === "standardWeight" && tabKey !== "NETWEIGHT") return;

    el.readOnly = !editable;
    el.disabled = false; // keep enabled, but readonly controls editing
  });

  const btn = document.getElementById(`set-header-toggle-${cycleNum}-${tabKey}-${setIndex}`);
  if (btn) btn.textContent = editable ? "Lock Header" : "Edit Header";
}

function getSetHeaderValues(cycleNum, tabKey, setIndex) {
  const read = (f) => (document.getElementById(getSetHeaderFieldId(cycleNum, tabKey, setIndex, f))?.value || "").trim();

  const header = {
    product: read("product"),
    batchNo: read("batch"),
    lineNo: read("line"),
    executiveName: read("executive"),
    packaged: read("packaged"),
    expiry: read("expiry"),
    standardWeight: null,
  };

  if (tabKey === "NETWEIGHT") {
    let sw = read("standardWeight");
    if (sw === "") header.standardWeight = null;
    else {
      sw = parseFloat(sw);
      header.standardWeight = isNaN(sw) ? null : sw;
    }
  }

  return header;
}

function updateSetIndexForTab(setEl, cycleNum, tabKey, newSetIndex) {
  if (!setEl) return;

  setEl.setAttribute('data-set-index', String(newSetIndex));
  setEl.id = getSetId(cycleNum, tabKey, newSetIndex);

  const title = setEl.querySelector('.quality-set-title');
  if (title) title.textContent = `Set ${newSetIndex}`;

  const delBtn = setEl.querySelector('.quality-delete-set-btn');
  if (delBtn) {
    delBtn.setAttribute('data-cycle-delete-set', String(cycleNum));
    delBtn.setAttribute('data-tab', tabKey);
    delBtn.setAttribute('data-set', String(newSetIndex));

    // ✅ Disable delete for Set 1 always
    if (Number(newSetIndex) === 1) {
      delBtn.disabled = true;
      delBtn.style.opacity = "0.4";
      delBtn.style.cursor = "not-allowed";
    } else {
      delBtn.disabled = false;
      delBtn.style.opacity = "1";
      delBtn.style.cursor = "pointer";
    }
  }

  const list = setEl.querySelector('.quality-set-items');
  if (list) list.id = getSetListId(cycleNum, tabKey, newSetIndex);

  // Re-index all rows inside the set with updated setIndex
  const rows = Array.from(setEl.querySelectorAll('.estimation-row'));
  rows.forEach((row, idx) => {
    updateRowIndexForTab(row, cycleNum, tabKey, newSetIndex, idx + 1);
  });
}

function renumberTabSets(cycleNum, tabKey) {
  const setsContainer = document.getElementById(getSetsContainerId(cycleNum, tabKey));
  if (!setsContainer) return;

  const sets = Array.from(setsContainer.querySelectorAll('.quality-set'));
  sets.forEach((setEl, idx) => {
    updateSetIndexForTab(setEl, cycleNum, tabKey, idx + 1);
  });
}

function getSetHtml(cycleNum, tabKey, setIndex, itemsCount) {
  const isFirstSet = Number(setIndex) === 1;

  const cols = (tabKey === "NETWEIGHT") ? 7 : 6;

  return `
    <div class="quality-set" id="${getSetId(cycleNum, tabKey, setIndex)}" data-set-index="${setIndex}"
         style="border:1px solid #e0e0e0; border-radius:10px; margin-bottom:14px; overflow:hidden; background:#fff;">

      <div class="quality-set-header"
           style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:#f8f9fa; border-bottom:1px solid #eaeaea;">
        <div class="quality-set-title" style="font-weight:700;">Set ${setIndex}</div>

        <div style="display:flex; gap:8px; align-items:center;">
          <button type="button"
                  id="set-header-toggle-${cycleNum}-${tabKey}-${setIndex}"
                  class="bs-btn bs-btn-light quality-edit-header-btn"
                  data-cycle="${cycleNum}"
                  data-tab="${tabKey}"
                  data-set="${setIndex}"
                  style="padding:6px 10px;">
            Edit Header
          </button>

          <button type="button"
                  class="bs-btn bs-btn-light quality-delete-set-btn"
                  data-cycle-delete-set="${cycleNum}"
                  data-tab="${tabKey}"
                  data-set="${setIndex}"
                  style="padding:6px 10px; ${isFirstSet ? 'opacity:0.4; cursor:not-allowed;' : ''}"
                  ${isFirstSet ? 'disabled' : ''}>
            ✕
          </button>
        </div>
      </div>

      <!-- ✅ Per-Set Header Fields (LOCKED by default, enabled only via Edit Header) -->
      <div class="tab-header-section"
           style="background:#ffffff; border-bottom:1px solid #eaeaea; padding:12px 14px;">
        <div class="header-grid" style="display:grid; grid-template-columns:repeat(${cols}, minmax(150px, 1fr)); gap:12px;">
          <div class="form-group">
            <label class="form-label" for="${getSetHeaderFieldId(cycleNum, tabKey, setIndex, "product")}">Product</label>
            <input type="text" class="form-control header-field"
                   id="${getSetHeaderFieldId(cycleNum, tabKey, setIndex, "product")}"
                   placeholder="Enter product" value="" readonly />
          </div>

          <div class="form-group">
            <label class="form-label" for="${getSetHeaderFieldId(cycleNum, tabKey, setIndex, "batch")}">Batch No</label>
            <input type="text" class="form-control header-field"
                   id="${getSetHeaderFieldId(cycleNum, tabKey, setIndex, "batch")}"
                   placeholder="Enter batch no" value="" readonly />
          </div>

          <div class="form-group">
            <label class="form-label" for="${getSetHeaderFieldId(cycleNum, tabKey, setIndex, "line")}">Line No</label>
            <input type="text" class="form-control header-field"
                   id="${getSetHeaderFieldId(cycleNum, tabKey, setIndex, "line")}"
                   placeholder="Enter line no" value="" readonly />
          </div>

          <div class="form-group">
            <label class="form-label" for="${getSetHeaderFieldId(cycleNum, tabKey, setIndex, "executive")}">Executive Name</label>
            <input type="text" class="form-control header-field"
                   id="${getSetHeaderFieldId(cycleNum, tabKey, setIndex, "executive")}"
                   placeholder="Enter executive" value="" readonly />
          </div>

          <div class="form-group datepicker-field">
            <label class="form-label" for="${getSetHeaderFieldId(cycleNum, tabKey, setIndex, "packaged")}">Packaged</label>
            <input type="text" class="form-control header-field"
                   id="${getSetHeaderFieldId(cycleNum, tabKey, setIndex, "packaged")}"
                   placeholder="" value="" readonly />
          </div>

          <div class="form-group datepicker-field">
            <label class="form-label" for="${getSetHeaderFieldId(cycleNum, tabKey, setIndex, "expiry")}">Expiry</label>
            <input type="text" class="form-control header-field"
                   id="${getSetHeaderFieldId(cycleNum, tabKey, setIndex, "expiry")}"
                   placeholder="" value="" readonly />
          </div>

          ${tabKey === "NETWEIGHT" ? `
          <div class="form-group">
            <label class="form-label" for="${getSetHeaderFieldId(cycleNum, tabKey, setIndex, "standardWeight")}">Standard Weight</label>
            <input type="number" class="form-control header-field"
                   id="${getSetHeaderFieldId(cycleNum, tabKey, setIndex, "standardWeight")}"
                   placeholder="Enter standard weight" value="" step="0.01" readonly />
          </div>
          ` : ''}
        </div>
      </div>

      <div class="quality-set-items" id="${getSetListId(cycleNum, tabKey, setIndex)}" style="padding:10px 10px 4px 10px;">
        ${Array.from({ length: itemsCount }).map((_, i) => {
          const itemNum = i + 1;
          const itemLabel = getItemLabelByTab(tabKey);
          return getQualityRowHtml(cycleNum, tabKey, setIndex, itemNum, itemLabel);
        }).join('')}
      </div>

    </div>
  `;
}

// ============================================================
// Check which tabs have data (UPDATED for SETS)
// ============================================================
function checkTabsWithData(cyclePanel, cycleNum) {
  const tabsWithData = [];

  QUALITY_TABS.forEach(tab => {
    const tabKey = tab.key;

    const setsContainer = cyclePanel.querySelector(
      `.quality-tab-panel[data-cycle="${cycleNum}"][data-tab="${tabKey}"] .quality-sets-container`
    );
    if (!setsContainer) return;

    const sets = setsContainer.querySelectorAll('.quality-set');
    let hasData = false;

    sets.forEach(setEl => {
      const setIndex = setEl.getAttribute('data-set-index');
      const rows = setEl.querySelectorAll('.estimation-row');

      rows.forEach(row => {
        const rowIndex = row.getAttribute("data-row-index");

        const badgeError = row.querySelector('.badge-error.badge-fill');
        const badgeSuccess = row.querySelector('.badge-success.badge-fill');
        const status = badgeError ? "Not Okay" : (badgeSuccess ? "Okay" : "");

        const categoryRadio = row.querySelector(`input[name="category-${cycleNum}-${tabKey}-${setIndex}-${rowIndex}"]:checked`);
        const category = categoryRadio ? categoryRadio.value : "";

        const defect = (row.querySelector(`#defect-${cycleNum}-${tabKey}-${setIndex}-${rowIndex}`)?.value || "").trim();
        const remarks = (row.querySelector(`#remarks-${cycleNum}-${tabKey}-${setIndex}-${rowIndex}`)?.value || "").trim();

        let hasRowData = status || category || defect || remarks;

        if (tabKey === "NETWEIGHT") {
          const netWeight = (row.querySelector(`#net-weight-${cycleNum}-${tabKey}-${setIndex}-${rowIndex}`)?.value || "").trim();
          hasRowData = netWeight || hasRowData;
        }

        if (hasRowData) hasData = true;
      });
    });

    if (hasData) tabsWithData.push(tab);
  });

  return tabsWithData;
}

// ============================================================
// Show loading overlay with progress
// ============================================================
function showSaveLoadingOverlay(tabsToSave) {
  const overlay = document.createElement('div');
  overlay.id = 'save-loading-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(2px);
  `;

  const card = document.createElement('div');
  card.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    text-align: center;
    animation: slideUp 0.3s ease-out;
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .save-spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #0066cc;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    .tab-item-status {
      margin: 8px 0;
      padding: 8px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
    }
    .tab-item-status.pending { background: #e3f2fd; color: #1976d2; }
    .tab-item-status.saving { background: #fff3e0; color: #f57c00; }
    .tab-item-status.saved { background: #e8f5e9; color: #388e3c; }
    .tab-item-status.error { background: #ffebee; color: #c62828; }
  `;
  document.head.appendChild(style);

  const title = document.createElement('h2');
  title.textContent = 'Saving Data...';
  title.style.cssText = 'margin: 0 0 20px 0; font-size: 20px; color: #333;';

  const spinner = document.createElement('div');
  spinner.className = 'save-spinner';

  const description = document.createElement('p');
  description.textContent = `Saving ${tabsToSave.length} tab${tabsToSave.length !== 1 ? 's' : ''}...`;
  description.style.cssText = 'margin: 15px 0; color: #666; font-size: 14px;';

  const statusList = document.createElement('div');
  statusList.id = 'save-status-list';
  statusList.style.cssText = 'text-align: left; margin: 20px 0;';

  tabsToSave.forEach(tab => {
    const item = document.createElement('div');
    item.className = 'tab-item-status pending';
    item.id = `status-${tab.key}`;
    item.innerHTML = `
      <span style="display: inline-block; width: 12px; height: 12px; background: #1976d2; border-radius: 50%; margin-right: 8px;"></span>
      ${tab.label}
    `;
    statusList.appendChild(item);
  });

  card.appendChild(title);
  card.appendChild(spinner);
  card.appendChild(description);
  card.appendChild(statusList);
  overlay.appendChild(card);
  document.body.appendChild(overlay);

  return overlay;
}

function updateTabStatus(tabKey, status, message) {
  const statusElement = document.getElementById(`status-${tabKey}`);
  if (!statusElement) return;

  statusElement.className = `tab-item-status ${status}`;

  let color = '#1976d2';
  if (status === 'saving') color = '#f57c00';
  else if (status === 'saved') color = '#388e3c';
  else if (status === 'error') color = '#c62828';

  statusElement.innerHTML = `
    <span style="display: inline-block; width: 12px; height: 12px; background: ${color}; border-radius: 50%; margin-right: 8px;"></span>
    ${message || QUALITY_TABS.find(t => t.key === tabKey)?.label}
  `;
}

function closeSaveLoadingOverlay() {
  const overlay = document.getElementById('save-loading-overlay');
  if (overlay) setTimeout(() => overlay.remove(), 100);
}

// ============================================================
// Fetch summary data from database for the given QualityTourId
// ============================================================
async function fetchSummaryDataFromDatabase(qualityTourId) {
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
    const tableName = "cr3ea_prod_pqi_bakeries";
    const apiUrl =
      `${environmentUrl}/api/data/v${apiVersion}/${tableName}` +
      `?$filter=cr3ea_qualitytourid eq '${qualityTourId}'` +
      `&$select=cr3ea_cycle,cr3ea_category,cr3ea_status,cr3ea_defectcategory`;

    const response = await fetch(apiUrl, { headers });
    if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);

    const data = await response.json();

    const summaryData = {
      "Crates": { Okays: 0, A: 0, B: 0 },
      "Packs": { Okays: 0, A: 0, B: 0 },
      "Product": { Okays: 0, A: 0, B: 0 },
      "Net Weight": { Okays: 0, A: 0, B: 0 }
    };

    // ✅ NEW: track unique cycles per category
    const cyclesByCategory = {
      "Crates": new Set(),
      "Packs": new Set(),
      "Product": new Set(),
      "Net Weight": new Set()
    };

    let totalDefects = 0;

    data.value.forEach(record => {
      const category = record.cr3ea_category || "";
      const status = record.cr3ea_status || "";
      const defectCategory = record.cr3ea_defectcategory || "";
      const cycleNum = record.cr3ea_cycle || "";

      if (!summaryData[category]) return;

      // ✅ count unique cycles per category ONLY if row exists
      if (cycleNum) cyclesByCategory[category].add(cycleNum);

      if (status === "Okay") summaryData[category].Okays++;

      if (status === "Not Okay") {
        totalDefects++;
        if (defectCategory === "Category A") summaryData[category].A++;
        if (defectCategory === "Category B") summaryData[category].B++;
      }
    });

    const completedCyclesByCategory = {};
    Object.keys(cyclesByCategory).forEach(cat => {
      completedCyclesByCategory[cat] = cyclesByCategory[cat].size;
    });

    return {
      stats: summaryData,
      totalDefects,
      completedCyclesByCategory,
      hasData: data.value.length > 0
    };
  } catch (error) {
    console.error('Error fetching summary data from database:', error);
    return { stats: {}, totalDefects: 0, completedCyclesByCategory: {}, hasData: false };
  }
}

async function hasAnySavedRows(qualityTourId) {
  try {
    const AccessToken = await getAccessToken();
    if (!AccessToken) return false;

    const headers = {
      "Accept": "application/json",
      "OData-MaxVersion": "4.0",
      "OData-Version": "4.0",
      "Authorization": `Bearer ${AccessToken}`
    };

    const apiVersion = "9.2";
    const tableName = "cr3ea_prod_pqi_bakeries";
    const apiUrl = `${environmentUrl}/api/data/v${apiVersion}/${tableName}?$filter=cr3ea_qualitytourid eq '${qualityTourId}'&$count=true`;

    const response = await fetch(apiUrl, { headers });
    if (!response.ok) return false;

    const data = await response.json();
    return data['@odata.count'] > 0;
  } catch (error) {
    console.error('Error checking saved rows:', error);
    return false;
  }
}

// ============================================================
// Persistent Summary Dashboard (updates as cycles are saved)
// ============================================================

function setSummaryVisible(isVisible) {
  const container = document.getElementById('persistent-summary-container');
  if (!container) return;
  container.style.display = isVisible ? 'block' : 'none';
}

function ensurePersistentSummaryMounted() {
  const cycleList = document.querySelector(".tour-cycle-card-panel-lists");
  if (!cycleList) return null;

  let summaryContainer = document.getElementById('persistent-summary-container');
  if (!summaryContainer) {
    summaryContainer = document.createElement('div');
    summaryContainer.id = 'persistent-summary-container';
    cycleList.parentNode.insertBefore(summaryContainer, cycleList);
  }
  return summaryContainer;
}

function initializePersistentSummary() {
  const summaryContainer = ensurePersistentSummaryMounted();
  if (!summaryContainer) {
    console.warn('Could not find suitable container for persistent summary (missing .tour-cycle-card-panel-lists)');
    return;
  }

  const html = `
  <div class="persistent-summary" style="background:white; padding:16px; border-radius:8px; margin-bottom:20px; border:1px solid #e0e0e0;">

    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div style="display:flex; align-items:center; gap:12px;">
        <h3 style="margin:0; font-size:16px; font-weight:600;">Summary</h3>
        <div id="total-defects-badge"
             style="background:#ffebee; color:#d32f2f; padding:6px 12px; border-radius:20px; font-weight:600; font-size:13px;">
          0 Defects
        </div>
      </div>

      <button id="summary-toggle-btn"
              type="button"
              style="background:none; border:none; color:#0066cc; cursor:pointer; font-weight:600; font-size:14px;">
        View more
      </button>
    </div>

    <div id="summary-details"
         style="display:none; margin-top:16px; padding-top:16px; border-top:1px solid #e0e0e0;">

      <div style="overflow-x:auto; margin-bottom:20px;">
        <table style="border-collapse:collapse; width:100%; font-size:13px; border:1px solid #e0e0e0;">
          <thead style="background:#f0f0f0;">
            <tr>
              <th style="padding:10px; text-align:center;">Category</th>
              <th style="padding:10px; text-align:center;">Okays</th>
              <th style="padding:10px; text-align:center; color:#d32f2f;">A Defects</th>
              <th style="padding:10px; text-align:center; color:#d32f2f;">B Defects</th>
              <th style="padding:10px; text-align:center;">Nos of Hrs inspection/production</th>
              <th style="padding:10px; text-align:center;">Max Potential Score</th>
              <th style="padding:10px; text-align:center;">Score deduction</th>
              <th style="padding:10px; text-align:center;">Score obtained</th>
              <th style="padding:10px; text-align:center;">Score%</th>
              <th style="padding:10px; text-align:center;">PQI Score as per weightage</th>
            </tr>
          </thead>
          <tbody id="persistent-summary-tbody">
            <tr>
              <td colspan="10" style="padding:20px; text-align:center; color:#999;">
                No data yet
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-bottom:16px;">
        <div style="padding:14px; background:#f8f9fa; border-radius:6px; text-align:center;">
          <label style="font-weight:600; display:block; margin-bottom:6px; font-size:14px;">
            Final PQI Score
          </label>
          <div id="final-pqi-score"
               style="font-size:22px; font-weight:bold; color:#0066cc;">
            0.00
          </div>
        </div>
      </div>

      <div>
        <label style="font-weight:600; display:block; margin-bottom:8px; font-size:13px;">
          PQI Status
        </label>
        <div id="pqi-status"
             style="padding:12px; background:#e74c3c; color:white; border-radius:6px; text-align:center; font-weight:600; font-size:16px;">
          NA
        </div>
      </div>

    </div>
  </div>
  `;

  summaryContainer.innerHTML = html;

  const toggleBtn = document.getElementById('summary-toggle-btn');
  const detailsDiv = document.getElementById('summary-details');
  if (toggleBtn && detailsDiv) {
    toggleBtn.onclick = function () {
      const isHidden = detailsDiv.style.display === 'none';
      detailsDiv.style.display = isHidden ? 'block' : 'none';
      toggleBtn.textContent = isHidden ? 'View less' : 'View more';
    };
  }
}

async function updatePersistentSummary(qualityTourId) {
  const summaryData = await fetchSummaryDataFromDatabase(qualityTourId);

  if (!summaryData.hasData) {
    setSummaryVisible(false);
    return;
  }

  initializePersistentSummary();
  setSummaryVisible(true);

  const stats = summaryData.stats || {};
  const totalDefects = summaryData.totalDefects || 0;
  const completedCyclesByCategory = summaryData.completedCyclesByCategory || {};

  const config = {
    "Crates": { multiplier: 15, weight: 0.15 },
    "Packs": { multiplier: 15, weight: 0.25 },
    "Product": { multiplier: 4, weight: 0.45 },
    "Net Weight": { multiplier: 15, weight: 0.15 }
  };

  const categoryOrder = ["Crates", "Packs", "Product", "Net Weight"];

  const tbody = document.getElementById("persistent-summary-tbody");
  if (!tbody) return;

  const cell = (val, extra = "") =>
    `<td style="border:1px solid #e0e0e0; padding:10px; text-align:center; ${extra}">${val}</td>`;

  // ✅ NEW: include only categories that have at least 1 record (cycleCount > 0)
  const categoriesWithData = categoryOrder.filter(cat => {
    const cycleCount = completedCyclesByCategory[cat] || 0;
    return cycleCount > 0;
  });

  // If nothing has data (edge), show placeholder
  if (categoriesWithData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="padding:20px; text-align:center; color:#999;">No data yet</td>
      </tr>
    `;
    return;
  }

  // ✅ NEW: Final score should not get “free 100%” from missing categories
  // We normalize weights only across categories that have data
  const totalWeightIncluded = categoriesWithData.reduce((sum, cat) => sum + config[cat].weight, 0);

  let weightedSum = 0;

  const rowsHtml = categoriesWithData.map(cat => {
    const okays = (stats[cat]?.Okays || 0);
    const A = (stats[cat]?.A || 0);
    const B = (stats[cat]?.B || 0);

    // ✅ per-category cycles (not overall)
    const cycleCount = completedCyclesByCategory[cat] || 0;

    const maxScore = config[cat].multiplier * 120 * cycleCount;
    const deduction = (A * 90) + (B * 30);
    const obtained = Math.max(0, maxScore - deduction);
    const scorePercent = maxScore > 0 ? (obtained / maxScore) : 0;

    const normalizedWeight = totalWeightIncluded > 0 ? (config[cat].weight / totalWeightIncluded) : 0;
    const weightedPQI = scorePercent * normalizedWeight;
    weightedSum += weightedPQI;

    return `
      <tr>
        ${cell(cat)}
        ${cell(okays)}
        ${cell(A, "color:#d32f2f;font-weight:700;")}
        ${cell(B, "color:#d32f2f;font-weight:700;")}
        ${cell(cycleCount)} <!-- ✅ FIX: category cycles -->
        ${cell(maxScore)}
        ${cell(deduction)}
        ${cell(obtained)}
        ${cell((scorePercent * 100).toFixed(2) + "%")}
        ${cell((weightedPQI * 100).toFixed(2) + "%")} <!-- normalized contribution -->
      </tr>
    `;
  }).join("");

  tbody.innerHTML = rowsHtml;

  const badge = document.getElementById("total-defects-badge");
  if (badge) badge.textContent = `${totalDefects} Defect${totalDefects !== 1 ? "s" : ""}`;

  const final = document.getElementById("final-pqi-score");
  if (final) final.textContent = (weightedSum * 100).toFixed(2) + "%";

  const statusDiv = document.getElementById('pqi-status');
  if (statusDiv) {
    const finalPQIPercent = weightedSum * 100;
    if (finalPQIPercent >= 90) {
      statusDiv.style.background = "#27ae60";
      statusDiv.textContent = "PASS";
    } else {
      statusDiv.style.background = "#e74c3c";
      statusDiv.textContent = "HOLD";
    }
  }
}

function updateFinalPQIScore() {
  const container = document.getElementById('persistent-summary-container');
  if (!container || container.style.display === 'none') return;

  const brokenPercentage = parseFloat(document.getElementById('broken-percentage')?.value || 0);
  const finalScore = Math.max(0, 100 - brokenPercentage).toFixed(2);

  const finalScoreDiv = document.getElementById('final-pqi-score');
  if (finalScoreDiv) finalScoreDiv.textContent = `${finalScore}%`;

  const statusDiv = document.getElementById('pqi-status');
  if (statusDiv) {
    const defectBadge = document.getElementById('total-defects-badge');
    const hasDefects = defectBadge && !defectBadge.textContent.includes('0 Defect');

    if (hasDefects || brokenPercentage > 0) {
      statusDiv.style.background = '#e74c3c';
      statusDiv.textContent = 'HOLD';
    } else {
      statusDiv.style.background = '#27ae60';
      statusDiv.textContent = 'PASS';
    }
  }
}

// ============================================================
// Overall wall score (Count of Okay vs Not Okay)
// ============================================================
function computeOverallWallScore(rows) {
  const okayCount = rows.filter(r => r.status === 'Okay').length;
  const notOkayCount = rows.filter(r => r.status === 'Not Okay').length;
  const total = okayCount + notOkayCount;

  return {
    okay: okayCount,
    notOkay: notOkayCount,
    total: total,
    percentage: total > 0 ? ((okayCount / total) * 100).toFixed(2) : 0
  };
}

function getWallScoreBadgeStyle(score) {
  if (!score || score.total === 0) {
    return "padding:6px 10px;border-radius:8px;border:1px solid #ebeef4;background:#f8f9fa;color:#111;font-weight:600;";
  }

  const percentage = parseFloat(score.percentage);
  if (percentage >= 80) {
    return "padding:6px 10px;border-radius:8px;border:1px solid #c3e6cb;background:#d4edda;color:#155724;font-weight:700;";
  } else if (percentage >= 50) {
    return "padding:6px 10px;border-radius:8px;border:1px solid #ffeeba;background:#fff3cd;color:#856404;font-weight:700;";
  } else {
    return "padding:6px 10px;border-radius:8px;border:1px solid #f5c6cb;background:#f8d7da;color:#721c24;font-weight:700;";
  }
}

// ============================================================
// DOM Ready
// ============================================================
$(document).ready(function () {
  getEmployeeDetails(EmployeeDetailsSuccess, EmployeeDetailsFailure);

  var storedValue = localStorage.getItem("shiftValue");
  const badge = document.getElementById("shiftBadge");
  if (badge) badge.innerText = storedValue || '';

  initializePersistentSummary();

  if (QualityTourId) updatePersistentSummary(QualityTourId);
  else setSummaryVisible(false);

  $('#shiftSelect').select2({
    minimumResultsForSearch: -1,
    dropdownAutoWidth: true,
    width: '100%',
  });
});

// ============================================================
// Datepicker Init (Tempus Dominus)
// ============================================================
function initializeDatepickers(scope) {
  const root = scope || document;

  const inputs = root.querySelectorAll('.datepicker-field .form-control');
  if (!inputs || inputs.length === 0) return;

  const hasTD = (window.tempusDominus && window.tempusDominus.TempusDominus);

  if (!hasTD) {
    console.warn("Tempus Dominus not available. Make sure tempus-dominus JS/CSS is loaded.");
    return;
  }

  inputs.forEach((input) => {
    if (!input || input.dataset.dpInit === "1") return;

    input.dataset.dpInit = "1";
    input.setAttribute("autocomplete", "off");

    try {
      new tempusDominus.TempusDominus(input, {
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
    } catch (e) {
      console.error("Tempus Dominus init failed for:", input.id, e);
      input.dataset.dpInit = "0";
    }
  });
}

function reinitializeDatepickers(scope) {
  initializeDatepickers(scope);
}

// ============================================================
// DOM Content Loaded Event Listeners
// ============================================================
document.addEventListener("DOMContentLoaded", async function () {
  initializeApplication();
  reloadFetchCycleData();

  document.addEventListener('click', toggleCardHandler);
  document.addEventListener('click', saveSessionHandler);
  document.addEventListener('click', startSessionHandler);

  document.addEventListener('click', qualityTabsClickHandler);

  // ✅ UPDATED: Add/Delete SET handler
  document.addEventListener('click', qualityAddDeleteSetHandler);

  setTimeout(() => initializeDatepickers(document), 200);
});

// ============================================================
// Radio button status change handler - badge system
// ============================================================
function initRadioStatusHandlers(scope) {
  const $scope = scope ? $(scope) : $(document);

  $scope.find('.cycle-estimation-action-elem').off('click').on('click', function () {
    const btn = $(this);
    const row = btn.closest('.estimation-row');
    const wrapper = row.find('.estimation-not-okay-wrapper');

    row.find('.cycle-estimation-action-elem').removeClass('badge-fill');
    btn.addClass('badge-fill');

    if (btn.hasClass('badge-error')) {
      wrapper.show();
      row.find('.bs-card-body').css({ 'max-height': 'none', 'overflow': 'visible' });
    } else if (btn.hasClass('badge-success')) {
      wrapper.hide();
      row.find('input[type="radio"][name^="category-"]').prop('checked', false);
      row.find('input[type="text"]').val('');
      row.find('input[type="number"]').val('');
    }
  });
}

// ============================================================
// Tabs UI helpers (UPDATED: now uses SETS container per tab)
// ============================================================
function buildQualityTabsUI(formSection, cycleNum) {
  const host = formSection.querySelector('.tour-cycle-estimation-lists');
  if (!host) return;

  if (host.querySelector(`.quality-tabs[data-cycle="${cycleNum}"]`)) return;

  const tabsHtml = `
    <div class="quality-tabs" data-cycle="${cycleNum}" style="display:flex; gap:8px; flex-wrap:wrap; margin:10px 0;">
      ${QUALITY_TABS.map(t => `
        <button type="button"
          class="bs-btn bs-btn-light quality-tab-btn"
          data-cycle="${cycleNum}"
          data-tab="${t.key}"
          style="padding:6px 12px;">
          ${t.label}
        </button>
      `).join('')}
    </div>

    <div class="quality-tabs-panels" data-cycle="${cycleNum}">
      ${QUALITY_TABS.map(t => `
        <div class="quality-tab-panel" data-cycle="${cycleNum}" data-tab="${t.key}" style="display:none;">

          <!-- ✅ Sets Container -->
          <div class="quality-sets-container" id="${getSetsContainerId(cycleNum, t.key)}"></div>

          <div class="tour-cycle-estimation-footer"
               style="display:flex; justify-content:space-between; align-items:center; padding:0 10px 10px 10px; margin-top:10px;">
            <button type="button"
                    class="bs-btn bs-btn-light quality-add-set-btn"
                    data-cycle-add-set="${cycleNum}"
                    data-tab="${t.key}">
              + Add Set
            </button>

            <div>
              <button type="button" class="bs-btn bs-btn-outline-primary">Cancel</button>
              <button type="button"
                      class="bs-btn bs-btn-primary tour-cycle-save-session-btn tour-cycle-save-session-btn-${cycleNum}">
                Save Session
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  host.innerHTML = tabsHtml;

  // ✅ Create default Set 1 for each tab
  QUALITY_TABS.forEach(tab => {
    generateDefaultSetForTab(cycleNum, tab.key, 1, tab.count);
  });

  setTimeout(() => reinitializeDatepickers(host), 50);
}

function generateDefaultSetForTab(cycleNum, tabKey, setIndex, itemsCount) {
  const setsContainer = document.getElementById(getSetsContainerId(cycleNum, tabKey));
  if (!setsContainer) return;

  if (document.getElementById(getSetId(cycleNum, tabKey, setIndex))) return;

  setsContainer.insertAdjacentHTML('beforeend', getSetHtml(cycleNum, tabKey, setIndex, itemsCount));

  const setEl = document.getElementById(getSetId(cycleNum, tabKey, setIndex));
  if (setEl) {
    initRadioStatusHandlers(setEl);

    // ✅ Prefill header from cycle start data
    const sd = getCycleStartData(cycleNum);
    setRowHeaderFieldsForCycle(
      cycleNum,
      tabKey,
      setIndex,
      sd.product,
      sd.batchNo,
      sd.lineNo,
      sd.executiveName,
      sd.packaged,
      sd.expiry,
      sd.standardWeightFromDB || ""
    );

    // ✅ lock header by default
    setSetHeaderEditable(cycleNum, tabKey, setIndex, false);
  }
}

// ============================================================
// Quality row with Okay/Not Okay + Defect categories
// ✅ UPDATED: NO delete button per row (delete is per SET)
// ============================================================
function getQualityRowHtml(cycleNum, tabKey, setIndex, itemNum, itemLabel) {
  if (tabKey === 'NETWEIGHT') {
    return `
      <div class="bs-card bs-card-toggler bs-card-light bs-card-sm tour-cycle-estimation-item estimation-row"
           data-row-index="${itemNum}" data-tab="${tabKey}" data-set-index="${setIndex}"
           style="position:relative; margin-bottom:10px;">

        <div class="bs-card-header" style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px;">
          <h5 class="bs-card-title" style="margin:0; font-weight:600; flex:0 0 auto;">${itemLabel} ${itemNum}</h5>

          <div style="display:flex; gap:8px; align-items:center; flex:1 1 auto; margin:0 12px;">
            <input type="number" class="form-control"
                   id="net-weight-${cycleNum}-${tabKey}-${setIndex}-${itemNum}"
                   placeholder="Enter net weight" value="" step="0.01"
                   style="padding:6px 8px; font-size:13px; flex:1; max-width:200px;" />
          </div>

          <div style="flex:0 0 auto; display:flex; gap:6px; align-items:center;">
            <span class="badge badge-lg badge-error cycle-estimation-action-elem"
                  style="cursor:pointer; padding:6px 10px; font-size:12px; white-space:nowrap;">Not Okay</span>
            <span class="badge badge-lg badge-success cycle-estimation-action-elem"
                  style="cursor:pointer; padding:6px 10px; font-size:12px; white-space:nowrap;">Okay</span>
          </div>
        </div>

        <div class="bs-card-body">
          <div class="estimation-not-okay-wrapper" style="display:none;">
            <div style="display:flex; gap:16px; align-items:flex-start; flex-wrap:nowrap;">

              <div class="form-group estimation-item-category" style="flex: 0 0 auto; min-width:200px; margin:0;">
                <label class="form-label" style="margin-bottom:6px;">Select Category <span class="required-elem">*</span></label>
                <div class="form-check-lists">
                  <div class="form-check">
                    <input class="form-check-input" type="radio"
                           id="category-a-${cycleNum}-${tabKey}-${setIndex}-${itemNum}"
                           name="category-${cycleNum}-${tabKey}-${setIndex}-${itemNum}" value="Category A">
                    <label class="form-label form-check-label"
                           for="category-a-${cycleNum}-${tabKey}-${setIndex}-${itemNum}">Category A</label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio"
                           id="category-b-${cycleNum}-${tabKey}-${setIndex}-${itemNum}"
                           name="category-${cycleNum}-${tabKey}-${setIndex}-${itemNum}" value="Category B">
                    <label class="form-label form-check-label"
                           for="category-b-${cycleNum}-${tabKey}-${setIndex}-${itemNum}">Category B</label>
                  </div>
                </div>
              </div>

              <div class="form-group" style="flex: 1; min-width:200px; margin:0;">
                <label class="form-label" for="defect-${cycleNum}-${tabKey}-${setIndex}-${itemNum}" style="margin-bottom:6px;">Enter Defect <span class="required-elem">*</span></label>
                <input type="text" class="form-control"
                       id="defect-${cycleNum}-${tabKey}-${setIndex}-${itemNum}"
                       placeholder="Type Here..." value="" />
              </div>

              <div class="form-group" style="flex: 1; min-width:200px; margin:0;">
                <label class="form-label" for="remarks-${cycleNum}-${tabKey}-${setIndex}-${itemNum}" style="margin-bottom:6px;">Major Defects and Remarks</label>
                <input type="text" class="form-control"
                       id="remarks-${cycleNum}-${tabKey}-${setIndex}-${itemNum}"
                       placeholder="Type Here..." value="" />
              </div>

            </div>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="bs-card bs-card-toggler bs-card-light bs-card-sm tour-cycle-estimation-item estimation-row"
         data-row-index="${itemNum}" data-tab="${tabKey}" data-set-index="${setIndex}"
         style="position:relative; margin-bottom:10px;">

      <div class="bs-card-header" style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
        <h5 class="bs-card-title" style="margin:0; font-weight:600;">${itemLabel} ${itemNum}</h5>

        <div class="tour-cycle-estimation-actions" style="display:flex; gap:8px; align-items:center;">
          <span class="badge badge-lg badge-error cycle-estimation-action-elem" style="cursor:pointer;">Not Okay</span>
          <span class="badge badge-lg badge-success cycle-estimation-action-elem" style="cursor:pointer;">Okay</span>
        </div>
      </div>

      <div class="bs-card-body">
        <div class="estimation-not-okay-wrapper" style="display:none;">

          <div style="display:flex; gap:16px; align-items:flex-start; flex-wrap:nowrap;">

            <div class="form-group estimation-item-category" style="flex: 0 0 auto; min-width:200px; margin:0;">
              <label class="form-label" style="margin-bottom:6px;">Select Category <span class="required-elem">*</span></label>
              <div class="form-check-lists">
                <div class="form-check">
                  <input class="form-check-input" type="radio"
                         id="category-a-${cycleNum}-${tabKey}-${setIndex}-${itemNum}"
                         name="category-${cycleNum}-${tabKey}-${setIndex}-${itemNum}" value="Category A">
                  <label class="form-label form-check-label"
                         for="category-a-${cycleNum}-${tabKey}-${setIndex}-${itemNum}">Category A</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio"
                         id="category-b-${cycleNum}-${tabKey}-${setIndex}-${itemNum}"
                         name="category-${cycleNum}-${tabKey}-${setIndex}-${itemNum}" value="Category B">
                  <label class="form-label form-check-label"
                         for="category-b-${cycleNum}-${tabKey}-${setIndex}-${itemNum}">Category B</label>
                </div>
              </div>
            </div>

            <div class="form-group" style="flex: 1; min-width:200px; margin:0;">
              <label class="form-label" for="defect-${cycleNum}-${tabKey}-${setIndex}-${itemNum}" style="margin-bottom:6px;">Enter Defect <span class="required-elem">*</span></label>
              <input type="text" class="form-control"
                     id="defect-${cycleNum}-${tabKey}-${setIndex}-${itemNum}"
                     placeholder="Type Here..." value="" />
            </div>

            <div class="form-group" style="flex: 1; min-width:200px; margin:0;">
              <label class="form-label" for="remarks-${cycleNum}-${tabKey}-${setIndex}-${itemNum}" style="margin-bottom:6px;">Major Defects and Remarks</label>
              <input type="text" class="form-control"
                     id="remarks-${cycleNum}-${tabKey}-${setIndex}-${itemNum}"
                     placeholder="Type Here..." value="" />
            </div>

          </div>

        </div>
      </div>
    </div>
  `;
}

// ============================================================
// ✅ NEW: Add/Delete SET handler (per tab, per cycle)
// ============================================================
function qualityAddDeleteSetHandler(event) {
  // ✅ TOGGLE HEADER EDIT
  const toggleHeaderBtn = event.target.closest('.quality-edit-header-btn');
  if (toggleHeaderBtn) {
    const cycleNum = toggleHeaderBtn.getAttribute('data-cycle');
    const tabKey = toggleHeaderBtn.getAttribute('data-tab');
    const setIndex = parseInt(toggleHeaderBtn.getAttribute('data-set') || '1', 10);
    if (!cycleNum || !tabKey) return;

    // determine current mode by checking one input
    const prod = document.getElementById(getSetHeaderFieldId(cycleNum, tabKey, setIndex, "product"));
    const isEditable = prod ? !prod.readOnly : false;

    setSetHeaderEditable(cycleNum, tabKey, setIndex, !isEditable);
    return;
  }

  // ADD SET
  const addBtn = event.target.closest('button[data-cycle-add-set]');
  if (addBtn) {
    const cycleNum = addBtn.getAttribute('data-cycle-add-set');
    const tabKey = addBtn.getAttribute('data-tab');
    if (!cycleNum || !tabKey) return;

    const setsContainer = document.getElementById(getSetsContainerId(cycleNum, tabKey));
    if (!setsContainer) return;

    const tabConf = QUALITY_TABS.find(t => t.key === tabKey);
    const itemsCount = tabConf ? tabConf.count : 1;

    const existingSets = setsContainer.querySelectorAll('.quality-set');
    const nextSetIndex = existingSets.length + 1;

    setsContainer.insertAdjacentHTML('beforeend', getSetHtml(cycleNum, tabKey, nextSetIndex, itemsCount));

    const setEl = document.getElementById(getSetId(cycleNum, tabKey, nextSetIndex));
    if (setEl) {
      setEl.querySelectorAll('.estimation-row').forEach(r => clearRowValues(r));
      initRadioStatusHandlers(setEl);

      // ✅ Prefill header from previous set header (if exists), else from start data
      const prevHeader = (nextSetIndex > 1) ? getSetHeaderValues(cycleNum, tabKey, nextSetIndex - 1) : null;
      const sd = getCycleStartData(cycleNum);

      setRowHeaderFieldsForCycle(
        cycleNum,
        tabKey,
        nextSetIndex,
        (prevHeader?.product || sd.product),
        (prevHeader?.batchNo || sd.batchNo),
        (prevHeader?.lineNo || sd.lineNo),
        (prevHeader?.executiveName || sd.executiveName),
        (prevHeader?.packaged || sd.packaged),
        (prevHeader?.expiry || sd.expiry),
        (prevHeader?.standardWeight !== null && prevHeader?.standardWeight !== undefined)
          ? String(prevHeader.standardWeight)
          : (sd.standardWeightFromDB || "")
      );

      // ✅ lock header by default
      setSetHeaderEditable(cycleNum, tabKey, nextSetIndex, false);

      // ✅ datepickers in this new set header
      reinitializeDatepickers(setEl);
    }

    return;
  }

  // DELETE SET
  const delBtn = event.target.closest('.quality-delete-set-btn');
  if (delBtn) {
    const cycleNum = delBtn.getAttribute('data-cycle-delete-set');
    const tabKey = delBtn.getAttribute('data-tab');
    const setIndex = parseInt(delBtn.getAttribute('data-set') || '1', 10);

    if (!cycleNum || !tabKey) return;

    if (setIndex === 1) {
      const setEl = delBtn.closest('.quality-set');
      if (setEl) setEl.querySelectorAll('.estimation-row').forEach(r => clearRowValues(r));
      return;
    }

    const setsContainer = document.getElementById(getSetsContainerId(cycleNum, tabKey));
    if (!setsContainer) return;

    const sets = setsContainer.querySelectorAll('.quality-set');
    if (sets.length === 1) {
      const onlySet = sets[0];
      onlySet.querySelectorAll('.estimation-row').forEach(r => clearRowValues(r));
      return;
    }

    const setEl = delBtn.closest('.quality-set');
    setEl?.remove();

    renumberTabSets(cycleNum, tabKey);
    return;
  }
}

// ============================================================
// Tabs click
// ============================================================
function qualityTabsClickHandler(event) {
  const tabBtn = event.target.closest('.quality-tab-btn');
  if (!tabBtn) return;

  const cycleNum = tabBtn.getAttribute('data-cycle');
  const tabKey = tabBtn.getAttribute('data-tab');

  const cyclePanel = document.querySelector(`#cycle-${cycleNum}`);
  if (!cyclePanel) return;

  cyclePanel.dataset.activeQualityTab = tabKey;
  setActiveQualityTab(cyclePanel, cycleNum, tabKey);

  const activePanel = cyclePanel.querySelector(`.quality-tab-panel[data-cycle="${cycleNum}"][data-tab="${tabKey}"]`);
  if (activePanel) setTimeout(() => reinitializeDatepickers(activePanel), 10);
}

function setActiveQualityTab(cyclePanel, cycleNum, tabKey) {
  const btns = cyclePanel.querySelectorAll(`.quality-tab-btn[data-cycle="${cycleNum}"]`);
  btns.forEach(b => {
    const isActive = b.getAttribute('data-tab') === tabKey;
    b.classList.toggle('bs-btn-primary', isActive);
    b.classList.toggle('bs-btn-light', !isActive);
  });

  const panels = cyclePanel.querySelectorAll(`.quality-tab-panel[data-cycle="${cycleNum}"]`);
  panels.forEach(p => {
    p.style.display = (p.getAttribute('data-tab') === tabKey) ? 'block' : 'none';
  });

  const activePanel = cyclePanel.querySelector(`.quality-tab-panel[data-cycle="${cycleNum}"][data-tab="${tabKey}"]`);
  if (activePanel) {
    initRadioStatusHandlers(activePanel);
    setTimeout(() => reinitializeDatepickers(activePanel), 10);
  }
}

// ============================================================
// Toggle expand/collapse
// ============================================================
function toggleCardHandler(event) {
  const btn = event.target.closest('.bs-card-toggler-btn');
  if (!btn) return;

  const currentPanel = btn.closest('.bs-card-toggler');
  const currentPanelBody = currentPanel.querySelector('.bs-card-body');
  if (!currentPanelBody) return;

  const isCompleted = currentPanel.classList.contains('completed-cycle');

  currentPanel.classList.toggle('bs-card-toggler-is-active');
  const isActive = currentPanel.classList.contains('bs-card-toggler-is-active');

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

  currentPanel.style.position = "relative";
  currentPanel.style.zIndex = isActive ? "5" : "";

  if (isActive) {
    currentPanel.style.height = "auto";
    currentPanel.style.overflow = "visible";

    currentPanelBody.style.display = "block";
    currentPanelBody.style.height = "auto";
    currentPanelBody.style.overflow = "hidden";
    currentPanelBody.style.maxHeight = "0px";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const target = currentPanelBody.scrollHeight;
        currentPanelBody.style.maxHeight = target + "px";
        currentPanelBody.style.overflow = "visible";
        if (isCompleted && completedSection) {
          completedSection.classList.add("bs-fade-active", "bs-fade-in");
        }
      });
    });

    setTimeout(() => reinitializeDatepickers(currentPanel), 50);
  } else {
    currentPanel.style.height = "80px";
    currentPanel.style.overflow = "hidden";

    currentPanelBody.style.overflow = "hidden";
    currentPanelBody.style.maxHeight = "0px";
    currentPanelBody.style.height = "0px";
  }
}

// ============================================================
// Start session - fetch and set standard weight
// ============================================================
async function startSessionHandler(event) {
  const btn = event.target.closest('.bs-btn-primary');
  if (!btn || btn.textContent !== "Start Session") return;

  const cycleNum = btn.id.split('-')[2];
  const cyclePanel = document.getElementById(`cycle-${cycleNum}`);
  if (!cyclePanel) return;

  const startForm = cyclePanel.querySelector('.tour-cyle-step-start');
  const infoWrapper = cyclePanel.querySelector('.tour-cycle-info-wrapper');
  const formSection = cyclePanel.querySelector('.tour-cyle-step-form');
  if (!startForm || !infoWrapper || !formSection) return;

  const product = (document.getElementById(`product-name-${cycleNum}`)?.value || "").trim();
  const batchNo = (document.getElementById(`batch-no-${cycleNum}`)?.value || "").trim();
  const lineNo = (document.getElementById(`line-no-${cycleNum}`)?.value || "").trim();
  const executiveName = (document.getElementById(`executive-name-${cycleNum}`)?.value || "").trim();
  const packaged = (document.getElementById(`packaged-${cycleNum}`)?.value || "").trim();
  const expiry = (document.getElementById(`expiry-${cycleNum}`)?.value || "").trim();

  let standardWeightFromDB = "";
  if (QualityTourId) {
    try {
      const AccessToken = await getAccessToken();
      if (AccessToken) {
        const headers = {
          "Accept": "application/json",
          "OData-MaxVersion": "4.0",
          "OData-Version": "4.0",
          "Authorization": `Bearer ${AccessToken}`
        };

        const apiVersion = "9.2";
        const tableName = "cr3ea_prod_pqi_bakeries";
        const apiUrl =
          `${environmentUrl}/api/data/v${apiVersion}/${tableName}` +
          `?$filter=cr3ea_qualitytourid eq '${QualityTourId}'` +
          `&$select=cr3ea_standardweight` +
          `&$top=1`;

        const response = await fetch(apiUrl, { headers });
        if (response.ok) {
          const data = await response.json();
          if (data.value.length > 0) {
            const stdWeight = data.value[0].cr3ea_standardweight;
            if (stdWeight && stdWeight !== null && stdWeight !== "null") {
              standardWeightFromDB = String(stdWeight).trim();
            }
          }
        }
      }
    } catch (e) {
      console.error('Error fetching standard weight:', e);
    }
  }

  const startData = { product, batchNo, lineNo, executiveName, packaged, expiry, standardWeightFromDB };
  localStorage.setItem(`cycle-${cycleNum}-start-data`, JSON.stringify(startData));

  infoWrapper.innerHTML = `
    <div class="tour-cyle-start-info">
      <div class="start-info-item"><p class="item-label">Product</p><p class="item-value">${safeHtml(product)}</p></div>
      <div class="start-info-item"><p class="item-label">Batch No</p><p class="item-value">${safeHtml(batchNo)}</p></div>
      <div class="start-info-item"><p class="item-label">Line No</p><p class="item-value">${safeHtml(lineNo)}</p></div>
      <div class="start-info-item"><p class="item-label">Executive Name</p><p class="item-value">${safeHtml(executiveName)}</p></div>
      <div class="start-info-item"><p class="item-label">Packaged</p><p class="item-value">${safeHtml(packaged)}</p></div>
      <div class="start-info-item"><p class="item-label">Expiry</p><p class="item-value">${safeHtml(expiry)}</p></div>
    </div>
  `;

  const startFormClone = startForm.cloneNode(true);
  startForm.remove();

  infoWrapper.style.display = "block";
  formSection.style.display = "block";
  infoWrapper.classList.add("bs-fade-active", "bs-fade-in");
  formSection.classList.add("bs-fade-active", "bs-fade-in");

  buildQualityTabsUI(formSection, cycleNum);

  cyclePanel.dataset.activeQualityTab = "CRATES";
  setActiveQualityTab(cyclePanel, cycleNum, "CRATES");

  QUALITY_TABS.forEach(tab => {
  // ✅ Set 1 header only (new sets will inherit from previous set)
  setRowHeaderFieldsForCycle(cycleNum, tab.key, 1, product, batchNo, lineNo, executiveName, packaged, expiry, standardWeightFromDB);
  setSetHeaderEditable(cycleNum, tab.key, 1, false); // lock by default
});

  setTimeout(() => reinitializeDatepickers(formSection), 50);

  const cancelBtn = formSection.querySelector('.bs-btn-outline-primary');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function restoreStartForm(e) {
      e.preventDefault();
      window.location.reload();
      formSection.style.display = "none";
      infoWrapper.style.display = "none";
      cyclePanel.querySelector('.bs-card-body').insertBefore(startFormClone, formSection);
    }, { once: true });
  }
}

// ============================================================
// Save session handler with validation
// ============================================================
async function saveSessionHandler(event) {
  const btn = event.target.closest('.tour-cycle-save-session-btn');
  if (!btn) return;

  const cyclePanel = btn.closest('.tour-cycle-panel');
  const cycleNum = cyclePanel.querySelector('.bs-card-title').textContent.split(' ')[1];

  const tabsWithData = checkTabsWithData(cyclePanel, cycleNum);

  if (tabsWithData.length === 0) {
    alert("⚠️  Please fill at least one tab (Crates, Packs, Product, or Net Weight) with data before saving.");
    return;
  }

  const filledTabs = tabsWithData.map(t => t.label).join(', ');
  const emptyTabs = QUALITY_TABS.filter(t => !tabsWithData.find(filled => filled.key === t.key))
    .map(t => t.label)
    .join(', ');

  let message = `✓ Filled Tabs: ${filledTabs}\n`;
  if (emptyTabs) {
    message += `✗ Not Filled: ${emptyTabs}\n\n`;
    message += "Do you want to save only the filled tabs?\n\nOK = Save now\nCancel = Fill all tabs first";
  } else {
    message += "\n✓ All tabs are complete!\n\nReady to save?";
  }

  const confirmed = confirm(message);
  if (!confirmed) return;

  await saveSectionButtonClick(cyclePanel, cycleNum, tabsWithData);
}

// ============================================================
// Reload cycles
// ============================================================
async function reloadFetchCycleData() {
  const existingCycles = await fetchCycleData();
  console.log("Fetched cycles:", existingCycles);

  const parentElement = document.querySelector(".tour-cycle-card-panel-lists");
  if (parentElement) parentElement.innerHTML = '';

  initializePersistentSummary();

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

  if (QualityTourId) updatePersistentSummary(QualityTourId);
  else setSummaryVisible(false);

  setTimeout(() => initializeDatepickers(document), 200);
}

// ============================================================
// Fetch cycle data
// ============================================================
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
    const tableName = "cr3ea_prod_pqi_bakeries";
    const apiUrl =
      `${environmentUrl}/api/data/v${apiVersion}/${tableName}` +
      `?$filter=cr3ea_qualitytourid eq '${QualityTourId}'` +
      `&$select=cr3ea_cycle,cr3ea_batchno,cr3ea_productname,cr3ea_lineno,` +
      `cr3ea_executivename,cr3ea_shift,cr3ea_category,` +
      `cr3ea_packaged,cr3ea_expiry,cr3ea_status,cr3ea_defectcategory,` +
      `cr3ea_defect,cr3ea_majordefect,cr3ea_remarks,cr3ea_itemno,cr3ea_netweight,cr3ea_standardweight`;

    const response = await fetch(apiUrl, { headers });
    if (!response.ok) throw new Error(`Failed to fetch data: ${response.status} - ${await response.text()}`);

    const data = await response.json();
    const cycles = {};

    data.value.forEach(record => {
      const cycleNum = (record.cr3ea_cycle || "").replace('Cycle-', '');

      if (!cycles[cycleNum]) {
        let standardWeight = record?.cr3ea_standardweight;
        if (standardWeight === null || standardWeight === undefined) standardWeight = "N/A";
        else {
          standardWeight = String(standardWeight).trim();
          if (standardWeight === "" || standardWeight === "null") standardWeight = "N/A";
        }

        cycles[cycleNum] = {
          cycleNum,
          batchNo: record.cr3ea_batchno || "N/A",
          product: record?.cr3ea_productname || "N/A",
          executiveName: record?.cr3ea_executivename || "N/A",
          lineNum: record?.cr3ea_lineno || "N/A",
          packaged: record?.cr3ea_packaged || "N/A",
          expiry: record?.cr3ea_expiry || "N/A",
          standardWeight: standardWeight,
          rowsSummary: []
        };
      }

      let rowStandardWeight = record?.cr3ea_standardweight;
      if (rowStandardWeight === null || rowStandardWeight === undefined) rowStandardWeight = cycles[cycleNum].standardWeight;
      else {
        rowStandardWeight = String(rowStandardWeight).trim();
        if (rowStandardWeight === "" || rowStandardWeight === "null") rowStandardWeight = cycles[cycleNum].standardWeight;
      }

      cycles[cycleNum].rowsSummary.push({
        category: record?.cr3ea_category || "",
        itemNum: record?.cr3ea_itemno || "",
        product: record?.cr3ea_productname || "",
        lineNum: record?.cr3ea_lineno || "",
        batchNum: record?.cr3ea_batchno || "",
        executiveName: record?.cr3ea_executivename || "",
        packaged: record?.cr3ea_packaged || "",
        expiry: record?.cr3ea_expiry || "",
        status: record?.cr3ea_status || "",
        defectCategory: record?.cr3ea_defectcategory || "",
        defect: record?.cr3ea_defect || "",
        majorDefect: record?.cr3ea_majordefect || "",
        remarks: record?.cr3ea_remarks || "",
        netWeight: record?.cr3ea_netweight || "",
        standardWeight: rowStandardWeight
      });
    });

    return Object.values(cycles);
  } catch (error) {
    console.error('Error fetching cycle data:', error);
    return [];
  }
}

// ============================================================
// Save cycle
// ============================================================
async function saveSectionButtonClick(cyclePanel, cycleNum, tabsWithData = null) {
  const stepForm = cyclePanel.querySelector('.tour-cyle-step-form');
  const stepCompleted = cyclePanel.querySelector('.tour-cyle-step-completed');

  const overlay = showSaveLoadingOverlay(tabsWithData || QUALITY_TABS);

  try {
    const cycleData = await collectEstimationDataCycleSave(cyclePanel, cycleNum, tabsWithData);
    renderCompletedSection(stepCompleted, cycleData);

    stepForm.style.display = "none";
    stepCompleted.style.display = "block";
    stepCompleted.classList.add("bs-fade-active", "bs-fade-in");

    cyclePanel.classList.add('completed-cycle');
    cyclePanel.classList.remove('bs-card-toggler-is-active');
    cyclePanel.style.cssText = "height: 80px !important; overflow: hidden !important; display: block !important;";
    const currentPanelBody = cyclePanel.querySelector('.bs-card-body');
    currentPanelBody.style.cssText = "max-height: 0px !important; height: 0px !important; overflow: hidden !important; display: block !important;";

    const nextCycleNum = parseInt(cycleNum, 10) + 1;
    if (!document.querySelector(`#cycle-${nextCycleNum}`)) {
      createCycleSection(nextCycleNum, false);
      cycleCounter = nextCycleNum + 1;
    }

    document.querySelectorAll('.bs-card-toggler').forEach(panel => {
      const panelCycleNum = panel.querySelector('.bs-card-title')?.textContent?.split(' ')[1];
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

      setTimeout(() => reinitializeDatepickers(nextCyclePanel), 50);
    }

    closeSaveLoadingOverlay();
    await reloadFetchCycleData();
  } catch (error) {
    closeSaveLoadingOverlay();
    console.error('Error during save:', error);
  }
}

// ============================================================
// Collect rows and save - ONLY for tabs with data (UPDATED: SETS)
// ============================================================
async function collectEstimationDataCycleSave(cyclePanel, cycleNum, tabsWithData = null) {
  const recordsToSave = [];
  const rowsSummary = [];

  const tabsToProcess = tabsWithData || QUALITY_TABS;

  tabsToProcess.forEach(tab => {
    const tabKey = tab.key;
    const categoryLabel = tab.label;

    // ✅ Sets container (same as before)
    const setsContainer = document.querySelector(
      `.quality-tab-panel[data-cycle="${cycleNum}"][data-tab="${tabKey}"] .quality-sets-container`
    );
    const sets = setsContainer ? Array.from(setsContainer.querySelectorAll('.quality-set')) : [];

    const tabConf = QUALITY_TABS.find(t => t.key === tabKey);
    const itemsPerSet = tabConf ? tabConf.count : 1;

    sets.forEach((setEl) => {
      const setIndex = parseInt(setEl.getAttribute('data-set-index') || '1', 10);

      // ✅ NEW: Header is per SET (not per tab)
      const header = getSetHeaderValues(cycleNum, tabKey, setIndex);

      const headerProduct = header.product;
      const headerBatchNo = header.batchNo;
      const headerLineNo = header.lineNo;
      const headerExecutive = header.executiveName;
      const headerPackaged = header.packaged;
      const headerExpiry = header.expiry;
      const headerStandardWeight = header.standardWeight; // null if not NETWEIGHT or empty

      const rows = Array.from(setEl.querySelectorAll('.estimation-row'));

      rows.forEach((row) => {
        const rowIndex = parseInt(row.getAttribute("data-row-index") || '0', 10);

        const badgeError = row.querySelector('.badge-error.badge-fill');
        const badgeSuccess = row.querySelector('.badge-success.badge-fill');
        const status = badgeError ? "Not Okay" : (badgeSuccess ? "Okay" : "");

        const categoryRadio = row.querySelector(
          `input[name="category-${cycleNum}-${tabKey}-${setIndex}-${rowIndex}"]:checked`
        );
        const category = categoryRadio ? categoryRadio.value : "";

        const defect = (row.querySelector(`#defect-${cycleNum}-${tabKey}-${setIndex}-${rowIndex}`)?.value || "").trim();
        const remarks = (row.querySelector(`#remarks-${cycleNum}-${tabKey}-${setIndex}-${rowIndex}`)?.value || "").trim();
        const majorDefect = remarks;

        let netWeight = null;
        if (tabKey === "NETWEIGHT") {
          const netWeightStr = (row.querySelector(`#net-weight-${cycleNum}-${tabKey}-${setIndex}-${rowIndex}`)?.value || "").trim();
          if (netWeightStr !== "") {
            netWeight = parseFloat(netWeightStr);
            if (isNaN(netWeight)) netWeight = null;
          }
        }

        const hasAnyValue = status || category || defect || remarks || netWeight;
        if (!hasAnyValue) return;

        // ✅ itemNum stored as sequential number across sets (keeps numeric for DB)
        const itemNumGlobal = ((setIndex - 1) * itemsPerSet) + rowIndex;

        const record = {
          "cr3ea_qualitytourid": QualityTourId,
          "cr3ea_title": 'PQI_' + moment().format('MM-DD-YYYY'),
          "cr3ea_cycle": `Cycle-${cycleNum}`,
          "cr3ea_shift": sessionStorage.getItem("shiftValue") || "shift 1",
          "cr3ea_observedby": UserName || null,

          // ✅ per-set header values
          "cr3ea_productname": headerProduct || null,
          "cr3ea_batchno": headerBatchNo || null,
          "cr3ea_lineno": headerLineNo || null,
          "cr3ea_executivename": headerExecutive || null,
          "cr3ea_packaged": headerPackaged || null,
          "cr3ea_expiry": headerExpiry || null,
          "cr3ea_standardweight": headerStandardWeight,
          "cr3ea_netweight": netWeight,

          "cr3ea_category": categoryLabel,
          "cr3ea_itemno": itemNumGlobal, // ✅ numeric
          "cr3ea_status": status || null,
          "cr3ea_defectcategory": category || null,
          "cr3ea_defect": defect || null,
          "cr3ea_majordefect": majorDefect || null,
          "cr3ea_remarks": remarks || null,
        };

        recordsToSave.push(record);

        rowsSummary.push({
        category: categoryLabel,

        // ✅ NEW
        setIndex: setIndex,
        itemInSet: rowIndex,

        itemNum: String(itemNumGlobal),
        product: headerProduct,
        lineNum: headerLineNo,
        batchNum: headerBatchNo,
        executiveName: headerExecutive,
        packaged: headerPackaged,
        expiry: headerExpiry,
        status: status,
        defectCategory: category,
        defect: defect,
        majorDefect: majorDefect,
        remarks: remarks,
        netWeight: netWeight !== null ? String(netWeight) : "",
        standardWeight: (headerStandardWeight !== null && headerStandardWeight !== undefined)
            ? String(headerStandardWeight)
            : "N/A"
        });
      });
    });
  });

  if (recordsToSave.length === 0) {
    closeSaveLoadingOverlay();
    alert("Please enter at least one row of data.");
    throw new Error("No rows to save");
  }

  tabsToProcess.forEach(tab => {
    updateTabStatus(tab.key, 'saving', `Saving ${tab.label}...`);
  });

  await savesectionApicall(recordsToSave, tabsToProcess);
  localStorage.removeItem(`cycle-${cycleNum}-start-data`);

  if (QualityTourId) updatePersistentSummary(QualityTourId);

  return {
    cycleNum,
    rowsSummary,
    product: "",
    lineNum: "",
    batchNum: "",
    executiveName: "",
    packaged: "",
    expiry: "",
    standardWeight: ""
  };
}

function getItemsPerSetByCategoryLabel(categoryLabel) {
  // categoryLabel here is "Crates", "Packs", "Product", "Net Weight"
  const tab = QUALITY_TABS.find(t => t.label === categoryLabel);
  return tab ? tab.count : 1;
}

function deriveSetInfo(row) {
  // prefer saved setIndex if present
  const setIndex = row.setIndex ? parseInt(row.setIndex, 10) : null;
  const itemInSet = row.itemInSet ? parseInt(row.itemInSet, 10) : null;

  if (setIndex && itemInSet) return { setIndex, itemInSet };

  // else derive from global itemNum
  const itemNumGlobal = parseInt(row.itemNum || "0", 10);
  if (!itemNumGlobal) return { setIndex: "", itemInSet: "" };

  const itemsPerSet = getItemsPerSetByCategoryLabel(row.category);
  const derivedSet = Math.floor((itemNumGlobal - 1) / itemsPerSet) + 1;
  const derivedItemInSet = ((itemNumGlobal - 1) % itemsPerSet) + 1;

  return { setIndex: derivedSet, itemInSet: derivedItemInSet };
}

// ============================================================
// Summary rendering with statistics table (UNCHANGED)
// ============================================================
function renderCompletedSection(completedSection, cycleData) {
  const container = completedSection.querySelector('.tour-cyle-card-lists');
  if (!container) return;

  const rows = Array.isArray(cycleData.rowsSummary) ? cycleData.rowsSummary : [];

  const wall = computeOverallWallScore(rows);
  const wallText = wall.total === 0
    ? "Overall Status: NA"
    : `Overall Status: ${wall.okay} Okay / ${wall.notOkay} Not Okay (${wall.percentage}% Okay)`;
  const wallStyle = getWallScoreBadgeStyle(wall);

  function getItemsPerSetByCategoryLabel(categoryLabel) {
    const tab = QUALITY_TABS.find(t => t.label === categoryLabel);
    return tab ? tab.count : 1;
  }

  function deriveSetInfo(row) {
    const sIdx = row.setIndex ? parseInt(row.setIndex, 10) : null;
    const iSet = row.itemInSet ? parseInt(row.itemInSet, 10) : null;

    if (sIdx && iSet) return { setIndex: sIdx, itemInSet: iSet };

    const itemNumGlobal = parseInt(row.itemNum || "0", 10);
    if (!itemNumGlobal) return { setIndex: "", itemInSet: "" };

    const itemsPerSet = getItemsPerSetByCategoryLabel(row.category);
    const derivedSet = Math.floor((itemNumGlobal - 1) / itemsPerSet) + 1;
    const derivedItemInSet = ((itemNumGlobal - 1) % itemsPerSet) + 1;

    return { setIndex: derivedSet, itemInSet: derivedItemInSet };
  }

  const groupByCategory = {};
  rows.forEach(r => {
    const cat = r.category || "Unknown";
    if (!groupByCategory[cat]) groupByCategory[cat] = [];
    groupByCategory[cat].push(r);
  });

  const blocksHtml = Object.keys(groupByCategory).map(cat => {
    const categoryRows = groupByCategory[cat];
    let bodyRowsHtml = '';
    let netWeightTableHtml = '';

    if (cat === "Net Weight") {
      // ✅ Group netweight rows by set
      const rowsBySet = {};
      categoryRows.forEach(r => {
        const s = deriveSetInfo(r);
        const key = s.setIndex || "1";
        if (!rowsBySet[key]) rowsBySet[key] = [];
        rowsBySet[key].push(r);
      });

      // ✅ One analysis box per set, using that set's own Std Weight only
      netWeightTableHtml = Object.keys(rowsBySet)
        .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
        .map(setKey => {
          const setRows = rowsBySet[setKey];

          const netWeights = setRows
            .filter(r => r.netWeight !== "" && r.netWeight !== null && r.netWeight !== undefined)
            .map(r => parseFloat(r.netWeight))
            .filter(w => !isNaN(w));

          const avgNetWeight = netWeights.length > 0
            ? (netWeights.reduce((a, b) => a + b, 0) / netWeights.length).toFixed(2)
            : "N/A";

          // ✅ Std Weight ONLY from this set (per-set header value)
          // Pick first valid in THIS set (header should be same for all rows in set)
          let setStdWeight = "N/A";
          const stdRow = setRows.find(r =>
            r.standardWeight !== null &&
            r.standardWeight !== undefined &&
            String(r.standardWeight).trim() !== "" &&
            String(r.standardWeight).trim() !== "N/A"
          );
          if (stdRow) setStdWeight = String(stdRow.standardWeight).trim();

          let giveawayPercent = "N/A";
          if (setStdWeight !== "N/A" && avgNetWeight !== "N/A") {
            const stdW = parseFloat(setStdWeight);
            const avgW = parseFloat(avgNetWeight);
            if (!isNaN(stdW) && stdW > 0 && !isNaN(avgW)) {
              giveawayPercent = (((avgW - stdW) / stdW) * 100).toFixed(2) + '%';
            }
          }

          return `
            <div style="margin:15px 0; padding:12px; background:#e8f5e9; border-radius:6px; border-left:4px solid #27ae60;">
              <h5 style="margin:0 0 10px 0; font-size:14px; font-weight:700; color:#1b5e20;">Net Weight Analysis (Set ${safeHtml(String(setKey))})</h5>
              <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; font-size:13px;">
                <div><label style="color:#666; display:block; margin-bottom:4px;">Std Weight:</label><span style="font-weight:bold; color:#0066cc;">${safeHtml(String(setStdWeight))}</span></div>
                <div><label style="color:#666; display:block; margin-bottom:4px;">Avg Net Weight:</label><span style="font-weight:bold; color:#0066cc;">${safeHtml(String(avgNetWeight))}</span></div>
                <div><label style="color:#666; display:block; margin-bottom:4px;">% Giveaway:</label><span style="font-weight:bold; color:#e74c3c;">${safeHtml(String(giveawayPercent))}</span></div>
              </div>
            </div>
          `;
        })
        .join('');

      // ✅ Table rows (Std Weight shown row-wise; should match set header)
      bodyRowsHtml = categoryRows.map(r => {
        const s = deriveSetInfo(r);
        const rowStd = (r.standardWeight !== null && r.standardWeight !== undefined && String(r.standardWeight).trim() !== "")
          ? String(r.standardWeight).trim()
          : "N/A";

        return `
          <tr>
            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(String(s.setIndex))}</td>
            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(String(s.itemInSet))}</td>

            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(r.product || "")}</td>
            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(r.lineNum || "")}</td>
            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(r.batchNum || "")}</td>
            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(r.executiveName || "")}</td>
            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(r.packaged || "")}</td>
            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(r.expiry || "")}</td>

            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(r.netWeight || "")}</td>
            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(rowStd)}</td>
            <td style="${getRatingCellStyle(r.status)}padding:8px;">${safeHtml(r.status || "")}</td>
            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(r.defectCategory || "")}</td>
            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(r.defect || "")}</td>
            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(r.remarks || "")}</td>
          </tr>
        `;
      }).join('');
    } else {
      bodyRowsHtml = categoryRows.map(r => {
        const s = deriveSetInfo(r);
        return `
          <tr>
            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(String(s.setIndex))}</td>
            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(String(s.itemInSet))}</td>

            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(r.product || "")}</td>
            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(r.lineNum || "")}</td>
            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(r.batchNum || "")}</td>
            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(r.executiveName || "")}</td>
            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(r.packaged || "")}</td>
            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(r.expiry || "")}</td>

            <td style="${getRatingCellStyle(r.status)}padding:8px;">${safeHtml(r.status || "")}</td>
            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(r.defectCategory || "")}</td>
            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(r.defect || "")}</td>
            <td style="border:1px solid #ebeef4; padding:8px;">${safeHtml(r.remarks || "")}</td>
          </tr>
        `;
      }).join('');
    }

    const thead = cat === "Net Weight"
      ? `
        <thead style="background:#f8f9fa;">
          <tr>
            <th style="border:1px solid #ebeef4; padding:8px;">Set</th>
            <th style="border:1px solid #ebeef4; padding:8px;">Item (Set)</th>

            <th style="border:1px solid #ebeef4; padding:8px;">Product</th>
            <th style="border:1px solid #ebeef4; padding:8px;">Line No</th>
            <th style="border:1px solid #ebeef4; padding:8px;">Batch No</th>
            <th style="border:1px solid #ebeef4; padding:8px;">Executive</th>
            <th style="border:1px solid #ebeef4; padding:8px;">Packaged</th>
            <th style="border:1px solid #ebeef4; padding:8px;">Expiry</th>
            <th style="border:1px solid #ebeef4; padding:8px;">Net Weight</th>
            <th style="border:1px solid #ebeef4; padding:8px;">Std Weight</th>
            <th style="border:1px solid #ebeef4; padding:8px;">Status</th>
            <th style="border:1px solid #ebeef4; padding:8px;">Category</th>
            <th style="border:1px solid #ebeef4; padding:8px;">Defect</th>
            <th style="border:1px solid #ebeef4; padding:8px;">Remarks</th>
          </tr>
        </thead>
      `
      : `
        <thead style="background:#f8f9fa;">
          <tr>
            <th style="border:1px solid #ebeef4; padding:8px;">Set</th>
            <th style="border:1px solid #ebeef4; padding:8px;">Item (Set)</th>

            <th style="border:1px solid #ebeef4; padding:8px;">Product</th>
            <th style="border:1px solid #ebeef4; padding:8px;">Line No</th>
            <th style="border:1px solid #ebeef4; padding:8px;">Batch No</th>
            <th style="border:1px solid #ebeef4; padding:8px;">Executive</th>
            <th style="border:1px solid #ebeef4; padding:8px;">Packaged</th>
            <th style="border:1px solid #ebeef4; padding:8px;">Expiry</th>
            <th style="border:1px solid #ebeef4; padding:8px;">Status</th>
            <th style="border:1px solid #ebeef4; padding:8px;">Category</th>
            <th style="border:1px solid #ebeef4; padding:8px;">Defect</th>
            <th style="border:1px solid #ebeef4; padding:8px;">Remarks</th>
          </tr>
        </thead>
      `;

    return `
      <div class="bs-card bs-card-light bs-card-sm" style="margin-top:10px;">
        <div class="bs-card-header">
          <h4 class="bs-card-title">${safeHtml(cat)}</h4>
        </div>
        <div class="bs-card-body" style="overflow-x:auto;">
          ${netWeightTableHtml}
          <table class="bs-table quality-summary-table"
                style="border:1px solid #ebeef4;border-collapse:collapse;width:100%;font-size:12px;">
            ${thead}
            <tbody>${bodyRowsHtml}</tbody>
          </table>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="bs-card bs-card-light bs-card-sm card-opened">
      <div class="bs-card-header" style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <h4 class="bs-card-title bs-font-color-error" style="margin:0;">Cycle ${cycleData.cycleNum} Details</h4>
        <div style="${wallStyle}">${safeHtml(wallText)}</div>
      </div>
      <div class="bs-card-body">
        ${blocksHtml || '<p style="margin:0;">No rows saved.</p>'}
      </div>
    </div>
  `;
}

// ============================================================
// Create cycle section (UNCHANGED from your version)
// ============================================================
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
  const initialBodyStyle = isCompleted
    ? "max-height: 0px !important; height: 0px !important; overflow: hidden !important; display: block !important;"
    : "max-height: none !important; height: auto !important; overflow: visible !important; display: block !important;";

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
      <div class="tour-cyle-step tour-cyle-step-start tour-cyle-step-start-${cycleNum} bs-fade-elem ${isCompleted ? '' : 'bs-fade-active bs-fade-in'}"
           style="display:${initialDisplay};">
        <form class="tour-cyle-info-form">
          <div class="form-group">
            <label class="form-label" for="product-name-${cycleNum}">Product</label>
            <input type="text" class="form-control" id="product-name-${cycleNum}" placeholder="" />
          </div>

          <div class="form-group">
            <label class="form-label" for="batch-no-${cycleNum}">Batch No</label>
            <input type="text" class="form-control" id="batch-no-${cycleNum}" placeholder="" />
          </div>

          <div class="form-group">
            <label class="form-label" for="line-no-${cycleNum}">Line No</label>
            <input type="text" class="form-control" id="line-no-${cycleNum}" placeholder="" />
          </div>

          <div class="form-group">
            <label class="form-label" for="executive-name-${cycleNum}">Executive Name</label>
            <input type="text" class="form-control" id="executive-name-${cycleNum}" placeholder="" />
          </div>

          <div class="form-group datepicker-field">
            <label class="form-label" for="packaged-${cycleNum}">Packaged</label>
            <input type="text" class="form-control" id="packaged-${cycleNum}" placeholder="" />
          </div>

          <div class="form-group datepicker-field">
            <label class="form-label" for="expiry-${cycleNum}">Expiry</label>
            <input type="text" class="form-control" id="expiry-${cycleNum}" placeholder="" />
          </div>

          <div class="form-footer" style="margin-top:20px;">
            <button type="button" id="bs-startSession-${cycleNum}" class="bs-btn bs-btn-primary">Start Session</button>
          </div>
        </form>
      </div>

      <div class="tour-cycle-info-wrapper tour-cycle-info-wrapper-${cycleNum} bs-fade-elem" style="display:${isCompleted ? 'block' : 'none'};"></div>

      <div class="tour-cyle-step tour-cyle-step-form tour-cyle-step-form-${cycleNum} bs-fade-elem" style="display:none;">
        <div class="tour-cycle-estimation-lists">
          <!-- tabs will be injected here on Start Session -->
        </div>
      </div>

      <div class="tour-cyle-step tour-cyle-step-completed tour-cyle-step-completed-${cycleNum} bs-fade-elem" style="display:${isCompleted ? 'block' : 'none'};">
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

  setTimeout(() => reinitializeDatepickers(newCycle), 80);
}

// ============================================================
// Save API call - with tab-specific updates (UNCHANGED)
// ============================================================
async function savesectionApicall(data, tabsWithData = null) {
  try {
    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => (button.disabled = true));

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
    const tableName = "cr3ea_prod_pqi_bakeries";
    const apiUrl = `${environmentUrl}/api/data/v${apiVersion}/${tableName}`;

    let savedCount = 0;
    for (const record of data) {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(record)
      });

      if (!response.ok) throw new Error(`Failed to save record: ${response.status} - ${await response.text()}`);
      console.log('Record saved:', await response.json());
      savedCount++;
    }

    if (tabsWithData) {
      tabsWithData.forEach(tab => {
        updateTabStatus(tab.key, 'saved', `✓ ${tab.label} Saved`);
      });
    }

    showSuccessNotification(`${savedCount} records saved successfully`, data);
    buttons.forEach(button => (button.disabled = false));
  } catch (error) {
    console.error('Error saving records:', error);
    showErrorNotification('Failed to save records. Please try again.');
    document.querySelectorAll("button").forEach(button => (button.disabled = false));

    if (tabsWithData) {
      tabsWithData.forEach(tab => {
        updateTabStatus(tab.key, 'error', `✗ ${tab.label} Failed`);
      });
    }
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
  const el = document.querySelector('.tour-date');
  if (el) el.textContent = moment().format('DD/MM/YYYY');
}

$(document).ready(function () {
  $('#shiftSelect').select2({
    minimumResultsForSearch: -1,
    dropdownAutoWidth: true,
    width: '100%',
  });

  setTimeout(() => initializeDatepickers(document), 200);
});
