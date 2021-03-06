import { Observable } from './Observable';

test('Observable can notify a subscriber', () => {
  const manager = new Observable();
  const callback = jest.fn();
  manager.subscribe('eventName', callback);
  manager.notify('eventName');
  expect(callback.mock.calls.length).toBe(1);
});

test('Observable can notify a few subscribers', () => {
  const manager = new Observable();
  const callbacks = [jest.fn(), jest.fn(), jest.fn()];
  manager.subscribe('eventName', callbacks[0]);
  manager.subscribe('eventName', callbacks[1]);
  manager.subscribe('eventName', callbacks[2]);
  manager.notify('eventName');

  callbacks.forEach((callback) => expect(callback.mock.calls.length).toBe(1));
});

test('Observable can provide data to subscribers', () => {
  const manager = new Observable();
  const callback = jest.fn((data): string => data.text);
  const text = 'it is a very important text';
  const data = { text };
  manager.subscribe('newText', callback);
  manager.notify('newText', data);
  expect(callback.mock.results[0].value).toBe(text);
});
