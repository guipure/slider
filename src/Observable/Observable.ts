type EventCallback = (data?: any) => void;

interface Callbacks {
  [key: string]: Array<EventCallback>
}

class Observable {
  private callbacks: Callbacks = {};

  public subscribe(eventType: string, callback: EventCallback): void {
    const eventCallbacks = this.callbacks[eventType];

    if (eventCallbacks) {
      eventCallbacks.push(callback);
    } else {
      this.callbacks[eventType] = [callback];
    }
  }

  public notify(eventType: string, data?: object): void {
    const eventCallbacks = this.callbacks[eventType];

    if (eventCallbacks) {
      eventCallbacks.forEach((eventCallback: EventCallback) => {
        eventCallback(data);
      });
    }
  }
}

export { Observable };
