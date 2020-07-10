import { ViewOptions } from '../Presenter/Options';
import Track from './Track';
import Thumb from './Thumb';
import EventManager from '../EventManager/EventManager';
import { Scale } from './Scale';
import Presenter from '../Presenter/Presenter';

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
    if (!this.state.values) throw Error('Values not found');
    this.createPxValues(this.state.values);

    if (newState.orientation && currentState.orientation !== newState.orientation) {
      this.element.remove();
      this.createSlider();
    }
    
    const {from, to, type, values} = this.state;

    if (to < from && type !== 'single') {
      [this.state.to, this.state.from] = [from, to];
    }

    if (to === from && type !== 'single') {
      const index = values.findIndex(val => val === to);
      if (index + 1 < values.length) {
        this.state.to = values[index + 1];
      } else if (index > 0) {
        this.state.from = values[index - 1];
      }
    }

    this.events.notify('newViewState', this.state);
  }

  public getThumbsPositions(): number[] {
    const thumbs = this.element.querySelectorAll('.thumb');

    const calculatePosition = (element: any): number => {
      const prop: 'left' | 'top' = this.state.orientation === 'horizontal' ? 'left' : 'top';
      return element.getBoundingClientRect()[prop] + element.getBoundingClientRect().width;
    };

    const thumbsPositions: number[] = [calculatePosition(thumbs[0]), calculatePosition(thumbs[1])].sort((a, b) => a - b);
    return thumbsPositions
  }

  private createSlider(): void {
    this.element = document.createElement('div');
    this.element.className = 'slider';
    this.element.addEventListener('trackclick', this.onTrackClick.bind(this));
    this.element.addEventListener('scaleclick', this.onScaleClick.bind(this));
    this.element.addEventListener('thumbmousedown', this.onThumbMouseDown.bind(this));
    this.anchor.prepend(this.element);
    if (this.state.values) {
      this.createPxValues(this.state.values);
    }
    this.thumb = new Thumb(this);
    this.otherThumb = new Thumb(this);
    this.track = new Track(this);
    new Scale(this);
  }

  private onTrackClick(event: any): void {
    let value: number;

    if (this.state.orientation === 'horizontal') {
      value = this.convertPxToValue(event.detail.clientX);
    } else {
      value = this.convertPxToValue(event.detail.clientY);
    }

    if (this.state.type === 'single') {
      this.setState( {from: value});
      return;
    }
    
    const fromDistance = Math.abs(this.state.from - value);
    const toDistance = Math.abs(this.state.to - value);

    if (fromDistance < toDistance) {
      this.setState( {from: value});
    } else {
      this.setState( {to: value});
    }
  }

  private onScaleClick(event: any): void {
    const value = event.detail.value;

    if (this.state.type === 'single') {
      this.setState( {from: value});
      return;
    }

    const fromDistance = Math.abs(this.state.from - value);
    const toDistance = Math.abs(this.state.to - value);

    if (fromDistance < toDistance) {
      this.setState( {from: value});
    } else {
      this.setState( {to: value});
    }
  }

  private setFromTo(side: 'from' | 'to', coordinate: number): void {
    const value = this.convertPxToValue(coordinate);
    const fromDistance = Math.abs(this.state.from - value);
    const toDistance = Math.abs(this.state.to - value);

    if (this.state.type === 'single') {
      if (fromDistance) {
        this.setState( {from: value});
        return;
      }
    }

    if (fromDistance * toDistance === 0) return;

    if (side === 'from') {
      if (this.state.to > value) {
        this.setState( {from: value});
      }
    } else {
      if (this.state.from < value) {
        this.setState( {to: value});
      }
    }
  }

  private isFromOrTo(coordinate: number): 'from' | 'to' {
    const thumbsPositions = this.getThumbsPositions();
    const fromDistancePx = Math.abs(thumbsPositions[0] - coordinate);
    const toDistancePx = Math.abs(thumbsPositions[1] - coordinate);
 
    return (fromDistancePx < toDistancePx) ? 'from' : 'to'
  }

  private onThumbMouseDown(event: any): void {
    const isHorizontal = this.state.orientation === 'horizontal'
    let axis: 'clientX' | 'clientY' = isHorizontal ? 'clientX' : 'clientY';

    const side = this.isFromOrTo(event.detail[axis])
    this.setFromTo(side, event.detail[axis]);

    const onMouseMove = (event: any) => {
      this.setFromTo(side, event[axis]);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
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
