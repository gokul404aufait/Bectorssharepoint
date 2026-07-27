
document.addEventListener("DOMContentLoaded", function () {
  // shift popup
  const tourCycleStartPopup = document.querySelector("#tourCycleStartPopup");
  const tourCycleStartPopupOpener = document.querySelectorAll(".tour-cycle-start-popup-opener");

  tourCycleStartPopupOpener.forEach(function (opener) {
    opener.addEventListener("click", function (e) {
      e.preventDefault();

      tourCycleStartPopup.classList.add("is-popup-active");
    });
  });

  // shift select
  $('#startPopupProductSelect').select2({
    minimumResultsForSearch: -1,
    dropdownAutoWidth: true,
    width: '100%',
  });

  // Packaged date picker only 
  new tempusDominus.TempusDominus(document.getElementById('startPopupPackagedDatepicker'), {
    localization: {
      locale: 'en-GB',
    },
    display: {
      viewMode: 'calendar',
      components: {
        decades: true,
        year: true,
        month: true,
        date: true,
        hours: false,
        minutes: false,
        seconds: false
      },
    },
  });

  $('#startPopupPackagedDatepicker').on('change.td', (e) => {
    let selectedDate = e.date;
    console.log('startPopupPackagedDatepicker: ', selectedDate, moment(selectedDate).format('MM-DD-YYYY'));
  });

  // Packaged date picker only 
  new tempusDominus.TempusDominus(document.getElementById('startPopupExpiryDatepicker'), {
    localization: {
      locale: 'en-GB',
    },
    display: {
      viewMode: 'calendar',
      components: {
        decades: true,
        year: true,
        month: true,
        date: true,
        hours: false,
        minutes: false,
        seconds: false
      },
    },
  });

  $('#startPopupExpiryDatepicker').on('change.td', (e) => {
    let selectedDate = e.date;
    console.log('startPopupExpiryDatepicker: ', selectedDate, moment(selectedDate).format('MM-DD-YYYY'));
  });
});