"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FPromise = void 0;
var FPromise = /** @class */ (function () {
    function FPromise(executor) {
        this.status = 'pending';
        try {
            executor(this.onResolve.bind(this), this.onReject.bind(this));
        }
        catch (error) {
            this.onReject(error);
        }
    }
    FPromise.prototype.onResolve = function (value) {
        var _a;
        if (this.status !== 'pending')
            return;
        this.status = 'fulfilled';
        this.value = value;
        (_a = this.onFulfilled) === null || _a === void 0 ? void 0 : _a.call(this, value);
    };
    FPromise.prototype.onReject = function (reason) {
        var _a;
        if (this.status !== 'pending')
            return;
        this.status = 'rejected';
        this.reason = reason;
        (_a = this.onRejected) === null || _a === void 0 ? void 0 : _a.call(this, reason);
    };
    FPromise.prototype.then = function (onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function (val) { return val; };
        onRejected =
            typeof onRejected === 'function'
                ? onRejected
                : function (reason) {
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
    };
    FPromise.prototype.catch = function (onRejected) {
        this.then(undefined, onRejected);
    };
    return FPromise;
}());
exports.FPromise = FPromise;
var p1 = new FPromise(function (resolve, reject) {
    resolve('成功');
    reject('失败');
});
console.log('p1', p1);
var p2 = new FPromise(function (resolve, reject) {
    reject('失败');
    resolve('成功');
});
console.log('p2', p2);
var p3 = new FPromise(function () {
    throw '报错';
});
console.log('p3', p3);
var test = new FPromise(function (resolve, reject) {
    resolve('成功');
}).then(function (res) { return console.log(res); }, function (err) { return console.log(err); });
var p22 = new FPromise(function (resolve, reject) {
    setTimeout(function () {
        reject('失败');
    }, 1000);
}).then(function (res) { return console.log(res); }, function (err) { return console.log(err); });
