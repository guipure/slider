import View from './View';

class Scale {
  private element: HTMLElement;

  constructor(private slider: View) {
    this.element = document.createElement('div');
    this.element.className = `scale_${slider.state.orientation}`;
    this.element.addEventListener('click', this.onClick);
    this.initScale();
    this.slider.element.append(this.element);
    this.initScale = this.initScale.bind(this);
    slider.events.subscribe('newViewState', this.initScale);
  }

  private initScale(): void {
    if (this.slider.state.hide_scale) {
      this.element.style.display = 'none';
      return;
    }
    this.element.style.display = 'block';

    const { values } = this.slider.state;
    const { pxValues } = this.slider;

    if (!values || !pxValues) throw Error('Values not found');

    this.element.innerHTML = '';
    this.element.className = `scale_${this.slider.state.orientation}`;
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

  private onClick(event: Event) {
    if (event.target instanceof HTMLElement) {
      const value: number = Number(event.target.innerHTML);
      const scaleEvent = new CustomEvent('scaleclick', { bubbles: true, detail: { event, value } });
      event.target.dispatchEvent(scaleEvent);
    }
  }
}

export { Scale };
