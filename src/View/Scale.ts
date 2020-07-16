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

    const { values, pxValues } = this.slider.state;
    this.insertScaleValues(values, pxValues);
  }

  private calculateIncrement(values: number[]): number {
    let inc;
    const maxIndex = values.length - 1;
    const max = values[maxIndex];

    if (values.length <= 10) {
      inc = 1;
    } else if (max < 1000) {
      inc = Math.round(values.length / 7);
    } else {
      inc = Math.round(values.length / 5);
    }

    return inc;
  }

  private insertScaleValues(values: number[], pxValues: number[]): void {
    const inc = this.calculateIncrement(values);
    const maxIndex = values.length - 1;
    const max = values[maxIndex];

    for (let index = 0; index < maxIndex; index += inc) {
      if (maxIndex - index < inc) break;
      this.element.append(this.createScaleValue(values[index], pxValues[index]));
    }

    this.element.append(this.createScaleValue(max, pxValues[maxIndex]));
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
