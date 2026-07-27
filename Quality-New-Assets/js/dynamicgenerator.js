
$(document).ready(function () {
  for (let i = 1; i <= 8; i++) {
    for (let j = 1; j <= 10; j++) {
      let selectElement = $(`#notOkayProductSelect-${i}-${j}`);
      if (selectElement.length) {
        selectElement.select2({
          minimumResultsForSearch: -1,
          dropdownAutoWidth: true,
          width: '100%',
        });
      }
    }
  }

  for (let i = 1; i <= 8; i++) {
    for (let j = 1; j <= 4; j++) {
      let secondarySelect = $(`#secondary-notOkayProductSelect-${i}-${j}`);
      if (secondarySelect.length) {
        secondarySelect.select2({
          minimumResultsForSearch: -1,
          dropdownAutoWidth: true,
          width: '100%',
        });
      }
    }
  }
  for (let i = 1; i <= 8; i++) {
    for (let j = 1; j <= 4; j++) {
      let secondarySelect = $(`#primary-notOkayProductSelect-${i}-${j}`);
      if (secondarySelect.length) {
        secondarySelect.select2({
          minimumResultsForSearch: -1,
          dropdownAutoWidth: true,
          width: '100%',
        });
      }
    }
  }
  for (let i = 1; i <= 8; i++) {
    for (let j = 1; j <= 4; j++) {
      let secondarySelect = $(`#product-notOkayProductSelect-${i}-${j}`);
      if (secondarySelect.length) {
        secondarySelect.select2({
          minimumResultsForSearch: -1,
          dropdownAutoWidth: true,
          width: '100%',
        });
      }
    }
  }
});

// cbb cycle product select
for (let j = 1; j <= 10; j++) {
  $(`#productSelect-${j}`).select2({
    minimumResultsForSearch: -1,
    dropdownAutoWidth: true,
    width: '100%',
  });
}

// secondary cycle product select bs-primary-productSelect-1
for (let j = 1; j <= 10; j++) {
  $(`#bs-secondary-productSelect-${j}`).select2({
    minimumResultsForSearch: -1,
    dropdownAutoWidth: true,
    width: '100%',
  });
}

// primary cycle product select 
for (let j = 1; j <= 10; j++) {
  $(`#bs-primary-productSelect-${j}`).select2({
    minimumResultsForSearch: -1,
    dropdownAutoWidth: true,
    width: '100%',
  });
}

// product cycle product select bs-primary-productSelect-1
for (let j = 1; j <= 10; j++) {
  $(`#bs-product-productSelect-${j}`).select2({
    minimumResultsForSearch: -1,
    dropdownAutoWidth: true,
    width: '100%',
  });
}


// date picker for cbb section
const datePickers = [
  "packagedDatepicker",
  "expiryDatepicker",
  "bs-secondary-packagedDatepicker",
  "bs-secondary-expiryDatepicker",
  "bs-primary-packagedDatepicker",
  "bs-primary-expiryDatepicker",
  "bs-product-packagedDatepicker",
  "bs-product-expiryDatepicker"
];

