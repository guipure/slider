import EventListener from './EventListener'

class EventManager {
  private listeners: object = {}

  public subscribe(eventType: string, listener: EventListener) {
    const eventListeners = this.listeners[eventType]
    
    if (eventListeners) {
      eventListeners.push(listener)
    } else {
      this.listeners[eventType] = [listener]
    }
  }

  public unsubscribe(eventType: string, listener: EventListener) {
    this.listeners[eventType] = this.listeners[eventType].filter(
      (eventListener: EventListener) => eventListener !== listener
    )
  }

  public notify(eventType: string, data: any = null) {
    const eventListeners = this.listeners[eventType]
    
    if (eventListeners) {
      eventListeners.forEach((eventListener: EventListener) => {
        eventListener.update(data)
      })
    } 
  }
}

export default EventManager