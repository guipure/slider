import bind from 'bind-decorator';

import { Presenter } from '../../plugin/Presenter/Presenter';
import { Options } from '../../plugin/interfaces/interfaces';
import { sliderType, sliderOrientation } from '../../plugin/interfaces/constants';
import { settingsTemplate } from './settingsTemplate';
import './settings.scss';
import './panel.scss';

class Settings {
  public state: Options;

  private form: HTMLFormElement;

  constructor(private slider: Presenter) {
    this.state = slider.getOptions();
    this.form = this.createForm();
    this.init();
  }

  @bind
  public updateFromTo(newSetting: Partial<Options>) {
    this.state = { ...this.state, ...newSetting };
    this.initValues();
  }

  private init() {
    this.createSettings();
    this.initValues();
    this.createPanel();
    this.slider.events.subscribe('newModelState', this.updateFromTo);
  }

  private createForm(): HTMLFormElement {
    const form = document.createElement('form');
    form.className = 'settings';
    return form;
  }

  private createSettings() {
    this.form.insertAdjacentHTML('beforeend', settingsTemplate);
  }

  private createPanel(): void {
    const panel = document.createElement('div');
    panel.className = 'panel';
    const demo = document.querySelector('.js-demo') as HTMLElement;
    demo.append(panel);
    panel.append(this.slider.anchor);
    panel.append(this.form);
  }

  private initValues() {
    const inputs = this.form.querySelectorAll('input');

    inputs.forEach((input: HTMLInputElement) => {
      switch (input.name) {
        case 'min':
          input.onchange = () => this.setState({ min: Number(input.value) });
          input.value = this.state.min.toString();
          break;

        case 'max':
          input.onchange = () => this.setState({ max: Number(input.value) });
          input.value = this.state.max.toString();
          break;

        case 'step':
          input.onchange = () => this.setState({ step: Number(input.value) });
          input.value = this.state.step.toString();
          break;

        case 'from':
          input.onchange = () => this.onFromChange(input);
          input.value = this.state.from.toString();
          input.step = this.state.step.toString();
          break;

        case 'to':
          input.onchange = () => this.setState({ to: Number(input.value) });
          input.value = this.state.to.toString();
          input.step = this.state.step.toString();
          input.disabled = this.state.type === sliderType.SINGLE;
          break;

        case 'orientation':
          input.onchange = () => this.setState({ orientation: input.value });
          input.checked = input.value === sliderOrientation.HORIZONTAL
            ? this.state.orientation === sliderOrientation.HORIZONTAL
            : this.state.orientation === sliderOrientation.VERTICAL;
          break;

        case 'type':
          input.onchange = () => this.setState({ type: input.value });
          input.checked = input.value === sliderType.SINGLE
            ? this.state.type === sliderType.SINGLE
            : this.state.type === sliderType.DOUBLE;
          break;

        case 'hideFromTo':
          input.onchange = () => this.setState({ hideFromTo: input.checked });
          input.checked = this.state.hideFromTo;
          break;

        case 'hideScale':
          input.onchange = () => this.setState({ hideScale: input.checked });
          input.checked = this.state.hideScale;
          break;
        // no default
      }
    });
  }

  @bind
  private onFromChange(input: HTMLInputElement) {
    const from = Number(input.value);
    from === this.state.to
      ? (input.value = this.state.from.toString())
      : this.setState({ from });
  }

  private setState(newSetting: {}) {
    this.state = { ...this.state, ...newSetting };
    this.slider.setOptions(this.state);
  }
}

export { Settings };
