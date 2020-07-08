import EventManager from '../EventManager/EventManager';
import { Options } from '../Presenter/Options';

class Settings {
  public events: EventManager;

  private form: HTMLFormElement;

  constructor(private anchor: HTMLElement, public state: Options) {
    this.events = new EventManager();
    this.form = document.createElement('form');
    this.form.className = 'settings';
    anchor.append(this.form);
    this.createSettings();
    this.initValues();
  }

  private createSettings() {
    const settingsTemplate = `
    <label class="settings__label">
      <p class="settings__name">min</p>
      <input class="settings__input" type="number" name="min">
    </label>

    <label class="settings__label">
      <p class="settings__name">max</p>
      <input class="settings__input" type="number" name="max">
    </label>

    <label class="settings__label">
      <p class="settings__name">step</p>
      <input class="settings__input" type="number" name="step">
    </label>

    <label class="settings__label">
      <p class="settings__name">from</p>
      <input class="settings__input" type="number" name="from">
    </label>

    <label class="settings__label">
      <p class="settings__name">to</p>
      <input class="settings__input" type="number" name="to">
    </label>

    <label class="settings__label">
      <p class="settings__name">orientation</p>
      <label>
        horizontal
        <input class="settings__input" type="radio" name="orientation" value="horizontal">
      </label>
      <label>
        vertical
        <input class="settings__input" type="radio" name="orientation" value="vertical">
      </label>
    </label>
    
    <label class="settings__label">
      <p class="settings__name">type</p>
      <label>
        single
        <input class="settings__input" type="radio" name="type" value="single">
      </label>
      <label>
        double
        <input class="settings__input" type="radio" name="type" value="double">
      </label>
    </label>
    `;

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
          const stepCheck = (num: number): number => (num > 0 ? num : 1);
          input.onchange = () => this.setState({ step: stepCheck(Number(input.value)) });
          input.value = this.state.step.toString();
          break;
        case 'from':
          const onChangeFrom = () => {
            let from = Number(input.value);
            if (from < this.state.min) {
              from = this.state.min;
            }
            this.setState({ from });
            input.value = from.toString();
          };
          input.onchange = onChangeFrom;
          input.value = this.state.from.toString();
          break;
        case 'to':
          const onChangeTo = () => {
            let to = Number(input.value);
            if (to > this.state.max) {
              to = this.state.max;
            }
            this.setState({ to });
            input.value = to.toString();
          };
          input.onchange = onChangeTo;
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
      }
    });
  }

  private setState(newSetting: any) {
    this.state = { ...this.state, ...newSetting };
    this.events.notify('newSettings', this.state);
  }
}

export { Settings };
