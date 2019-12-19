document.querySelector(".top__logo__button").addEventListener("click", e => {
  const button = e.currentTarget;
  button.classList.add("labdub");
  setTimeout(() => {
    button.classList.remove("labdub");
  }, 1500);
});

document.querySelector(".social__button.hide").addEventListener("click", e => {
  const button = e.currentTarget;
  button.parentNode.classList.toggle("hide");
});
