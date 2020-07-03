import Presenter from './Presenter/Presenter';

const presenter = new Presenter();

declare global {
  interface JQuery {
    slider(): void
  }
}

(function ($) {
  $.fn.slider = function () {
    alert('wow');
  };
}(jQuery));
