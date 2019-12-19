/**
 * @typedef {Object} Options
 * @property {number} Options.slidesToShow
 * @property {boolean} Options.autoplay
 * @property {number} Options.autoplayTime duration
 * @property {number} Options.slideSpeed speed in milliseconds to slide
 */

/**
 * @typedef {Object[]} Styles
 * @property {string} Styles[].key
 * @property {string} Styles[].value
 */

function splitArray(arr, chunkSize) {
  const chunks = [];
  if (!Array.isArray(arr)) arr = Array.from(arr);
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
}

class Slider {
  /**
   * @param {string} elemIdentifier
   * @param {Options} options
   */
  constructor(elemIdentifier, options = {}) {
    this.options = options;
    this.elem = elemIdentifier;
    this.currentPage = 0;
    this.prevPage = null;
    this.chunks = [];
    this.isShifting = false;
    this.currentPosition = 0;
  }

  /**
   * @returns {Options}
   */
  get options() {
    return this._options;
  }
  /**
   * @param {string} elemIdentifier
   */
  set elem(elemIdentifier) {
    this._elem = elemIdentifier;
  }
  /**
   * @returns {HTMLElement}
   */
  get elem() {
    return document.querySelector(this._elem);
  }
  /**
   * @param {Options}
   */
  set options(options) {
    if (!options.autoplay) options.autoplay = false;
    if (!options.autoplaySpeed) options.autoplayTime = 5000;
    if (!options.slidesToShow) options.slidesToShow = 3;
    if (!options.slideSpeed) options.slideSpeed = 1000;
    this._options = Object.assign({}, options);
  }

  get sliderHolder() {
    return this.elem.querySelector(".slider__content");
  }

  get pages() {
    return this.chunks.length - 1;
  }

  set currentPosition(pos) {
    this._currentPosition = pos;
  }
  get currentPosition() {
    return this._currentPosition;
  }

  /**
   *
   * @param {HTMLElement} elem
   * @param {string} className
   */
  appendChildClass(elem, className) {
    Array.from(elem.children).forEach(ch => (ch ? ch.classList.add(className) : ""));
  }

