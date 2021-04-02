export class Queue<T> {
  private data: T[];

  constructor(data: T[] = []) {
    this.data = data;
  }

  add(data: T): this {
    this.data.push(data);
    return this;
  }

  addMultiple(data: T[]): this {
    this.data.push(...data);
    return this;
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
