import EventListener from './EventListener';

interface Listeners {
  [key: string]: Array<EventListener>
}

class EventManager {
  private listeners: Listeners = {}

  public subscribe(eventType: string, listener: EventListener): void {
    const eventListeners = this.listeners[eventType];

    if (eventListeners) {
      eventListeners.push(listener);
    } else {
      this.listeners[eventType] = [listener];
    }
  }

  public unsubscribe(eventType: string, listener: EventListener): void {
    this.listeners[eventType] = this.listeners[eventType].filter(
      (eventListener: EventListener) => eventListener !== listener,
    );
  }

  public notify(eventType: string, data: object = null): void {
    const eventListeners = this.listeners[eventType];

    if (eventListeners) {
      eventListeners.forEach((eventListener: EventListener) => {
        eventListener.update(data);
      });
    }
  }
}

export default EventManager;
