import { Presenter } from './Presenter/Presenter';
import { Options } from './interfaces/interfaces';
import { standardOptions } from './interfaces/constants';

declare global {
  interface JQuery {
    slider(options?: any): Presenter
  }
}

// eslint-disable-next-line func-names
(function ($) {
  $.fn.slider = function init(options?: any): Presenter {
    const correctOptions: Options = { ...standardOptions, ...options };
    const slider: Presenter = new Presenter(this.get(0), correctOptions);
    return slider;
  };
}(jQuery));
