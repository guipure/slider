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
    element.className = `slider__scale slider__scale_${this.slider.state.orientation}`;
    element.addEventListener('click', this.onClick);
    return element;
  }

  private update(): void {
    if (this.slider.state.hideScale) {
      this.element.style.display = 'none';
      return;
    }

    this.element.style.display = 'block';
    this.element.innerHTML = '';
    this.element.className = `slider__scale slider__scale_${this.slider.state.orientation}`;

    this.insertScaleValues();
  }

  private calculateIncrement(step: number): number {
    const { pxMax, pxStep } = this.slider.state;
    const quantity = Math.ceil(pxMax / pxStep);
    const inc = Math.ceil(quantity / 5) * step;
    return inc;
  }

  private insertScaleValues(): void {
    const {
      pxMax, pxStep, min, max, step,
    } = this.slider.state;
    const inc = this.calculateIncrement(step);
    const pxInc = (inc / step) * pxStep;

    let pxCurrent = 0;

    for (let current = min; current < max; current += inc) {
      if (pxCurrent > pxMax - 50) break;
      this.appendScaleValue(this.element, current, pxCurrent);
      pxCurrent += pxInc;
    }

    this.appendScaleValue(this.element, max, pxMax);
  }

  private appendScaleValue(anchor: HTMLElement, value: number, position: number): void {
    const scaleValue = document.createElement('span');
    scaleValue.className = 'slider__scale-value';
    scaleValue.innerHTML = value.toString();
    anchor.append(scaleValue);
    const convert = this.slider.convertPxToPercent.bind(this.slider);

    if (this.slider.state.orientation === 'horizontal') {
      const width = convert(50);
      const left = convert(position - 50 / 2);
      scaleValue.style.width = `${width}%`;
      scaleValue.style.left = `${left}%`;
    } else {
      const height = convert(20);
      const top = convert(position - 20 / 2);
      scaleValue.style.height = `${height}%`;
      scaleValue.style.top = `${top}%`;
    }
  }

  private onClick(event: Event): void {
    const { target } = event;
    if (!(target instanceof HTMLElement)) return;
    if (target.className !== 'slider__scale-value') return;
    const value: number = Number(target.innerHTML);
    const scaleEvent = new CustomEvent('scaleclick', { bubbles: true, detail: { event, value } });
    target.dispatchEvent(scaleEvent);
  }
}

export { Scale };
