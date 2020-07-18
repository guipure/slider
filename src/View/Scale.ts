import { View } from './View';

class Scale {
  private element: HTMLElement;

  constructor(private slider: View) {
    this.element = this.createScale();
    this.init();
  }

  private init(): void {
    this.update();
    this.slider.element.append(this.element);
    this.slider.events.subscribe('newViewState', this.update.bind(this));
  }

  private createScale(): HTMLElement {
    const element = document.createElement('div');
    element.className = `scale scale_${this.slider.state.orientation}`;
    element.addEventListener('click', this.onClick);
    return element;
  }

  private update(): void {
    if (this.slider.state.hide_scale) {
      this.element.style.display = 'none';
      return;
    }

    this.element.style.display = 'block';
    this.element.innerHTML = '';
    this.element.className = `scale scale_${this.slider.state.orientation}`;

    this.insertScaleValues();
  }

  private calculateIncrement(valueMax: number, valueStep: number): number {
    let inc;
    const { pxMax, pxStep } = this.slider.state;
    const quantity = Math.ceil(pxMax / pxStep);

    if (quantity <= 10) {
      inc = valueStep;
    } else if (valueMax < 1000) {
      inc = Math.round(quantity / 7) * valueStep;
    } else {
      inc = Math.round(quantity / 5) * valueStep;
    }

    return inc;
  }

  private insertScaleValues(): void {
    const { pxMax, pxStep, values } = this.slider.state;
    const { min, max, step } = values;
    const inc = this.calculateIncrement(max, step);

    let pxCurrent = 0;

    for (let current = min; current <= max - inc; current += inc) {
      this.element.append(this.createScaleValue(current, pxCurrent));
      pxCurrent += (inc / step) * pxStep;
    }

    this.element.append(this.createScaleValue(max, pxMax));
  }

  private createScaleValue(value: number, position: number): HTMLElement {
    const scaleValue = document.createElement('span');
    scaleValue.className = 'scale__value';
    scaleValue.innerHTML = value.toString();

    if (this.slider.state.orientation === 'horizontal') {
      const width = 50;
      scaleValue.style.width = `${width}px`;
      scaleValue.style.left = `${position - width / 2}px`;
    } else {
      const height = 20;
      scaleValue.style.height = `${height}px`;
      scaleValue.style.top = `${position - height / 2}px`;
    }
    return scaleValue;
  }

  private onClick(event: Event): void {
    const { target } = event;
    if (!(target instanceof HTMLElement)) return;
    if (target.className !== 'scale__value') return;
    const value: number = Number(target.innerHTML);
    const scaleEvent = new CustomEvent('scaleclick', { bubbles: true, detail: { event, value } });
    target.dispatchEvent(scaleEvent);
  }
}

export { Scale };
