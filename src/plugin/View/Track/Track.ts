import { View } from '../View/View';
import { Bar } from '../Bar/Bar';
import { Component } from '../Component/Component';

class Track extends Component {
  constructor(slider: View) {
    super(slider);
    this.initBar();
  }

  protected init(): void {
    this.slider.element.append(this.element);
  }

  protected create(): HTMLElement {
    const element = document.createElement('div');
    element.className = `slider__track slider__track_${this.slider.state.orientation}`;
    return element;
  }

  private initBar(): void {
    const bar = new Bar(this.slider);
    this.element.append(bar.getElement());
  }
}

export { Track };
