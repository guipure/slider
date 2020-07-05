class Slider {
  public sliderDiv: HTMLElement;

  constructor(anchor: HTMLElement) {
    this.sliderDiv = document.createElement('div');
    this.sliderDiv.className = 'slider';
    anchor.append(this.sliderDiv);
  }

  public getSliderPosition() {
    return this.sliderDiv.getBoundingClientRect()
  }
}

export default Slider;
