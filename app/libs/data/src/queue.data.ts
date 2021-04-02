export class Queue<T> {
  private data: T[];
  private onDataAdded: () => void = undefined;

  constructor(data: T[] = []) {
    this.data = data;
  }

  add(data: T): this {
    this.data.push(data);

    this.callOnAdded();

    return this;
  }

  addMultiple(data: T[]): this {
    this.data.push(...data);

    this.callOnAdded();

    return this;
  }

  onAdded(callback: () => void): this {
    this.onDataAdded = callback;

    return this;
  }

  private callOnAdded() {
    if (this.onDataAdded) {
      this.onDataAdded();
    }
  }

  get(): T {
    if (this.size() === 0) {
      return null;
    }

    return this.data.shift();
  }

  peek(): T {
    if (this.size() === 0) {
      return null;
    }

    return this.data[0];
  }

  size(): number {
    return this.data.length;
  }

  getData(): T[] {
    return this.data;
  }

  remove(idx: number) {
    this.data = this.data.filter((_, id) => id !== idx);
  }
}
