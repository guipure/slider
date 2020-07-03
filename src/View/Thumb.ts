class Thumb {
  constructor(anchor: HTMLElement) {
    const slider = anchor.querySelector(".slider");
    const thumb = this.createThumb();
    slider && slider.append(thumb);
  }

  private createThumb(): HTMLElement {
    const thumb = document.createElement('div');
    thumb.className = "thumb";
    thumb.addEventListener('mousedown', this.thumbHandler);
    return thumb;
  }

  private thumbHandler(event: any) {
    const thumb: HTMLElement = event.currentTarget;
    moveThumbAt(event.pageX);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    function moveThumbAt(coordinate: number) {
      const thumbWidth: number = Number.parseInt(getComputedStyle(thumb).width);
      thumb.style.left = coordinate - thumbWidth + "px";
    }

    function onMouseMove(event: any) {
      moveThumbAt(event.pageX);
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }
  }
}

export default Thumb;
