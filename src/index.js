//According to .popup-menu_button scaleY(X);
import "./assets/css/index.css";
import "./assets/images/logo.png";
import "./assets/images/dining_room.png";
import "./assets/images/walking.png";
import "./assets/images/white_room.png";
import "./assets/images/lock.png";
import "./assets/images/nav_mob.png";

const imageDir = "";
let flip = -1;

(function() {
  //Init default listeners
  popupLogic();
  modalShow();
  sliderListener();
  mobileListener();

  function popupLogic() {
    const popupBtn = document.getElementsByClassName("popup-menu_button");
    for (let i = 0; i < popupBtn.length; i++) {
      popupBtn[i].addEventListener("mousedown", ev => {
        flip = -flip;
        ev.target.style.transform = `translate(-50%, -100%) scaleY(${flip})`;
        popupStatus(flip, i);
        const selected = document.querySelector(".main_slider--selection");
        //Hiding select dots
        setTimeout(
          () => {
            selected.style.zIndex = -selected.style.zIndex || -1;
          },
          flip === -1 ? 35 * 10 : 10 * 10
        );
      });
    }
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

  function sliderListener() {
    const normalDotClass = "main_slider_dot--inner";
    const activeDotClass = `active`;
    const pages = document.getElementsByClassName(normalDotClass);
    for (let i = 0; i < pages.length; i++) {
      const slider = document.querySelector(".main_content_slider");
      pages[i].addEventListener("mousedown", ev => {
        const prevActive = document.querySelector(`.${activeDotClass}`);
        if (ev.target.className === normalDotClass) {
          prevActive.className = normalDotClass;
          ev.target.className = `${normalDotClass} ${activeDotClass}`;
          slider.className = `main_content_slider main_content_slider--${i}`;
        }
      });
    }
  }

  function mobileListener() {
    const listener = document.querySelector(".nav_mobile--listener");
    listener.addEventListener("mousedown", () => {
      const nav = document.querySelector(".nav_mobile_content--hidden") || document.querySelector(".nav_mobile_content--visible");
      if (nav.className.includes("hidden")) {
        nav.className = "nav_mobile_content--visible";
      } else {
        nav.className = "nav_mobile_content--hidden";
      }
    });
  }
})();

function popupStatus(flip, index) {
  const popupMenu = document.querySelector(`.popup-menu--${index}`);
  for (let i = 0; i < popupMenu.classList.length; i++) {
    if (popupMenu.classList.contains("hidden") && flip === 1) {
      popupMenu.classList.remove("hidden");
    } else if (flip === -1 && !popupMenu.classList.contains("hidden")) {
      popupMenu.classList.add("hidden");
    }
  }
}