datePickers.forEach((prefix) => {
  for (let i = 1; i <= 8; i++) {
    new tempusDominus.TempusDominus(document.getElementById(`${prefix}-${i}`), {
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

    // Attach event listener to the first picker of each type
    if (i === 1) {
      $(`#${prefix}-1`).on("change.td", (e) => {
        let selectedDate = e.date;
        console.log(`${prefix}-1: `, selectedDate, moment(selectedDate).format("MM-DD-YYYY"));
      });
    }
  }
});
for (let j = 1; j <= 8; j++) {
  const estimationContainer = document.getElementById(`estimationContainer-${j}`);
  const secondaryContainer = document.getElementById(`secondary-estimationContainer-${j}`);
  const primaryContainer = document.getElementById(`primary-estimationContainer-${j}`);
  const productContainer = document.getElementById(`product-estimationContainer-${j}`);

  if (estimationContainer) {
    for (let i = 1; i <= 10; i++) {
      const card = document.createElement("div");
      card.className = "bs-card bs-card-toggler bs-card-light bs-card-sm tour-cycle-estimation-item";
      card.id = `cbb-${j}-${i}`;
      card.innerHTML = `
        <div class="bs-card-header">
          <h4 class="bs-card-title">CBB ${i}</h4>
          <div class="tour-cycle-estimation-actions">
            <span class="badge badge-lg badge-error cycle-estimation-action-elem">Not Okay</span>
            <span class="badge badge-lg badge-success cycle-estimation-action-elem">Okay</span>
          </div>
        </div>
        <div class="bs-card-body">
          <div class="estimation-not-okay-wrapper">
            <div class="form-group estimation-item-category">
              <label class="form-label" for="not-okay-category-${j}-${i}">Select Category <span class="required-elem">*</span></label>
              <div class="form-check-lists">
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="not-okay-category-a-${j}-${i}" name="not-okay-category-${j}-${i}"  value="Category A" checked>
                  <label class="form-label form-check-label" for="not-okay-category-a-${j}-${i}">Category A</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="not-okay-category-b-${j}-${i}" name="not-okay-category-${j}-${i}" value="Category B">
                  <label class="form-label form-check-label" for="not-okay-category-b-${j}-${i}">Category B</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="not-okay-category-c-${j}-${i}" name="not-okay-category-${j}-${i}" value="Category C">
                  <label class="form-label form-check-label" for="not-okay-category-c-${j}-${i}">Category C</label>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="not-okay-defect-${j}-${i}">Enter Defect <span class="required-elem">*</span></label>
              <input type="text" class="form-control" id="not-okay-defect-${j}-${i}" placeholder="Type Here..." />
            </div>
            <div class="form-group">
              <label class="form-label" for="not-okay-remarks-no-${j}-${i}">Major Defects and Remarks</label>
              <input type="text" class="form-control" id="not-okay-remarks-no-${j}-${i}" placeholder="Type Here..." />
            </div>
          </div>
        </div>
      `;
      estimationContainer.appendChild(card);
    }
  }

  if (secondaryContainer) {
    for (let i = 1; i <= 4; i++) {
      const card = document.createElement("div");
      card.className = "bs-card bs-card-toggler bs-card-light bs-card-sm tour-cycle-estimation-item";
      card.id = `sp-${j}-${i}`;
      card.innerHTML = `
        <div class="bs-card-header">
        <h4 class="bs-card-title">SP ${i}</h4>
          <div class="tour-cycle-estimation-actions">
            <span class="badge badge-lg badge-error cycle-estimation-action-elem">Not Okay</span>
            <span class="badge badge-lg badge-success cycle-estimation-action-elem">Okay</span>
          </div>
        </div>
        <div class="bs-card-body">
          <div class="estimation-not-okay-wrapper">
            <div class="form-group estimation-item-category">
              <label class="form-label" for="not-okay-category-${j}-${i}">Select Category <span class="required-elem">*</span></label>
              <div class="form-check-lists">
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="secondary-not-okay-category-a-${j}-${i}" name="secondary-not-okay-category-${j}-${i}" value="Category A" checked>
                  <label class="form-label form-check-label" for="secondary-not-okay-category-a-${j}-${i}">Category A</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="secondary-not-okay-category-b-${j}-${i}" name="secondary-not-okay-category-${j}-${i}" value="Category B">
                  <label class="form-label form-check-label" for="secondary-not-okay-category-b-${j}-${i}">Category B</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="secondary-not-okay-category-c-${j}-${i}" name="secondary-not-okay-category-${j}-${i}" value="Category C">
                  <label class="form-label form-check-label" for="secondary-not-okay-category-c-${j}-${i}">Category C</label>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="not-okay-defect-${j}-${i}">Enter Defect <span class="required-elem">*</span></label>
              <input type="text" class="form-control" id="secondary-not-okay-defect-${j}-${i}" placeholder="Type Here..." />
            </div>
            <div class="form-group">
              <label class="form-label" for="secondary-not-okay-remarks-no-${j}-${i}">Major Defects and Remarks</label>
              <input type="text" class="form-control" id="secondary-not-okay-remarks-no-${j}-${i}" placeholder="Type Here..." />
            </div>
          </div>
        </div>
      `;
      secondaryContainer.appendChild(card);
    }
  }
  if (primaryContainer) {
    for (let i = 1; i <= 4; i++) {
      const card = document.createElement("div");
      card.className = "bs-card bs-card-toggler bs-card-light bs-card-sm tour-cycle-estimation-item";
      card.id = `pp-${j}-${i}`;
      card.innerHTML = `
        <div class="bs-card-header">
        <h4 class="bs-card-title">PP ${i}</h4>
          <div class="tour-cycle-estimation-actions">
            <span class="badge badge-lg badge-error cycle-estimation-action-elem">Not Okay</span>
            <span class="badge badge-lg badge-success cycle-estimation-action-elem">Okay</span>
          </div>
        </div>
        <div class="bs-card-body">
          <div class="estimation-not-okay-wrapper">
            <div class="form-group estimation-item-category">
              <label class="form-label" for="not-okay-category-${j}-${i}">Select Category <span class="required-elem">*</span></label>
              <div class="form-check-lists">
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="primary-not-okay-category-a-${j}-${i}" name="primary-not-okay-category-${j}-${i}" value="Category A" checked>
                  <label class="form-label form-check-label" for="primary-not-okay-category-a-${j}-${i}">Category A</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="primary-not-okay-category-b-${j}-${i}" name="primary-not-okay-category-${j}-${i}" value="Category B">
                  <label class="form-label form-check-label" for="primary-not-okay-category-b-${j}-${i}">Category B</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="primary-not-okay-category-c-${j}-${i}" name="primary-not-okay-category-${j}-${i}" value="Category C">
                  <label class="form-label form-check-label" for="primary-not-okay-category-c-${j}-${i}">Category C</label>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="not-okay-defect-${j}-${i}">Enter Defect <span class="required-elem">*</span></label>
              <input type="text" class="form-control" id="primary-not-okay-defect-${j}-${i}" placeholder="Type Here..." />
            </div>
            <div class="form-group">
              <label class="form-label" for="primary-not-okay-remarks-no-${j}-${i}">Major Defects and Remarks</label>
              <input type="text" class="form-control" id="primary-not-okay-remarks-no-${j}-${i}" placeholder="Type Here..." />
            </div>
          </div>
        </div>
      `;
      primaryContainer.appendChild(card);
    }
  }
  if (productContainer) {
    for (let i = 1; i <= 4; i++) {
      const card = document.createElement("div");
      card.className = "bs-card bs-card-toggler bs-card-light bs-card-sm tour-cycle-estimation-item";
      card.id = `pr-${j}-${i}`;
      card.innerHTML = `
        <div class="bs-card-header">
        <h4 class="bs-card-title">PP ${i}</h4>
          <div class="tour-cycle-estimation-actions">
            <span class="badge badge-lg badge-error cycle-estimation-action-elem">Not Okay</span>
            <span class="badge badge-lg badge-success cycle-estimation-action-elem">Okay</span>
          </div>
        </div>
        <div class="bs-card-body">
          <div class="estimation-not-okay-wrapper">
            <div class="form-group estimation-item-category">
              <label class="form-label" for="not-okay-category-${j}-${i}">Select Category <span class="required-elem">*</span></label>
              <div class="form-check-lists">
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="product-not-okay-category-a-${j}-${i}" name="product-not-okay-category-${j}-${i}" value="Category A" checked>
                  <label class="form-label form-check-label" for="product-not-okay-category-a-${j}-${i}">Category A</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="product-not-okay-category-b-${j}-${i}" name="product-not-okay-category-${j}-${i}" value="Category B">
                  <label class="form-label form-check-label" for="product-not-okay-category-b-${j}-${i}">Category B</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" id="product-not-okay-category-c-${j}-${i}" name="product-not-okay-category-${j}-${i}" value="Category C">
                  <label class="form-label form-check-label" for="product-not-okay-category-c-${j}-${i}">Category C</label>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="not-okay-defect-${j}-${i}">Enter Defect <span class="required-elem">*</span></label>
              <input type="text" class="form-control" id="product-not-okay-defect-${j}-${i}" placeholder="Type Here..." />
            </div>
            <div class="form-group">
              <label class="form-label" for="product-not-okay-remarks-no-${j}-${i}">Major Defects and Remarks</label>
              <input type="text" class="form-control" id="product-not-okay-remarks-no-${j}-${i}" placeholder="Type Here..." />
            </div>
          </div>
        </div>
      `;
      productContainer.appendChild(card);
    }
  }
}
// Loop through estimationContainer
for (let j = 0; j < estimationContainer.length; j++) {
  for (let i = 0; i < 5; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.id = `estimation-${j}-${i}`;
    card.innerHTML = `
      <div class="bs-card-header">
        <h4 class="bs-card-title">CBB ${i}</h4>
        <div class="tour-cycle-estimation-actions">
          <span class="badge badge-lg badge-error cycle-estimation-action-elem">Not Okay</span>
          <span class="badge badge-lg badge-success cycle-estimation-action-elem">Okay</span>
        </div>
      </div>
      <div class="bs-card-body">
        <div class="estimation-not-okay-wrapper">
          <div class="form-group estimation-item-category">
            <label class="form-label" for="not-okay-category-${j}-${i}">Select Category <span class="required-elem">*</span></label>
            <div class="form-check-lists">
              <div class="form-check">
                <input class="form-check-input" type="radio" id="not-okay-category-a-${j}-${i}" name="not-okay-category-${j}-${i}" value="Category A" checked>
                <label class="form-label form-check-label" for="not-okay-category-a-${j}-${i}">Category A</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" id="not-okay-category-b-${j}-${i}" name="not-okay-category-${j}-${i}" value="Category B">
                <label class="form-label form-check-label" for="not-okay-category-b-${j}-${i}">Category B</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" id="not-okay-category-c-${j}-${i}" name="not-okay-category-${j}-${i}" value="Category C">
                <label class="form-label form-check-label" for="not-okay-category-c-${j}-${i}">Category C</label>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="not-okay-defect-${j}-${i}">Enter Defect <span class="required-elem">*</span></label>
            <input type="text" class="form-control" id="not-okay-defect-${j}-${i}" placeholder="Type Here..." />
          </div>
          <div class="form-group">
            <label class="form-label" for="not-okay-remarks-no-${j}-${i}">Major Defects and Remarks</label>
            <input type="text" class="form-control" id="not-okay-remarks-no-${j}-${i}" placeholder="Type Here..." />
          </div>
        </div>
      </div>
    `;
    estimationContainer[j].appendChild(card);
  }
}

// Loop through secondaryContainer
for (let j = 0; j < secondaryContainer.length; j++) {
  for (let i = 0; i < 5; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.id = `secondary-${j}-${i}`;
    card.innerHTML = `
      <div class="bs-card-header">
      <h4 class="bs-card-title">SP ${i}</h4>
        <div class="tour-cycle-estimation-actions">
          <span class="badge badge-lg badge-error cycle-estimation-action-elem">Not Okay</span>
          <span class="badge badge-lg badge-success cycle-estimation-action-elem">Okay</span>
        </div>
      </div>
      <div class="bs-card-body">
        <div class="estimation-not-okay-wrapper">
          <div class="form-group estimation-item-category">
            <label class="form-label" for="not-okay-category-${j}-${i}">Select Category <span class="required-elem">*</span></label>
            <div class="form-check-lists">
              <div class="form-check">
                <input class="form-check-input" type="radio" id="secondary-not-okay-category-a-${j}-${i}" name="secondary-not-okay-category-${j}-${i}" value="Category A" checked>
                <label class="form-label form-check-label" for="secondary-not-okay-category-a-${j}-${i}">Category A</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" id="secondary-not-okay-category-b-${j}-${i}" name="secondary-not-okay-category-${j}-${i}" value="Category B">
                <label class="form-label form-check-label" for="secondary-not-okay-category-b-${j}-${i}">Category B</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" id="secondary-not-okay-category-c-${j}-${i}" name="secondary-not-okay-category-${j}-${i}" value="Category C">
                <label class="form-label form-check-label" for="secondary-not-okay-category-c-${j}-${i}">Category C</label>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="not-okay-defect-${j}-${i}">Enter Defect <span class="required-elem">*</span></label>
            <input type="text" class="form-control" id="secondary-not-okay-defect-${j}-${i}" placeholder="Type Here..." />
          </div>
          <div class="form-group">
            <label class="form-label" for="secondary-not-okay-remarks-no-${j}-${i}">Major Defects and Remarks</label>
            <input type="text" class="form-control" id="secondary-not-okay-remarks-no-${j}-${i}" placeholder="Type Here..." />
          </div>
        </div>
      </div>
    `;
    secondaryContainer[j].appendChild(card);
  }
}

// Loop through primaryContainer
for (let j = 0; j < primaryContainer.length; j++) {
  for (let i = 0; i < 5; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.id = `primary-${j}-${i}`;
    card.innerHTML = `
      <div class="bs-card-header">
      <h4 class="bs-card-title">PP ${i}</h4>
        <div class="tour-cycle-estimation-actions">
          <span class="badge badge-lg badge-error cycle-estimation-action-elem">Not Okay</span>
          <span class="badge badge-lg badge-success cycle-estimation-action-elem">Okay</span>
        </div>
      </div>
      <div class="bs-card-body">
        <div class="estimation-not-okay-wrapper">
          <div class="form-group estimation-item-category">
            <label class="form-label" for="not-okay-category-${j}-${i}">Select Category <span class="required-elem">*</span></label>
            <div class="form-check-lists">
              <div class="form-check">
                <input class="form-check-input" type="radio" id="primary-not-okay-category-a-${j}-${i}" name="primary-not-okay-category-${j}-${i}" value="Category A" checked>
                <label class="form-label form-check-label" for="primary-not-okay-category-a-${j}-${i}">Category A</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" id="primary-not-okay-category-b-${j}-${i}" name="primary-not-okay-category-${j}-${i}" value="Category B">
                <label class="form-label form-check-label" for="primary-not-okay-category-b-${j}-${i}">Category B</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" id="primary-not-okay-category-c-${j}-${i}" name="primary-not-okay-category-${j}-${i}" value="Category C">
                <label class="form-label form-check-label" for="primary-not-okay-category-c-${j}-${i}">Category C</label>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="not-okay-defect-${j}-${i}">Enter Defect <span class="required-elem">*</span></label>
            <input type="text" class="form-control" id="primary-not-okay-defect-${j}-${i}" placeholder="Type Here..." />
          </div>
          <div class="form-group">
            <label class="form-label" for="primary-not-okay-remarks-no-${j}-${i}">Major Defects and Remarks</label>
            <input type="text" class="form-control" id="primary-not-okay-remarks-no-${j}-${i}" placeholder="Type Here..." />
          </div>
        </div>
      </div>
    `;
    primaryContainer[j].appendChild(card);
  }
}

// Loop through productContainer
for (let j = 0; j < productContainer.length; j++) {
  for (let i = 0; i < 5; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.id = `product-${j}-${i}`;
    card.innerHTML = `
      <div class="bs-card-header">
      <h4 class="bs-card-title">PP ${i}</h4>
        <div class="tour-cycle-estimation-actions">
          <span class="badge badge-lg badge-error cycle-estimation-action-elem">Not Okay</span>
          <span class="badge badge-lg badge-success cycle-estimation-action-elem">Okay</span>
        </div>
      </div>
      <div class="bs-card-body">
        <div class="estimation-not-okay-wrapper">
          <div class="form-group estimation-item-category">
            <label class="form-label" for="not-okay-category-${j}-${i}">Select Category <span class="required-elem">*</span></label>
            <div class="form-check-lists">
              <div class="form-check">
                <input class="form-check-input" type="radio" id="product-not-okay-category-a-${j}-${i}" name="product-not-okay-category-${j}-${i}" value="Category A" checked>
                <label class="form-label form-check-label" for="product-not-okay-category-a-${j}-${i}">Category A</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" id="product-not-okay-category-b-${j}-${i}" name="product-not-okay-category-${j}-${i}" value="Category B">
                <label class="form-label form-check-label" for="product-not-okay-category-b-${j}-${i}">Category B</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" id="product-not-okay-category-c-${j}-${i}" name="product-not-okay-category-${j}-${i}" value="Category C">
                <label class="form-label form-check-label" for="product-not-okay-category-c-${j}-${i}">Category C</label>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="not-okay-defect-${j}-${i}">Enter Defect <span class="required-elem">*</span></label>
            <input type="text" class="form-control" id="product-not-okay-defect-${j}-${i}" placeholder="Type Here..." />
          </div>
          <div class="form-group">
            <label class="form-label" for="product-not-okay-remarks-no-${j}-${i}">Major Defects and Remarks</label>
            <input type="text" class="form-control" id="product-not-okay-remarks-no-${j}-${i}" placeholder="Type Here..." />
          </div>
        </div>
      </div>
    `;
    productContainer[j].appendChild(card);
  }
}


// Handle clicks for all dynamically created elements
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('cycle-estimation-action-elem')) {
    const btn = event.target;
    const currentParent = btn.closest('.tour-cycle-estimation-item');

    currentParent.querySelectorAll('.cycle-estimation-action-elem').forEach((b) => {
      b.classList.remove('badge-fill');
    });

    btn.classList.add('badge-fill');

    const currenPanelBody = currentParent.querySelector('.bs-card-body');
    const currenParentPanel = currentParent.closest('.tour-cycle-panel');
    const currenParentPanelBody = currenParentPanel?.querySelector('.bs-card-body');

    currentParent.classList.toggle('bs-card-toggler-is-active');

    if (btn.classList.contains('badge-error')) {
      if (currenPanelBody.style.maxHeight) {
        currenPanelBody.style.maxHeight = null;
      } else {
        currenPanelBody.style.maxHeight = currenPanelBody.scrollHeight + 'px';
        if (currenParentPanelBody) {
          currenParentPanelBody.style.maxHeight =
            currenParentPanelBody.offsetHeight + currenPanelBody.scrollHeight + 'px';
        }
      }
    }

    if (btn.classList.contains('badge-success')) {
      currenPanelBody.style.maxHeight = null;
      if (currenParentPanelBody) {
        currenParentPanelBody.style.maxHeight =
          currenParentPanelBody.offsetHeight + currenPanelBody.scrollHeight + 'px';
      }
    }
  }
});

