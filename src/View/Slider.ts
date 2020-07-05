class Slider {
  public element: HTMLElement;

  constructor(anchor: HTMLElement) {
    this.element = document.createElement('div');
    this.element.className = 'slider';
    anchor.append(this.element);
  }

  public getSliderPosition() {
    return this.element.getBoundingClientRect()
  }
}

export default Slider;
