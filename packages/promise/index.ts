type TFPromiseStatus = 'pending' | 'fulfilled' | 'rejected';
type TFPromiseReason = unknown;

type TExecutor<T> = (resolve: (value: T) => void, reject: (reason: TFPromiseReason) => void) => void;

export class FPromise<T> {
  private status: TFPromiseStatus = 'pending';
  private value: T;
  private reason: TFPromiseReason;
  private onFulfilledList: ((value: T) => any)[] = [];
  private onRejectedList: ((reason: TFPromiseReason) => any)[] = [];
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
    while (this.onFulfilledList.length) {
      this.onFulfilledList.shift()?.(value);
    }
  }
  private onReject(reason: TFPromiseReason) {
    if (this.status !== 'pending') return;
    this.status = 'rejected';
    this.reason = reason;
    while (this.onRejectedList.length) {
      this.onRejectedList.shift()?.(reason);
    }
  }

  static resolve<T>(value: T) {
    return new FPromise<T>((resolve) => resolve(value));
  }
  static reject<T>(reason: T) {
    return new FPromise<T>((_, reject) => reject(reason));
  }

  public then(onFulfilled?: (value: T) => void, onRejected?: (reason: TFPromiseReason) => void) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (val) => val;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason;
          };

    if (this.status === 'fulfilled') {
      onFulfilled(this.value);
    }
    if (this.status === 'rejected') {
      onRejected(this.reason);
    }
    if (this.status === 'pending') {
      this.onFulfilledList.push(onFulfilled);
      this.onRejectedList.push(onRejected);
    }

    return new FPromise((resolve, reject) => {

    });
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

const test2 = new FPromise((resolve) => {
  setTimeout(() => {
    resolve('成功'); // 1秒后输出 成功
  }, 1000);
}).then(
  (res) => console.log(res),
  (err) => console.log(err),
);

const p33 = new FPromise<number>((resolve, reject) => {
  resolve(100);
})
  .then(
    (res) => 2 * res,
    (err) => console.log(err),
  )
  .then(
    (res) => console.log(res),
    (err) => console.log(err),
  );
