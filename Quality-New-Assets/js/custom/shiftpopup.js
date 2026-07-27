
// Open popup on page load
window.addEventListener("load", function () {
    const shiftPopup = document.querySelector(".shift-popup");
const shiftPopupOpener = document.querySelectorAll(".shift-popup-opener");
let storedValue = sessionStorage.getItem("shiftValue");
  if (userDepratmentId != 39) {
    shiftPopup.classList.remove("is-popup-active");
  } else {
    document.getElementById("shiftBadge").innerText = storedValue;
    shiftPopup.classList.add("is-popup-active");
  }
});

//chnage shift
const shiftChange = () => {
  const shift = document.querySelector("#shiftSelect").value;
  sessionStorage.setItem("shiftValue", shift);
  document.getElementById("shiftBadge").innerText = shift;
  shiftpopupcloser()
}

//cancel button click shift popup
const popupCancelBtns = document.querySelectorAll(".cancel-button-click");
popupCancelBtns.forEach(function (closer) {
  closer.addEventListener("click", function (e) {
    e.preventDefault();

    const popupItem = closer.closest(".main-popup");
    if (!popupItem) return;

    popupItem.classList.remove("is-popup-active");
  });
});

function shiftpopupopener(){
    const shiftPopup = document.querySelector("#shiftPopup");
    if (shiftPopup){shiftPopup.classList.add("is-popup-active");}
}
function shiftpopupcloser(){
    const shiftPopup = document.querySelector("#shiftPopup");
    if (shiftPopup){shiftPopup.classList.remove("is-popup-active");}
}