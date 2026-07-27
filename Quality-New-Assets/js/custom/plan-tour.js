document.addEventListener("DOMContentLoaded", function () {

  const shiftPopup = document.querySelector("#shiftPopup");
  const shiftPopupOpener = document.querySelectorAll(".shift-popup-opener");
  shiftPopupOpener.forEach(function (opener) {
    opener.addEventListener("click", function (e) {
      e.preventDefault();

      shiftPopup.classList.add("is-popup-active");
    });
  });

  const popupCloseBtns = document.querySelectorAll(".popup-close-btn");
  popupCloseBtns.forEach(function (closer) {
    closer.addEventListener("click", function (e) {
      e.preventDefault();

      const popupItem = closer.closest(".main-popup");
      if (!popupItem) return;

      popupItem.classList.remove("is-popup-active");
    });
  });
  // shift select 
  $('#shiftSelect').select2({
    minimumResultsForSearch: -1,
    dropdownAutoWidth: true,
    width: '100%',
  });

  const shiftPopupDoneBtn = document.querySelector("#shiftPopupDone");
  shiftPopupDoneBtn.addEventListener("click", function (e) {
    e.preventDefault();
    shiftPopup.classList.remove("is-popup-active");

    console.log("Shift value: ", $('#shiftSelect').val());
  });

  // card toggle
  const cardToggleTextBtns = document.querySelectorAll(".card-toggle-text-btn");
  cardToggleTextBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();

      const currentCard = btn.closest(".bs-card-toggler");

      if (!currentCard) return;
      const isActive = currentCard.classList.contains("card-opened");
      const answercont = currentCard.querySelector(".bs-card-body");

      currentCard.classList.remove("card-opened");
      answercont.style.maxHeight = null;
      btn.textContent = "View more";

      if (!isActive) {
        currentCard.classList.add("card-opened");
        answercont.style.maxHeight = answercont.scrollHeight + "px";
        btn.textContent = "View less";
      }
    });
  });

  // Cycle panel fields start
  // product select

const panelTogglerBtn = document.querySelectorAll('.bs-card-toggler .bs-card-toggler-btn');

panelTogglerBtn.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    event.preventDefault(); // Prevents default behavior (like form submission)
    
    const currenPanel = btn.closest('.bs-card-toggler');
    const currenPanelBody = currenPanel.querySelector('.bs-card-body');

    currenPanel.classList.toggle('bs-card-toggler-is-active');
    currenPanel.classList.toggle('secondary-bs-card-toggler-is-active');

    if (currenPanelBody.style.maxHeight) {
      currenPanelBody.style.maxHeight = null;
    } else {
      currenPanelBody.style.maxHeight = currenPanelBody.scrollHeight + 'px';
    }
  });
});


  // Expand the default item cbb
  const defaultPanelOpen = document.querySelectorAll('.tour-cycle-panel.bs-card-toggler-is-active');
  defaultPanelOpen.forEach((element) => {
    const defaulPanelBody = element.querySelector('.bs-card-body');
    defaulPanelBody.style.maxHeight = defaulPanelBody.scrollHeight + 'px';
  });

  // not okay select
  $('#notOkayProductSelect-1').select2({
    minimumResultsForSearch: -1,
    dropdownAutoWidth: true,
    width: '100%',
  });
  $('#notOkayProductSelect-2').select2({
    minimumResultsForSearch: -1,
    dropdownAutoWidth: true,
    width: '100%',
  });
  $('#notOkayProductSelect-3').select2({
    minimumResultsForSearch: -1,
    dropdownAutoWidth: true,
    width: '100%',
  });
  $('#notOkayProductSelect-4').select2({
    minimumResultsForSearch: -1,
    dropdownAutoWidth: true,
    width: '100%',
  });




  // Tour Cycle Steps flow start

  

  // Tour Cycle Steps flow end

  // Cycle panel fields end
});
const tourCycleSaveSessionBtns = document.querySelectorAll(
  ".tour-cycle-save-session-btn, .secondary-tour-cycle-save-session-btn, .primary-tour-cycle-save-session-btn, .product-tour-cycle-save-session-btn"
);

tourCycleSaveSessionBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const currentParentPanel = btn.closest(".tour-cycle-panel");
    const panelId = currentParentPanel.id;
    let newCycleId = incrementCycleId(panelId);
    let nextElement = document.getElementById(newCycleId);
    
    if (newCycleId) {
      var nextCycleId = incrementCycleId(newCycleId);
      //$("#" + newCycleId).find(".select2").select2("destroy");
      //$("#" + newCycleId).find(".select2").select2();
    }
    
    let nextCycleElement = document.getElementById(nextCycleId);
    if (nextElement) {
      nextElement.style.display = "block";
    }
    if (nextCycleElement) {
      nextCycleElement.style.display = "block";
    }
    
    const currenParentPanelBody = currentParentPanel.querySelector(".bs-card-body");
    const stepCompleted = currentParentPanel.querySelector(".tour-cyle-step-completed");
    const stepCompletedBody = stepCompleted.querySelector(".bs-card-body");
    const tourCyleStepResult = currentParentPanel.querySelector(".tour-cyle-step-completed");
    const tourCyleStepForm = currentParentPanel.querySelector(".tour-cyle-step-form");
    const planTourSummary = document.getElementById("planTourSummary");

    tourCyleStepForm.classList.remove("bs-fade-in");
    setTimeout(function () {
      tourCyleStepForm.classList.remove("bs-fade-active");
      tourCyleStepResult.classList.add("bs-fade-active");
      planTourSummary.classList.add("bs-fade-active");
      
      setTimeout(function () {
        tourCyleStepResult.classList.add("bs-fade-in");
        planTourSummary.classList.add("bs-fade-in");
        
        currenParentPanelBody.style.maxHeight = null;
        
        const nextPanel = currentParentPanel.nextElementSibling;
        if (nextPanel) {
          const nextPanelBody = nextPanel.querySelector(".bs-card-body");
          nextPanelBody.style.maxHeight = nextPanelBody.scrollHeight + "px";
        }
      }, 10);
    }, 300);
  });
});