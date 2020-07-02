class View {
  constructor(public anchor: HTMLElement = document.body) { 
    this.render()
  }

  private render(): void {
    const template = `
      <div class="slider">
        <div class="track"></div>
        <div class="thumb"></div>
        <div class="thumb"></div>
      </div>
    `
    this.anchor.innerHTML = template
  }
}

export default View