  autoplay() {
    this.autoplayInterval = setInterval(() => {
      if (!this.options.autoplay) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = 0;
      } else {
        this.shiftSlider(1);
      }
    }, this.options.autoplayTime);
  }

  initAutoplay() {
    setInterval(() => {
      if (this.options.autoplay && !this.autoplayInterval) {
        this.autoplay();
      }
    }, 1000);
  }

  initSlider() {
    this.max = this.elem.children.length - 1;
    this.elem.classList.add("slider");
    this.appendChildClass(this.elem, "slider__elements");
    const childFlexBasis = [
      {
        key: "flexBasis",
        value: (100 / this.options.slidesToShow).toFixed(2)
      }
    ];
    Array.from(this.elem.children).forEach(ch => this.appendChildClass(ch, "slider__element"));

    const sliderHolder = document.createElement("div");
    sliderHolder.classList.add("slider__content");
    // this.toggleSlideSpeed(sliderHolder);
    const [leftArrow, rightArrow] = this.initArrows();

    const innerContent = Array.from(this.elem.children).map(el => {
      const inner = document.createElement("div");
      inner.classList.add("slider__inner");
      inner.appendChild(el);
      return inner;
    });

    this.chunks = splitArray(innerContent, this.options.slidesToShow);

    const firstClone = this.chunks[0].map((el, i) => {
      const clone = el.cloneNode(true);
      clone.className = "slider__inner clone";
      clone.setAttribute("clone-index", `+${i + 1}`);
      return clone;
    });

    const lastClone = this.chunks[this.chunks.length - 1].map((el, i) => {
      const clone = el.cloneNode(true);
      clone.className = "slider__inner clone";
      clone.setAttribute("clone-index", `-${i + 1}`);
      return clone;
    });

    this.chunks.forEach(chunk =>
      chunk.forEach(el => {
        if (chunk.length !== this.options.slidesToShow) {
          childFlexBasis.forEach(style => {
            const width = ((style.value * this.options.slidesToShow) / chunk.length).toFixed(2);
            el.style[style.key] = `${width}%`;
          });
        } else {
          childFlexBasis.forEach(style => (el.style[style.key] = `${style.value}%`));
        }
      })
    );

    const leftCloneHolder = document.createElement("div");
    const rightCloneHolder = document.createElement("div");
    leftCloneHolder.className = "slider__holder clone";
    rightCloneHolder.className = "slider__holder clone";

    lastClone.forEach(el => leftCloneHolder.appendChild(el));
    firstClone.forEach(el => rightCloneHolder.appendChild(el));

    sliderHolder.appendChild(leftCloneHolder);

    this.chunks.forEach(chunk => {
      const holder = document.createElement("div");
      holder.classList.add("slider__holder");
      chunk.forEach(el => {
        holder.appendChild(el);
      });
      sliderHolder.appendChild(holder);
    });

    sliderHolder.appendChild(rightCloneHolder);

    if (this.max <= this.options.slidesToShow - 1) {
      leftArrow.style.display = "none";
      rightArrow.style.display = "none";
    }

    this.elem.appendChild(leftArrow);
    this.elem.appendChild(sliderHolder);
    this.elem.appendChild(rightArrow);
    this.elem.appendChild(this.initDots(this.chunks.length));
    this.initAutoplay();
  }

  initArrows() {
    const leftArrow = document.createElement("div");
    leftArrow.className = "arrow__left";
    const rightArrow = document.createElement("div");
    rightArrow.className = "arrow__right";
    const arrows = [leftArrow, rightArrow];
    arrows.forEach(arrow =>
      arrow.addEventListener("click", e => {
        const direction = e.target.classList.contains("arrow__right") ? 1 : -1;
        this.shiftSlider(direction);
      })
    );
    return arrows;
  }

  /**
   *
   * @param {number} length
   */
  initDots(length) {
    const dotsHolder = document.createElement("div");
    dotsHolder.classList.add("dots");
    const dots = Array.from({ length }).map((_, i) => {
      const dot = document.createElement("div");
      dot.classList.add("dots__element");
      dot.setAttribute("dot-page", i);
      dot.addEventListener("click", e => {
        if (!this.isShifting) {
          const { target } = e;
          Array.from(target.parentNode.children).forEach(c => (c.classList.contains("active") ? c.classList.toggle("active") : ""));
          const prevDot = this.elem.querySelector(`[dot-page='${this.currentPage}']`);
          if (prevDot) {
            prevDot.classList.remove("active");
          }
          this.moveSlider(parseInt(target.getAttribute("dot-page")));
        }
      });
      return dot;
    });
    dots[0].classList.toggle("active");
    dotsHolder.append(...dots);
    return dotsHolder;
  }
  /**
   *
   * @param {HTMLElement} el
   */
  toggleSlideSpeed(el) {
    if (!el.style.transition) return (el.style.transition = `all ${this.options.slideSpeed}ms ease`);
    el.style.transition = "";
  }
  /**
   *
   * @param {HTMLElement} el
   */
  removeSlideSpeed(el) {
    if (el.style.transition) return (el.style.transition = ``);
  }
  /**
   *
   * @param {HTMLElement} el
   */
  refreshSlideSpeed(el) {
    if (!el.style.transition) return (el.style.transition = `all ${this.options.slideSpeed}ms ease`);
  }
  /**
   *
   * @param {number} direction
   */
  shiftSlider(direction) {
    if (!this.isShifting) {
      const prevDot = this.elem.querySelector(`[dot-page='${this.currentPage}']`);
      this.prevPage = this.currentPage;
      this.currentPage = this.currentPage + direction;
      const dot = this.elem.querySelector(`[dot-page='${this.currentPage}']`);
      if (dot && prevDot) {
        prevDot.classList.toggle("active");
        dot.classList.toggle("active");
      }
      this.move(this.currentPage);
    }
  }
  /**
   *
   * @param {number} page
   */
  moveSlider(page) {
    if (!this.isShifting) {
      this.prevPage = this.currentPage;
      this.currentPage = page;
      const dot = this.elem.querySelector(`[dot-page='${this.currentPage}']`);
      dot.classList.add("active");
      this.move(this.currentPage);
    }
  }
  /**
   *
   * @param {number} page
   */
  move(page) {
    this.isShifting = true;
    let move = page * 100 * -1;
    // if on edges try to mock first or last elements
    if (page >= this.pages + 1 || page <= -1) {
      const dots = Array.from(document.querySelector(".dots").children);
      dots.forEach(c => (c.classList.contains("active") ? c.classList.remove("active") : ""));
      if (page >= this.pages + 1) dots[0].classList.add("active");
      if (page <= -1) dots[this.pages].classList.add("active");
      /**
       * Сделал по заданию перемещение слайдера через setInterval без css transitions.
       * Хотя самый наилучший вариант, по-моему, через css transform + transitions.
       */
      const interval = setInterval(() => {
        if (move === this.currentPosition) {
          if (page >= this.pages + 1) {
            move = 0;
            this.currentPage = 0;
          } else if (page <= -1) {
            move = this.pages * 100 * -1;
            this.currentPage = this.pages;
          }
          // this.removeSlideSpeed(this.sliderHolder);
          this.currentPosition = move;
          this.sliderHolder.style.left = `${move}%`;
          this.isShifting = false;
          clearInterval(interval);
        }
      }, 100);
    }
    this.changePos(move);
    // this.refreshSlideSpeed(this.sliderHolder);

    // this.sliderHolder.style.transform = `translateX(${move}%)`;
    // setTimeout(() => (this.isShifting = false), (this.currentPage * 100) / this.options.slideSpeed);
  }
  /**
   *
   * @param {number} pos
   */
  changePos(pos) {
    const direction = this.currentPage <= this.prevPage ? 1 : -1;
    const interval = setInterval(() => {
      if (direction === -1 && Math.abs(this.currentPosition) > Math.abs(pos) - 1) {
        this.isShifting = false;
        return clearInterval(interval);
      } else if (direction === 1 && this.currentPosition >= pos) {
        this.isShifting = false;
        return clearInterval(interval);
      }
      this.currentPosition += direction;
      this.sliderHolder.style.left = `${this.currentPosition}%`;
    }, this.currentPage / this.options.slideSpeed);
  }
}

/**
 * @param {string} elemIdentifier
 * @param {Options} options
 */
const slider = (elemIdentifier, options) => {
  const s = new Slider(elemIdentifier, options);
  s.initSlider();
  return s;
};

export default slider;
