import { ViewOptions } from '../Presenter/Options';
import Track from './Track';
import Thumb from './Thumb';
import EventManager from '../EventManager/EventManager';
import { Scale } from './Scale';

class View {
  public state: ViewOptions;

  public events: EventManager;

  public element: HTMLElement = document.body;

  private track?: Track;

  private thumb?: Thumb;

  private otherThumb?: Thumb;

  constructor(private anchor: HTMLElement, private options: ViewOptions) {
    this.state = { ...options };
    this.events = new EventManager();
    this.createSlider();
    this.setState = this.setState.bind(this);
  }

  public setState(newState: any) {
    const currentState: ViewOptions = this.state;
    this.state = { ...currentState, ...newState };
    if (this.state.values) {
      this.createPxValues(this.state.values);
    }

    if (currentState.orientation !== newState.orientation) {
      this.element.remove();
      this.createSlider();
    } else {
      this.events.notify('newViewState', this.state);
    }
  }

  private createSlider(): void {
    this.element = document.createElement('div');
    this.element.className = 'slider';
    this.element.addEventListener('trackclick', this.onTrackClick.bind(this));
    this.element.addEventListener('scaleclick', this.onScaleClick.bind(this));
    this.anchor.prepend(this.element);
    if (this.state.values) {
      this.createPxValues(this.state.values);
    }
    this.track = new Track(this);
    this.thumb = new Thumb(this);
    this.otherThumb = new Thumb(this);
    new Scale(this);
  }

  private onTrackClick(event: any) {
    let value: number;

    if (this.state.orientation === 'horizontal') {
      value = this.convertPxToValue(event.detail.clientX);
    } else {
      value = this.convertPxToValue(event.detail.clientY);
    }
    
    const fromDistance = Math.abs(this.state.from - value);
    const toDistance = Math.abs(this.state.to - value);

    if (fromDistance < toDistance) {
      this.setState( {from: value});
    } else {
      this.setState( {to: value});
    }
  }

  private onScaleClick(event: any) {
    const value = event.detail.value;
    const fromDistance = Math.abs(this.state.from - value);
    const toDistance = Math.abs(this.state.to - value);

    if (fromDistance < toDistance) {
      this.setState( {from: value});
    } else {
      this.setState( {to: value});
    }
  }

  private convertPxToValue(coordinate: number): number {
    let sliderStart;

    if (this.state.orientation === 'horizontal') {
      sliderStart = this.getSliderPosition().left;
    } else {
      sliderStart = this.getSliderPosition().top;
    }

    if (!this.state.values || !this.state.pxValues) throw Error('Values not found');
    const index = this.closestIndex(this.state.pxValues, coordinate - sliderStart);

    return this.state.values[index];
  }

  private closestIndex(array: number[], value: number) {
    const diffArray = array.map((x) => Math.abs(x - value));
    const minDiff = Math.min(...diffArray);
    return diffArray.findIndex((x) => x === minDiff);
  }

  private closestThumb(coordinate: number): Thumb {
    if (!this.thumb) {
      throw Error('Thumb not found');
    }

    if (!this.otherThumb) {
      return this.thumb;
    }

    const thumbHalfWidth = this.thumb.element.getBoundingClientRect().width / 2;
    const side: 'left' | 'top' = this.state.orientation === 'horizontal' ? 'left' : 'top';
    const thumbPosition = this.thumb.element.getBoundingClientRect()[side] + thumbHalfWidth;
    const otherThumbPosition = this.otherThumb.element.getBoundingClientRect()[side] + thumbHalfWidth;

    if (Math.abs(thumbPosition - coordinate) < Math.abs(otherThumbPosition - coordinate)) {
      return this.thumb;
    }
    return this.otherThumb;
  }

  public getSliderPosition() {
    return this.element.getBoundingClientRect();
  }

  private createPxValues(values: number[]): void {
    const sliderPosition = this.getSliderPosition();
    let sliderLength;

    if (this.state.orientation === 'horizontal') {
      sliderLength = sliderPosition.width;
    } else {
      sliderLength = sliderPosition.height;
    }

    const pxValues = [];
    const pxStep = sliderLength / (values.length - 1);
    let pxValue = 0;
    
    while (pxValues.length < values.length) {
      pxValues.push(pxValue);
      pxValue += pxStep;
    }

    this.state.pxValues = pxValues;
  }
}

export default View;
