"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var Queue_exports = {};
__export(Queue_exports, {
  Queue: () => Queue
});
module.exports = __toCommonJS(Queue_exports);
class Queue {
  constructor(capacity = Infinity) {
    this.capacity = capacity;
    this.storage = [];
  }
  enqueue(item) {
    if (this.size() === this.capacity) {
      throw Error("Queue has reached max capacity, you cannot add more items");
    }
    this.storage.push(item);
  }
  dequeue() {
    return this.storage.shift();
  }
  size() {
    return this.storage.length;
  }
  isEmpty() {
    return this.size() === 0;
  }
  first() {
    return this.storage.at(0);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Queue
});
//# sourceMappingURL=Queue.js.map
