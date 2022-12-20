export class Queue<T> {
  store: T[];

  constructor(_store: T[] = []) {
    this.store = _store;
  }

  enqueue(element: T): void {
    this.store.push(element);
  }

  dequeue(): T | undefined {
    return this.store.shift();
  }

  isEmpty(): boolean {
    return this.store.length === 0;
  }
}
