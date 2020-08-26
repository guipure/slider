import { Presenter } from '../../Presenter/Presenter';
import { Options } from '../../interfaces/interfaces';
import { settingsTemplate } from './settingsTemplate';
import './settings.scss';

class Settings {
  public state: Options;

  private form: HTMLFormElement;

  constructor(private slider: Presenter) {
    this.state = slider.getOptions();
    this.form = this.createForm();
    this.createSettings();
    this.initValues();
    this.slider.events.subscribe('newViewState', this.updateFromTo.bind(this));
  }

  public updateFromTo(newSetting: any) {
    this.state = { ...this.state, ...newSetting };
    this.initValues();
  }

  private createForm(): HTMLFormElement {
    const form = document.createElement('form');
    form.className = 'settings';
    this.slider.anchor.append(form);
    return form;
  }

  private createSettings() {
    this.form.insertAdjacentHTML('beforeend', settingsTemplate);
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
          input.onchange = () => this.setStep(Number(input.value));
          input.value = this.state.step.toString();
          break;

        case 'from':
          input.onchange = () => this.onFromInputChange(Number(input.value));
          input.value = this.state.from.toString();
          break;

        case 'to':
          input.onchange = () => this.onToInputChange(Number(input.value));
          input.value = this.state.to.toString();
          break;

        case 'orientation':
          input.onchange = () => this.setState({ orientation: input.value });
          if (input.value === 'horizontal') {
            if (this.state.orientation === 'horizontal') {
              input.checked = true;
            }
          } else if (this.state.orientation === 'vertical') {
            input.checked = true;
          }
          break;

        case 'type':
          input.onchange = () => this.setState({ type: input.value });
          if (input.value === 'single') {
            if (this.state.type === 'single') {
              input.checked = true;
            }
          } else if (this.state.type === 'double') {
            input.checked = true;
          }
          break;

        case 'hideFromTo':
          input.onchange = () => this.setState({ hideFromTo: input.value === 'true' });
          if (input.value === 'true') {
            if (this.state.hideFromTo === true) {
              input.checked = true;
            }
          } else if (this.state.hideFromTo === false) {
            input.checked = true;
          }
          break;

        case 'hideScale':
          input.onchange = () => this.setState({ hideScale: input.value === 'true' });
          if (input.value === 'true') {
            if (this.state.hideScale === true) {
              input.checked = true;
            }
          } else if (this.state.hideScale === false) {
            input.checked = true;
          }
          break;
        // no default
      }
    });
  }

  private setState(newSetting: any) {
    newSetting = this.checkMinMax(newSetting);
    this.state = { ...this.state, ...newSetting };
    this.slider.setOptions(this.state);
  }

  private checkMinMax(setting: any) {
    const { max, min } = setting;

    if (max) {
      if (max < this.state.min) {
        return { min: max };
      }
    } else if (min) {
      if (min > this.state.max) {
        return { max: min };
      }
    }

    return setting;
  }

  private setStep(num: number): void {
    const step = num > 1 ? Math.round(num) : 1;
    this.setState({ step });
  }

  private onFromInputChange(num: number): void {
    const { min } = this.state;
    const isValid = num >= min;
    const from = isValid ? num : min;
    this.setState({ from });
  }

  private onToInputChange(num: number): void {
    const { max } = this.state;
    const isValid = num <= max;
    const to = isValid ? num : max;
    this.setState({ to });
  }
}

export { Settings };
