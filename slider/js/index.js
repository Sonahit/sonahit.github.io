import slider from "./slider.js";
const root = document.getElementById("root").cloneNode(true);
let sl = slider("#root", { slidesToShow: 1 });

const range = document.getElementById("range");
let changeTimeout = 0;
document.getElementById("range-select").value = parseInt(range.value);

range.addEventListener("change", e => {
  const input = document.getElementById("range-select");
  input.value = parseInt(e.target.value);
  const setChangeSlider = () => {
    return setTimeout(() => {
      document.getElementById("root").replaceWith(root.cloneNode(true));
      const { target } = e;
      const range = parseInt(target.value);
      let sl = slider("#root", {
        slidesToShow: range
      });
    }, 1000);
  };
  if (changeTimeout) clearTimeout(changeTimeout);
  changeTimeout = setChangeSlider();
});

range.addEventListener("input", e => {
  const input = document.getElementById("range-select");
  input.value = parseInt(e.target.value);
});

document.getElementById("checkbox").addEventListener("change", e => {
  const { target } = e;
  const autoScrolling = target.checked;
  sl.options.autoplay = autoScrolling;
});
