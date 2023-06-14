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
var Solexa2Message_exports = {};
__export(Solexa2Message_exports, {
  Solexa2Message: () => Solexa2Message
});
module.exports = __toCommonJS(Solexa2Message_exports);
class Solexa2Message {
  constructor(byteArray) {
    this.byteArrayExt = new Uint8Array(byteArray.length + 4);
    this.byteArrayExt.set(byteArray, 2);
    this.messageAddLength(this.byteArrayExt);
    this.messageAddCheckSum(this.byteArrayExt);
  }
  messageAddLength(byteArray) {
    const length = byteArray.length - 4;
    byteArray[0] = length & 255;
    byteArray[1] = length >> 8 & 255;
  }
  messageAddCheckSum(byteArray) {
    let calculatedCheckSum = 0;
    for (let pos = 0; pos < byteArray.length - 2; pos++) {
      calculatedCheckSum += byteArray[pos] & 255;
    }
    byteArray[byteArray.length - 2] = calculatedCheckSum & 255;
    byteArray[byteArray.length - 1] = calculatedCheckSum >> 8 & 255;
  }
  getMessage() {
    return this.byteArrayExt;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Solexa2Message
});
//# sourceMappingURL=Solexa2Message.js.map
