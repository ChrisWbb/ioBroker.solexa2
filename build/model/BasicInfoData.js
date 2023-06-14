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
var BasicInfoData_exports = {};
__export(BasicInfoData_exports, {
  BasicInfoData: () => BasicInfoData
});
module.exports = __toCommonJS(BasicInfoData_exports);
class BasicInfoData {
  constructor() {
    this.errorMode = false;
    this.learnMode = false;
    this.weatherStation = false;
    this.statusBridge = -1;
    this.newParameter = -1;
    this.maxChannels = -1;
    this.protocolVersion = "";
  }
  setErrorMode(errorMode) {
    this.errorMode = errorMode;
  }
  setLearnMode(learnMode) {
    this.learnMode = learnMode;
  }
  setWeatherStation(weatherStation) {
    this.weatherStation = weatherStation;
  }
  setStatusBridge(statusBridge) {
    this.statusBridge = statusBridge;
  }
  setNewParameter(newParameter) {
    this.newParameter = newParameter;
  }
  setMaxChannels(maxChannels) {
    this.maxChannels = maxChannels;
  }
  setProtocolVersion(protocolVersion) {
    this.protocolVersion = protocolVersion;
  }
  getErrorMode() {
    return this.errorMode;
  }
  getLearnMode() {
    return this.learnMode;
  }
  getWeatherStation() {
    return this.weatherStation;
  }
  getStatusBridge() {
    return this.statusBridge;
  }
  getNewParameter() {
    return this.newParameter;
  }
  getMaxChannels() {
    return this.maxChannels;
  }
  getProtocolVersion() {
    return this.protocolVersion;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BasicInfoData
});
//# sourceMappingURL=BasicInfoData.js.map
