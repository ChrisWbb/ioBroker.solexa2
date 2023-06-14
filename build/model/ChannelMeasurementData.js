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
var ChannelMeasurementData_exports = {};
__export(ChannelMeasurementData_exports, {
  ChannelMeasurementData: () => ChannelMeasurementData
});
module.exports = __toCommonJS(ChannelMeasurementData_exports);
class ChannelMeasurementData {
  constructor() {
    this.INVALID_NUMBER = -99;
    this.id = -1;
    this.readStatus = -1;
    this.statusFlag = -1;
    this.value1 = -1;
    this.value2 = -1;
    this.newParameter = -1;
    this.temperature = this.INVALID_NUMBER;
  }
  setId(id) {
    this.id = id;
  }
  setReadStatus(readStatus) {
    this.readStatus = readStatus;
  }
  setStatusFlag(statusFlag) {
    this.statusFlag = statusFlag;
  }
  setValue1(value1) {
    this.value1 = value1;
  }
  setValue2(value2) {
    this.value2 = value2;
  }
  setNewParameter(newParameter) {
    this.newParameter = newParameter;
  }
  setTemperature(temperature) {
    this.temperature = temperature;
  }
  getId() {
    return this.id;
  }
  getReadStatus() {
    return this.readStatus;
  }
  getStatusFlag() {
    return this.statusFlag;
  }
  getValue1() {
    return this.value1;
  }
  getValue2() {
    return this.value2;
  }
  getNewParameter() {
    return this.newParameter;
  }
  getTemperature() {
    return this.temperature;
  }
  isTemperatureValid() {
    return this.temperature != this.INVALID_NUMBER;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChannelMeasurementData
});
//# sourceMappingURL=ChannelMeasurementData.js.map
