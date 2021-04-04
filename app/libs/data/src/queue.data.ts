export type OnDataAdded<T> = (
  type: 'single' | 'multiple',
  data: T | T[]
) => void;

export class Queue<T> {
  private data: T[];
  private onDataAdded: OnDataAdded<T>;

  constructor(data: T[] = []) {
    this.data = data;
  }

  add(data: T): this {
    this.data.push(data);

    this.callOnAdded('single', data);

    return this;
  }

  addMultiple(data: T[]): this {
    this.data.push(...data);

    this.callOnAdded('multiple', data);

    return this;
  }

  onAdded(callback: OnDataAdded<T>): this {
    this.onDataAdded = callback;

    return this;
  }

  private callOnAdded(type: 'single' | 'multiple', data: T | T[]) {
    if (this.onDataAdded) {
      this.onDataAdded(type, data);
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

  clear() {
    this.data = [];
  }
}
