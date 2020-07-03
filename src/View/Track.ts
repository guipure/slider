class Track {
  constructor(anchor: HTMLElement) {
    const track = '<div class="track"></div>'
    const slider = anchor.querySelector(".slider");
    slider && slider.insertAdjacentHTML('beforeend', track);
  }
}

export default Track;
