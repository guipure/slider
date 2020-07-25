/* eslint-disable func-names */
import { Presenter } from './Presenter/Presenter';
import { Options } from './interfaces/options';
import { standardOptions } from './interfaces/constants';

declare global {
  interface JQuery {
    slider(options?: any): void
  }
}

(function ($) {
  $.fn.slider = function (options?: any): Presenter {
    const correctOptions: Options = { ...standardOptions, ...options };
    const slider: Presenter = new Presenter(this.get(0), correctOptions);
    return slider;
  };
}(jQuery));
