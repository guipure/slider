class Slider {
  constructor(anchor: HTMLElement) {
    const slider = '<div class="slider"></div>';
    anchor.insertAdjacentHTML('beforeend', slider);
  }
}

export default Slider;
