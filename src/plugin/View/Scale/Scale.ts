import bind from 'bind-decorator';

import { sliderOrientation } from '../../interfaces/constants';
import { Component } from '../Component/Component';

class Scale extends Component {
  protected init(): void {
    this.update();
    this.slider.element.append(this.element);
    this.slider.events.subscribe('newViewState', this.update);
  }

  protected create(): HTMLElement {
    const element = document.createElement('div');
    element.className = `slider__scale slider__scale_${this.slider.state.orientation}`;
    element.addEventListener('click', this.onScaleClick);
    return element;
  }

  @bind
  private update(): void {
    if (this.slider.state.hideScale) {
      this.element.style.display = 'none';
      return;
    }

    this.element.style.display = '';
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
    const fragment = document.createDocumentFragment();

    let pxCurrent = 0;

    for (let current = min; current < max; current += inc) {
      if (pxCurrent > pxMax - 50) break;
      this.createScaleValue(fragment, current, pxCurrent);

      pxCurrent += pxInc;
    }

    this.createScaleValue(fragment, max, pxMax);
    this.element.append(fragment);
  }

  private createScaleValue(fragment: DocumentFragment, value: number, position: number): void {
    const { orientation } = this.slider.state;

    const scaleValue = document.createElement('span');
    scaleValue.className = `slider__scale-value slider__scale-value_${orientation}`;
    scaleValue.innerHTML = value.toString();
    fragment.append(scaleValue);

    const convert = this.slider.convertPxToPercent.bind(this.slider);
    const offset = convert(position);
    const side = orientation === sliderOrientation.HORIZONTAL ? 'left' : 'bottom';
    scaleValue.style[side] = `${offset}%`;
  }

  private onScaleClick(event: Event): void {
    const { target } = event;

    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains('slider__scale-value')) return;

    const value = Number(target.innerHTML);

    const scaleEvent = new CustomEvent('scaleclick', { bubbles: true, detail: { event, value } });
    target.dispatchEvent(scaleEvent);
  }
}

export { Scale };
