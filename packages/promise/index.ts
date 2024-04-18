type TFPromiseStatus = 'pending' | 'fulfilled' | 'rejected';
type TFPromiseReason = unknown;

type TExecutor<T> = (resolve: (value: T) => void, reject: (reason: TFPromiseReason) => void) => void;

export class FPromise<T> {
  private status: TFPromiseStatus = 'pending';
  private value: T;
  private reason: TFPromiseReason;
  private onFulfilled?: (value: T) => void;
  private onRejected?: (reason: TFPromiseReason) => void;
  constructor(executor: TExecutor<T>) {
    try {
      executor(this.onResolve.bind(this), this.onReject.bind(this));
    } catch (error) {
      this.onReject(error);
    }
  }

  private onResolve(value: T) {
    if (this.status !== 'pending') return;
    this.status = 'fulfilled';
    this.value = value;
    this.onFulfilled?.(value);
  }
  private onReject(reason: TFPromiseReason) {
    if (this.status !== 'pending') return;
    this.status = 'rejected';
    this.reason = reason;
    this.onRejected?.(reason);
  }

  public then(onFulfilled?: (value: T) => void, onRejected?: (reason: TFPromiseReason) => void) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (val) => val;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason;
          };

    this.onFulfilled = onFulfilled;
    this.onRejected = onRejected;

    if (this.status === 'fulfilled') {
      this.onFulfilled(this.value);
    }
    if (this.status === 'rejected') {
      this.onRejected(this.reason);
    }
    this.onReject;

    return this;
  }
  public catch(onRejected?: (reason: TFPromiseReason) => void) {
    this.then(undefined, onRejected);
  }
}

let p1 = new FPromise((resolve, reject) => {
  resolve('成功');
  reject('失败');
});
console.log('p1', p1);

let p2 = new FPromise((resolve, reject) => {
  reject('失败');
  resolve('成功');
});
console.log('p2', p2);

let p3 = new FPromise(() => {
  throw '报错';
});
console.log('p3', p3);

const test = new FPromise((resolve, reject) => {
  resolve('成功');
}).then(
  (res) => console.log(res),
  (err) => console.log(err),
);

const p22 = new FPromise((resolve, reject) => {
  setTimeout(() => {
    reject('失败');
  }, 1000);
}).then(
  (res) => console.log(res),
  (err) => console.log(err),
);
