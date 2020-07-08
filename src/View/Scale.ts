import View from "./View";

class Scale {
  private element: HTMLElement;

  constructor(private slider: View) {
    this.element = document.createElement('span');
    this.element.className = `scale_${slider.state.orientation}`;
    this.initScale();
    this.slider.element.append(this.element);
    this.initScale = this.initScale.bind(this);
    slider.events.subscribe('newViewState', this.initScale);
  }

  private initScale() {
    const values = this.slider.state.values;

    if (!values) throw Error('Values not found');

    this.element.innerHTML = '';
    this.element.className = `scale_${this.slider.state.orientation}`;
    let inc;

    if (values.length <= 10) {
      inc = 1;
    } else {
      inc = Math.round(values.length / 10);
    }

    for (let index = 0; index < values.length; index += inc) {
      this.element.append(this.createScaleValue(values[index]));
    }
  }

  private createScaleValue(value: number): HTMLElement {
    const scaleValue = document.createElement('span');
    scaleValue.className = 'scale__value';
    scaleValue.innerHTML = value.toString();
    return scaleValue;
  }
}

export { Scale };