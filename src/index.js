//According to .popup-menu_button scaleY(X);
import "./assets/css/index.css";
import "./assets/logo.jpg";

let flip = -1;

(function() {
  //Init default listeners
  popupLogic();
  modalShow();

  function popupLogic() {
    const popupBtn = document.querySelector(".popup-menu_button");
    popupBtn.addEventListener("mousedown", ev => {
      flip = -flip;
      ev.target.style.transform = `translate(-50%, -100%) scaleY(${flip})`;
      popupStatus(flip);
    });
  }

  function modalShow() {
    const modalAccess = document.querySelector(".header_reservable");
    const modalOuter = document.querySelector(".modal_outer");
    const modalExit = document.querySelector(".modal_exit");
    const showHideModal = () => {
      const modal = document.querySelector(".modal--hidden") || document.querySelector(".modal--visible");
      if (modal.classList.contains("modal--hidden")) {
        modal.classList.remove("modal--hidden");
        modal.classList.add("modal--visible");
      } else {
        modal.classList.remove("modal--visible");
        modal.classList.add("modal--hidden");
      }
    };
    modalAccess.addEventListener("mousedown", () => {
      showHideModal();
    });
    modalOuter.addEventListener("mousedown", () => {
      showHideModal();
    });
    modalExit.addEventListener("mousedown", () => {
      showHideModal();
    });
  }
})();

function popupStatus(flip) {
  const popupMenu = document.querySelector(".popup-menu");
  for (let i = 0; i < popupMenu.classList.length; i++) {
    if (popupMenu.classList.contains("hidden") && flip === 1) {
      popupMenu.classList.remove("hidden");
    } else if (flip === -1 && !popupMenu.classList.contains("hidden")) {
      popupMenu.classList.add("hidden");
    }
  }
}
