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
var Solexa2Controller_exports = {};
__export(Solexa2Controller_exports, {
  Solexa2Controller: () => Solexa2Controller
});
module.exports = __toCommonJS(Solexa2Controller_exports);
var import_net = require("net");
var import_util = require("util");
var import_BasicInfoData = require("./model/BasicInfoData");
var import_ChannelInfoData = require("./model/ChannelInfoData");
var import_ChannelMeasurementData = require("./model/ChannelMeasurementData");
var import_WeatherStationMeasurementData = require("./model/WeatherStationMeasurementData");
var import_Solexa2Message = require("./Solexa2Message");
class Solexa2Controller {
  constructor(adapterInstance) {
    this.socket = new import_net.Socket();
    this.channels = [];
    this.openMeasurementIDs = [];
    this.log = adapterInstance.log;
    this.reconnectCount = 0;
  }
  async connect(ipAddress, port, callbackConnect, callbackData) {
    const options = {
      "host": ipAddress,
      "port": port
    };
    this.socket.on("connect", () => {
      this.log.info("Connected");
      if (this.channels.length == 0) {
        callbackConnect();
      } else {
        this.reconnectCount++;
      }
    });
    this.socket.on("data", (data) => {
      this.convertData(data, callbackData);
    });
    this.socket.on("close", () => {
      this.log.info("Connection closed");
      this.socket.connect(options);
    });
    this.socket.on("error", (err) => {
      this.log.error("Error: " + err);
    });
    this.socket.connect(options);
  }
  async disconnect() {
    this.socket.removeAllListeners();
    this.socket.destroy();
  }
  async convertData(data, callbackData) {
    const responseCode = data[2] & 255;
    this.log.debug("responseCode: " + responseCode + " reconnect: " + this.reconnectCount);
    if (responseCode != 212) {
      if (this.isCheckSumOK(data)) {
        switch (responseCode) {
          case 4: {
            this.readChannelValues(data, callbackData);
            break;
          }
          case 204: {
            this.readBasicInfos(data, callbackData);
            break;
          }
          case 205: {
            this.readChannelInfos(data, callbackData);
            break;
          }
          case 207: {
            this.readChannelValues(data, callbackData);
            break;
          }
        }
      } else {
        this.log.error("Checksum is not ok");
      }
    }
  }
  async fetchAllMeasurementData() {
    this.openMeasurementIDs = [];
    for (let i = 0; i < this.channels.length; i++) {
      this.openMeasurementIDs.push(this.channels[i].getId());
    }
    this.fetchNextMeasurementData();
  }
  async fetchNextMeasurementData() {
    const nextID = this.openMeasurementIDs.shift();
    if (nextID) {
      this.sendCommandGetChannelValues(nextID);
    }
  }
  sendCommandGetBasicInfos() {
    this.log.info("called sendCommandGetBasicInfos");
    this.sendMessage(new Uint8Array([200]));
  }
  sendCommandGetChannel(channelNum) {
    this.log.info("called sendCommandGetChannel(" + channelNum + ")");
    this.sendMessage(new Uint8Array([201, channelNum]));
  }
  sendCommandGetChannelValues(channelNum) {
    this.log.info("called sendCommandGetChannelValues(" + channelNum + ")");
    this.sendMessage(new Uint8Array([130, channelNum]));
  }
  sendCommandUp(channelNum) {
    this.sendMessage(new Uint8Array([117, channelNum]));
  }
  sendCommandDown(channelNum) {
    this.sendMessage(new Uint8Array([100, channelNum]));
  }
  sendMessage(byteArray) {
    const message = new import_Solexa2Message.Solexa2Message(byteArray);
    const buffer = Buffer.from(message.getMessage());
    this.socket.write(buffer);
  }
  isCheckSumOK(byteArray) {
    let calculatedCheckSum = 0;
    for (let pos = 0; pos < byteArray.length - 2; pos++) {
      calculatedCheckSum += byteArray[pos] & 255;
    }
    const receivedCheckSum = (byteArray[byteArray.length - 2] & 255) + ((byteArray[byteArray.length - 1] & 255) << 8);
    if (receivedCheckSum !== calculatedCheckSum) {
      this.log.error(
        `Error wrong checksum: ${receivedCheckSum} != ${calculatedCheckSum}`
      );
      return false;
    }
    return true;
  }
  logByteArray(byteArray, message) {
    let str = message + ": ";
    for (let pos = 0; pos < byteArray.length; pos++) {
      str += byteArray[pos] + " ";
    }
    console.info(str);
  }
  readBasicInfos(uint8, callbackData) {
    const data = new import_BasicInfoData.BasicInfoData();
    data.setErrorMode((uint8[3] & 255) == 1);
    data.setLearnMode((uint8[4] & 255) == 1);
    data.setWeatherStation((uint8[5] & 255) == 1);
    data.setStatusBridge(uint8[6] & 255);
    data.setNewParameter(uint8[7] & 255);
    data.setMaxChannels(uint8[8] & 255);
    data.setProtocolVersion((uint8[12] & 255) + "." + (uint8[11] & 255) + "." + (uint8[10] & 255) + "." + (uint8[9] & 255));
    callbackData(data);
    this.basicInfoData = data;
    this.sendCommandGetChannel(1);
  }
  readChannelInfos(uint8, callbackData) {
    const data = new import_ChannelInfoData.ChannelInfoData();
    const byteArrayName = new Uint8Array(16);
    byteArrayName.set(uint8.subarray(7, 23), 0);
    data.setName(new import_util.TextDecoder("utf-8").decode(byteArrayName).trim());
    data.setId(uint8[3] & 255);
    data.setFunctionId(uint8[4] & 255);
    this.log.debug("readChannelInfos for channel: " + data.getId());
    if (data.getFunctionId() === 3 || data.getFunctionId() == 46 || data.getFunctionId() == 60) {
      this.channels.push(data);
      callbackData(data);
    }
    if (this.basicInfoData && data.getId() < this.basicInfoData.getMaxChannels()) {
      this.sendCommandGetChannel(data.getId() + 1);
    }
  }
  readChannelValues(uint8, callbackData) {
    const data = new import_ChannelMeasurementData.ChannelMeasurementData();
    data.setId(uint8[3] & 255);
    data.setReadStatus(uint8[4] & 255);
    data.setStatusFlag((uint8[5] & 255) + ((uint8[6] & 255) << 8) + ((uint8[7] & 255) << 16) + ((uint8[8] & 255) << 24));
    data.setValue1(uint8[9] & 255);
    data.setValue2(uint8[10] & 255);
    data.setNewParameter(uint8[11] & 255);
    callbackData(data);
    if (uint8[12] == 87) {
      const weatherData = new import_WeatherStationMeasurementData.WeatherStationMeasurementData();
      weatherData.setTemperature(Buffer.from([uint8[13], uint8[14]]).readUIntLE(0, 2) / 10);
      weatherData.setWindSpeed(Buffer.from([uint8[15], uint8[16]]).readUIntLE(0, 2) / 10);
      weatherData.setIsRaining(uint8[17] != 78);
      weatherData.setBrightness(Buffer.from([uint8[18], uint8[19], uint8[20], 0]).readUIntLE(0, 4));
      callbackData(weatherData);
    }
    this.fetchNextMeasurementData();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Solexa2Controller
});
//# sourceMappingURL=Solexa2Controller.js.map
