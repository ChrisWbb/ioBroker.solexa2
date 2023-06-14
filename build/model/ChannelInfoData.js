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
var ChannelInfoData_exports = {};
__export(ChannelInfoData_exports, {
  ChannelInfoData: () => ChannelInfoData
});
module.exports = __toCommonJS(ChannelInfoData_exports);
class ChannelInfoData {
  constructor() {
    this.name = "";
    this.id = -1;
    this.functionId = -1;
  }
  setName(name) {
    this.name = name;
  }
  setId(id) {
    this.id = id;
  }
  setFunctionId(functionId) {
    this.functionId = functionId;
  }
  getName() {
    return this.name;
  }
  getId() {
    return this.id;
  }
  getFunctionId() {
    return this.functionId;
  }
  getFunctionName() {
    switch (this.functionId) {
      case 3:
        return "Markise";
      case 46:
        return "Markise";
      case 60:
        return "Licht";
      case 64:
        return "Innen Temperatur";
    }
    return "unkown";
  }
  hasTemperatureSensor() {
    return this.getFunctionId() === 64;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChannelInfoData
});
//# sourceMappingURL=ChannelInfoData.js.map
