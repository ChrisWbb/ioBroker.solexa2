"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var utils = __toESM(require("@iobroker/adapter-core"));
var import_Solexa2Controller = require("./Solexa2Controller");
var import_BasicInfoData = require("./model/BasicInfoData");
var import_ChannelInfoData = require("./model/ChannelInfoData");
var import_ChannelMeasurementData = require("./model/ChannelMeasurementData");
var import_WeatherStationMeasurementData = require("./model/WeatherStationMeasurementData");
const INFO = "info";
const INFO_ERROR_MODE = "errorMode";
const INFO_LEARN_MODE = "learnMode";
const INFO_WEATHER_STATION = "weatherStation";
const INFO_STATUS_BRIDGE = "statusBridge";
const INFO_NEW_PARAMETER = "newParameter";
const INFO_MAX_CHANNELS = "maxChannels";
const INFO_PROTOCOL_VERSION = "protocolVersion";
const WEATHER_STATION = "weatherStation";
const WEATHER_STATION_TEMPERATURE = "temperature";
const WEATHER_STATION_WIND_SPEED = "windSpeed";
const WEATHER_STATION_BRIGHTNESS = "brightness";
const WEATHER_STATION_RAIN = "isRaining";
const CHANNELS = "channels";
const CHANNEL_ID = "id";
const CHANNEL_FUNCTIONID = "functionId";
const CHANNEL_FUNCTIONNAME = "functionName";
const CHANNEL_NAME = "name";
const CHANNEL_READ_STATUS = "readStatus";
const CHANNEL_STATUS_FLAG = "statusFlag";
const CHANNEL_VALUE_1 = "value1";
const CHANNEL_VALUE_2 = "value2";
const CHANNEL_NEW_PARAMETER = "newParameter";
const CHANNEL_TEMPERATURE = "temperature";
class Solexa2 extends utils.Adapter {
  constructor(options = {}) {
    super({
      ...options,
      name: "solexa2"
    });
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  async onReady() {
    this.setState("info.connection", true, true);
    if (!this.config.serverIp) {
      this.log.error("Server IP is empty - please check instance configuration");
      return;
    }
    if (!this.config.serverPort) {
      this.log.error("Server port is empty - please check instance configuration");
      return;
    }
    if (!this.config.interval) {
      this.log.error("Interval is empty - please check instance configuration");
      return;
    }
    this.solexa2Controller = new import_Solexa2Controller.Solexa2Controller(this);
    this.solexa2Controller.connect(this.config.serverIp, this.config.serverPort, this.actionsAfterConnect.bind(this), this.actionsAfterReceivingData.bind(this));
  }
  onUnload(callback) {
    try {
      this.setState("info.connection", false, true);
      if (this.updateInterval) {
        this.clearInterval(this.updateInterval);
      }
      this.solexa2Controller.disconnect();
      callback();
    } catch (e) {
      callback();
    }
  }
  onStateChange(id, state) {
    if (state) {
      this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
    } else {
      this.log.info(`state ${id} deleted`);
    }
  }
  actionsAfterConnect() {
    this.createSolexaInfoObjects();
    this.solexa2Controller.sendCommandGetBasicInfos();
    this.updateInterval = this.setInterval(async () => {
      this.log.info("fetchAllMeasurementData");
      this.solexa2Controller.fetchAllMeasurementData();
    }, this.config.interval * 1e3);
  }
  actionsAfterReceivingData(data) {
    if (data instanceof import_BasicInfoData.BasicInfoData) {
      this.saveBasicInfos(data);
      if (data.getWeatherStation()) {
        this.createSolexaWeaterStationInfoObjects();
      }
    }
    if (data instanceof import_ChannelInfoData.ChannelInfoData) {
      this.saveChannelInfos(data);
    }
    if (data instanceof import_ChannelMeasurementData.ChannelMeasurementData) {
      this.saveChannelMeasurementData(data);
    }
    if (data instanceof import_WeatherStationMeasurementData.WeatherStationMeasurementData) {
      this.saveWeatherStationMeasurementData(data);
    }
  }
  async createSolexaInfoObjects() {
    this.setObjectNotExistsAsync(INFO + "." + INFO_ERROR_MODE, {
      type: "state",
      common: {
        name: INFO_ERROR_MODE,
        type: "boolean",
        role: "indicator",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExistsAsync(INFO + "." + INFO_LEARN_MODE, {
      type: "state",
      common: {
        name: INFO_LEARN_MODE,
        type: "boolean",
        role: "indicator",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExistsAsync(INFO + "." + INFO_WEATHER_STATION, {
      type: "state",
      common: {
        name: INFO_WEATHER_STATION,
        type: "boolean",
        role: "indicator",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExistsAsync(INFO + "." + INFO_STATUS_BRIDGE, {
      type: "state",
      common: {
        name: INFO_STATUS_BRIDGE,
        type: "number",
        role: "indicator",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExistsAsync(INFO + "." + INFO_NEW_PARAMETER, {
      type: "state",
      common: {
        name: INFO_NEW_PARAMETER,
        type: "number",
        role: "indicator",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExistsAsync(INFO + "." + INFO_MAX_CHANNELS, {
      type: "state",
      common: {
        name: INFO_MAX_CHANNELS,
        type: "number",
        role: "indicator",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExistsAsync(INFO + "." + INFO_PROTOCOL_VERSION, {
      type: "state",
      common: {
        name: INFO_PROTOCOL_VERSION,
        type: "string",
        role: "indicator",
        read: true,
        write: false
      },
      native: {}
    });
  }
  async createSolexaWeaterStationInfoObjects() {
    this.setObjectNotExistsAsync(WEATHER_STATION, {
      type: "channel",
      common: {
        name: "Data of weather station"
      },
      native: {}
    });
    this.setObjectNotExistsAsync(WEATHER_STATION + "." + WEATHER_STATION_TEMPERATURE, {
      type: "state",
      common: {
        name: "Temparature",
        type: "number",
        role: "indicator",
        read: true,
        write: false,
        unit: "\xB0C"
      },
      native: {}
    });
    this.setObjectNotExistsAsync(WEATHER_STATION + "." + WEATHER_STATION_WIND_SPEED, {
      type: "state",
      common: {
        name: "Wind speed",
        type: "number",
        role: "indicator",
        read: true,
        write: false,
        unit: "km/h"
      },
      native: {}
    });
    this.setObjectNotExistsAsync(WEATHER_STATION + "." + WEATHER_STATION_BRIGHTNESS, {
      type: "state",
      common: {
        name: "Brightness",
        type: "number",
        role: "indicator",
        read: true,
        write: false,
        unit: "lux"
      },
      native: {}
    });
    this.setObjectNotExistsAsync(WEATHER_STATION + "." + WEATHER_STATION_RAIN, {
      type: "state",
      common: {
        name: "Raining",
        type: "boolean",
        role: "indicator",
        read: true,
        write: false
      },
      native: {}
    });
  }
  async saveBasicInfos(data) {
    const errorMode = data.getErrorMode();
    const learnMode = data.getLearnMode();
    const weatherStation = data.getWeatherStation();
    const statusBridge = data.getStatusBridge();
    const newParameter = data.getNewParameter();
    const maxChannels = data.getMaxChannels();
    const protocolVersion = data.getProtocolVersion();
    this.log.info("errorMode: " + errorMode);
    this.log.info("learnMode: " + learnMode);
    this.log.info("weatherStation: " + weatherStation);
    this.log.info("statusBridge: " + statusBridge);
    this.log.info("newParameter: " + newParameter);
    this.log.info("maxChannels: " + maxChannels);
    this.log.info("ProtocolVersion: " + protocolVersion);
    this.setState(INFO + "." + INFO_ERROR_MODE, errorMode, true);
    this.setState(INFO + "." + INFO_LEARN_MODE, learnMode, true);
    this.setState(INFO + "." + INFO_WEATHER_STATION, weatherStation, true);
    this.setState(INFO + "." + INFO_STATUS_BRIDGE, statusBridge, true);
    this.setState(INFO + "." + INFO_NEW_PARAMETER, newParameter, true);
    this.setState(INFO + "." + INFO_MAX_CHANNELS, maxChannels, true);
    this.setState(INFO + "." + INFO_PROTOCOL_VERSION, protocolVersion, true);
  }
  async saveChannelInfos(data) {
    this.log.info("Register Channel: " + data.getId() + " - " + data.getName() + " - " + data.getFunctionId() + " - " + data.getFunctionName());
    this.setObjectNotExistsAsync(CHANNELS, {
      type: "channel",
      common: {
        name: "Data of channels"
      },
      native: {}
    });
    this.setObjectNotExistsAsync(CHANNELS + "." + data.getId(), {
      type: "channel",
      common: {
        name: "Data of channel " + data.getId()
      },
      native: {}
    });
    this.setObjectNotExistsAsync(CHANNELS + "." + data.getId() + "." + CHANNEL_ID, {
      type: "state",
      common: {
        name: "id",
        type: "number",
        role: "indicator",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExistsAsync(CHANNELS + "." + data.getId() + "." + CHANNEL_FUNCTIONID, {
      type: "state",
      common: {
        name: "function id",
        type: "number",
        role: "indicator",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExistsAsync(CHANNELS + "." + data.getId() + "." + CHANNEL_FUNCTIONNAME, {
      type: "state",
      common: {
        name: "function name",
        type: "string",
        role: "indicator",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExistsAsync(CHANNELS + "." + data.getId() + "." + CHANNEL_NAME, {
      type: "state",
      common: {
        name: "name",
        type: "string",
        role: "indicator",
        read: true,
        write: false
      },
      native: {}
    });
    this.setState(CHANNELS + "." + data.getId() + "." + CHANNEL_ID, data.getId(), true);
    this.setState(CHANNELS + "." + data.getId() + "." + CHANNEL_FUNCTIONID, data.getFunctionId(), true);
    this.setState(CHANNELS + "." + data.getId() + "." + CHANNEL_FUNCTIONNAME, data.getFunctionName(), true);
    this.setState(CHANNELS + "." + data.getId() + "." + CHANNEL_NAME, data.getName(), true);
    this.setObjectNotExistsAsync(CHANNELS + "." + data.getId() + "." + CHANNEL_READ_STATUS, {
      type: "state",
      common: {
        name: "Read Status",
        type: "number",
        role: "indicator",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExistsAsync(CHANNELS + "." + data.getId() + "." + CHANNEL_STATUS_FLAG, {
      type: "state",
      common: {
        name: "Status Flag",
        type: "number",
        role: "indicator",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExistsAsync(CHANNELS + "." + data.getId() + "." + CHANNEL_VALUE_1, {
      type: "state",
      common: {
        name: "Value 2",
        type: "number",
        role: "indicator",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExistsAsync(CHANNELS + "." + data.getId() + "." + CHANNEL_VALUE_2, {
      type: "state",
      common: {
        name: "Value 2",
        type: "number",
        role: "indicator",
        read: true,
        write: false
      },
      native: {}
    });
    this.setObjectNotExistsAsync(CHANNELS + "." + data.getId() + "." + CHANNEL_NEW_PARAMETER, {
      type: "state",
      common: {
        name: "New Parameter",
        type: "number",
        role: "indicator",
        read: true,
        write: false
      },
      native: {}
    });
    if (data.hasTemperatureSensor()) {
      this.setObjectNotExistsAsync(CHANNELS + "." + data.getId() + "." + CHANNEL_TEMPERATURE, {
        type: "state",
        common: {
          name: "Temperature",
          type: "number",
          role: "indicator",
          read: true,
          write: false
        },
        native: {}
      });
    }
  }
  async saveChannelMeasurementData(data) {
    const id = data.getId();
    const readStatus = data.getReadStatus();
    const statusFlag = data.getStatusFlag();
    const value1 = data.getValue1();
    const value2 = data.getValue2();
    const newParameter = data.getNewParameter();
    const temperature = data.getTemperature();
    this.setState(CHANNELS + "." + data.getId() + "." + CHANNEL_READ_STATUS, readStatus, true);
    this.setState(CHANNELS + "." + data.getId() + "." + CHANNEL_STATUS_FLAG, statusFlag, true);
    this.setState(CHANNELS + "." + data.getId() + "." + CHANNEL_VALUE_1, value1, true);
    this.setState(CHANNELS + "." + data.getId() + "." + CHANNEL_VALUE_2, value2, true);
    this.setState(CHANNELS + "." + data.getId() + "." + CHANNEL_NEW_PARAMETER, newParameter, true);
    if (data.isTemperatureValid()) {
      this.setState(CHANNELS + "." + data.getId() + "." + CHANNEL_TEMPERATURE, temperature, true);
    }
  }
  async saveWeatherStationMeasurementData(data) {
    const outdoorTemperature = data.getTemperature();
    const windSpeed = data.getWindSpeed();
    const isRaining = data.getIsRaining();
    const brightness = data.getBrightness();
    this.log.info("New weather data: " + outdoorTemperature + " \xB0C - " + windSpeed + " km/h - isRaining " + isRaining + " - " + brightness + " lux");
    this.setState(WEATHER_STATION + "." + WEATHER_STATION_TEMPERATURE, outdoorTemperature, true);
    this.setState(WEATHER_STATION + "." + WEATHER_STATION_WIND_SPEED, windSpeed, true);
    this.setState(WEATHER_STATION + "." + WEATHER_STATION_BRIGHTNESS, brightness, true);
    this.setState(WEATHER_STATION + "." + WEATHER_STATION_RAIN, isRaining, true);
  }
}
if (require.main !== module) {
  module.exports = (options) => new Solexa2(options);
} else {
  (() => new Solexa2())();
}
//# sourceMappingURL=main.js.map
