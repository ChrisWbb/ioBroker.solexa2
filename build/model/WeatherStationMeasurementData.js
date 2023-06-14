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
var WeatherStationMeasurementData_exports = {};
__export(WeatherStationMeasurementData_exports, {
  WeatherStationMeasurementData: () => WeatherStationMeasurementData
});
module.exports = __toCommonJS(WeatherStationMeasurementData_exports);
class WeatherStationMeasurementData {
  constructor() {
    this.temperature = -1;
    this.windSpeed = -1;
    this.isRaining = false;
    this.brightness = -1;
  }
  setTemperature(temperature) {
    this.temperature = temperature;
  }
  setWindSpeed(windSpeed) {
    this.windSpeed = windSpeed;
  }
  setIsRaining(isRaining) {
    this.isRaining = isRaining;
  }
  setBrightness(brightness) {
    this.brightness = brightness;
  }
  getTemperature() {
    return this.temperature;
  }
  getWindSpeed() {
    return this.windSpeed;
  }
  getIsRaining() {
    return this.isRaining;
  }
  getBrightness() {
    return this.brightness;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WeatherStationMeasurementData
});
//# sourceMappingURL=WeatherStationMeasurementData.js.map
