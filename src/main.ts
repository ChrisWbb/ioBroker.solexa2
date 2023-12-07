/*
 * Created with @iobroker/create-adapter v2.3.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from "@iobroker/adapter-core";
import { Solexa2Controller } from "./Solexa2Controller";

import { BasicInfoData } from "./model/BasicInfoData";
import { ChannelInfoData } from "./model/ChannelInfoData";
import { ChannelMeasurementData } from "./model/ChannelMeasurementData";
import { WeatherStationMeasurementData } from "./model/WeatherStationMeasurementData";


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

	private solexa2Controller!: Solexa2Controller;
	private updateInterval: ioBroker.Interval | undefined;

	public constructor(options: Partial<utils.AdapterOptions> = {}) {
		super({
			...options,
			name: "solexa2",
		});

		this.on("ready", this.onReady.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		// this.on("objectChange", this.onObjectChange.bind(this));
		// this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	private async onReady(): Promise<void> {

		// Reset the connection indicator during startup
		this.setState("info.connection", true, true);

		// check configuration
		if (!this.config.serverIp) {
			this.log.error("Server IP is empty - please check instance configuration")
			return;
		}
		if (!this.config.serverPort) {
			this.log.error("Server port is empty - please check instance configuration")
			return;
		}
		if (!this.config.interval) {
			this.log.error("Interval is empty - please check instance configuration")
			return;
		}

		this.solexa2Controller = new Solexa2Controller(this);
		this.solexa2Controller.connect(this.config.serverIp, this.config.serverPort, this.actionsAfterConnect.bind(this), this.actionsAfterReceivingData.bind(this));
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 */
	private onUnload(callback: () => void): void {
		try {
			// Reset the connection indicator during shutdown
			this.setState("info.connection", false, true);

			if (this.updateInterval){
				this.clearInterval(this.updateInterval);
			}

			this.solexa2Controller.disconnect();

			callback();
		} catch (e) {
			callback();
		}
	}

	// If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
	// You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
	// /**
	//  * Is called if a subscribed object changes
	//  */
	// private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
	// 	if (obj) {
	// 		// The object was changed
	// 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
	// 	} else {
	// 		// The object was deleted
	// 		this.log.info(`object ${id} deleted`);
	// 	}
	// }

	/**
	 * Is called if a subscribed state changes
	 */
	private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
		if (state) {
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	}

	// If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.messagebox" property to be set to true in io-package.json
	//  */
	// private onMessage(obj: ioBroker.Message): void {
	// 	if (typeof obj === "object" && obj.message) {
	// 		if (obj.command === "send") {
	// 			// e.g. send email or pushover or whatever
	// 			this.log.info("send command");

	// 			// Send response in callback if required
	// 			if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
	// 		}
	// 	}
	// }

	private actionsAfterConnect() : void {

		this.createSolexaInfoObjects();
		this.solexa2Controller.sendCommandGetBasicInfos();

		this.updateInterval = this.setInterval(async () => {
			this.log.info("fetchAllMeasurementData v1");
			this.solexa2Controller.fetchAllMeasurementData();
		}, this.config.interval * 1000);
	}

	private actionsAfterReceivingData(data: BasicInfoData | ChannelInfoData | ChannelMeasurementData | WeatherStationMeasurementData | undefined) : void {

		if (data instanceof BasicInfoData) {

			this.saveBasicInfos(data);

			if (data.getWeatherStation()) {
				this.createSolexaWeaterStationInfoObjects();
			}

			//for (let i = 0; i < data.getMaxChannels(); i++) {
			// 	this.solexa2Controller.sendCommandGetChannel(i);
			//}

			// for (let i = 1; i < 10; i++) {
			// 	this.solexa2Controller.sendCommandGetChannel(i);
			// }

			// for (let i = data.getMaxChannels(); i >= 0; i--) {
			// 	this.solexa2Controller.sendCommandGetChannel(i);
			// }

		}

		if (data instanceof ChannelInfoData) {

			this.saveChannelInfos(data);
		}

		if (data instanceof ChannelMeasurementData) {

			this.saveChannelMeasurementData(data);
		}

		if (data instanceof WeatherStationMeasurementData) {

			this.saveWeatherStationMeasurementData(data);
		}
	}

	private async createSolexaInfoObjects() : Promise<void> {

		this.setObjectNotExistsAsync(INFO+"."+INFO_ERROR_MODE, {
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

		this.setObjectNotExistsAsync(INFO+"."+INFO_LEARN_MODE, {
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

		this.setObjectNotExistsAsync(INFO+"."+INFO_WEATHER_STATION, {
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

		this.setObjectNotExistsAsync(INFO+"."+INFO_STATUS_BRIDGE, {
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

		this.setObjectNotExistsAsync(INFO+"."+INFO_NEW_PARAMETER, {
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

		this.setObjectNotExistsAsync(INFO+"."+INFO_MAX_CHANNELS, {
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

		this.setObjectNotExistsAsync(INFO+"."+INFO_PROTOCOL_VERSION, {
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

	private async createSolexaWeaterStationInfoObjects() : Promise<void> {

		this.setObjectNotExistsAsync(WEATHER_STATION, {
			type: "channel",
			common: {
				name: "Data of weather station"
			},
			native: {}
		});

		this.setObjectNotExistsAsync(WEATHER_STATION +"."+WEATHER_STATION_TEMPERATURE, {
			type: "state",
			common: {
				name: "Temparature",
				type: "number",
				role: "indicator",
				read: true,
				write: false,
				unit: "°C"
			},
			native: {}
		});

		this.setObjectNotExistsAsync(WEATHER_STATION +"."+WEATHER_STATION_WIND_SPEED, {
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

		this.setObjectNotExistsAsync(WEATHER_STATION +"."+WEATHER_STATION_BRIGHTNESS, {
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

		this.setObjectNotExistsAsync(WEATHER_STATION +"."+WEATHER_STATION_RAIN, {
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

	private async saveBasicInfos(data: BasicInfoData) : Promise<void> {

		const errorMode : boolean = data.getErrorMode();
		const learnMode : boolean = data.getLearnMode();
		const weatherStation : boolean = data.getWeatherStation();
		const statusBridge : number = data.getStatusBridge();
		const newParameter : number = data.getNewParameter();
		const maxChannels : number = data.getMaxChannels();
		const protocolVersion : string = data.getProtocolVersion();

		this.log.info("errorMode: " + errorMode);
		this.log.info("learnMode: " + learnMode);
		this.log.info("weatherStation: " + weatherStation);
		this.log.info("statusBridge: " + statusBridge);
		this.log.info("newParameter: " + newParameter);
		this.log.info("maxChannels: " + maxChannels);
		this.log.info("ProtocolVersion: " + protocolVersion);

		this.setState(INFO+"."+INFO_ERROR_MODE, errorMode, true);
		this.setState(INFO+"."+INFO_LEARN_MODE, learnMode, true);
		this.setState(INFO+"."+INFO_WEATHER_STATION, weatherStation, true);
		this.setState(INFO+"."+INFO_STATUS_BRIDGE, statusBridge, true);
		this.setState(INFO+"."+INFO_NEW_PARAMETER, newParameter, true);
		this.setState(INFO+"."+INFO_MAX_CHANNELS, maxChannels, true);
		this.setState(INFO+"."+INFO_PROTOCOL_VERSION, protocolVersion, true);
	}

	private async saveChannelInfos(data: ChannelInfoData) : Promise<void> {

		this.log.info("Register Channel: " + data.getId() + " - " + data.getName() + " - " + data.getFunctionId() + " - " + data.getFunctionName());

		this.setObjectNotExistsAsync(CHANNELS, {
			type: "channel",
			common: {
				name: "Data of channels"
			},
			native: {}
		});

		this.setObjectNotExistsAsync(CHANNELS+"."+data.getId(), {
			type: "channel",
			common: {
				name: "Data of channel " + data.getId()
			},
			native: {}
		});

		this.setObjectNotExistsAsync(CHANNELS+"."+data.getId()+"."+CHANNEL_ID, {
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
		this.setObjectNotExistsAsync(CHANNELS+"."+data.getId()+"."+CHANNEL_FUNCTIONID, {
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
		this.setObjectNotExistsAsync(CHANNELS+"."+data.getId()+"."+CHANNEL_FUNCTIONNAME, {
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
		this.setObjectNotExistsAsync(CHANNELS+"."+data.getId()+"."+CHANNEL_NAME, {
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

		this.setState(CHANNELS+"."+data.getId()+"."+CHANNEL_ID, data.getId(), true);
		this.setState(CHANNELS+"."+data.getId()+"."+CHANNEL_FUNCTIONID, data.getFunctionId(), true);
		this.setState(CHANNELS+"."+data.getId()+"."+CHANNEL_FUNCTIONNAME, data.getFunctionName(), true);
		this.setState(CHANNELS+"."+data.getId()+"."+CHANNEL_NAME, data.getName(), true);

		this.setObjectNotExistsAsync(CHANNELS+"."+data.getId()+"."+CHANNEL_READ_STATUS, {
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

		this.setObjectNotExistsAsync(CHANNELS+"."+data.getId()+"."+CHANNEL_STATUS_FLAG, {
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

		this.setObjectNotExistsAsync(CHANNELS+"."+data.getId()+"."+CHANNEL_VALUE_1, {
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

		this.setObjectNotExistsAsync(CHANNELS+"."+data.getId()+"."+CHANNEL_VALUE_2, {
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

		this.setObjectNotExistsAsync(CHANNELS+"."+data.getId()+"."+CHANNEL_NEW_PARAMETER, {
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

			this.setObjectNotExistsAsync(CHANNELS+"."+data.getId()+"."+CHANNEL_TEMPERATURE, {
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

	private async saveChannelMeasurementData(data: ChannelMeasurementData) : Promise<void> {

		//const id  = data.getId();
		const readStatus  = data.getReadStatus();
		const statusFlag = data.getStatusFlag();
		const value1  = data.getValue1();
		const value2  = data.getValue2();
		const newParameter = data.getNewParameter();
		const temperature = data.getTemperature();

		// this.log.debug("channel number: " + id);
		// this.log.debug("read status: " + readStatus);
		// this.log.debug("status flag: " + statusFlag);
		// this.log.debug("value 1: " + value1);
		// this.log.debug("value 2: " + value2);
		// this.log.debug("new parameter: " + newParameter);

		this.setState(CHANNELS+"."+data.getId()+"."+CHANNEL_READ_STATUS, readStatus, true);
		this.setState(CHANNELS+"."+data.getId()+"."+CHANNEL_STATUS_FLAG, statusFlag, true);
		this.setState(CHANNELS+"."+data.getId()+"."+CHANNEL_VALUE_1, value1, true);
		this.setState(CHANNELS+"."+data.getId()+"."+CHANNEL_VALUE_2, value2, true);
		this.setState(CHANNELS+"."+data.getId()+"."+CHANNEL_NEW_PARAMETER, newParameter, true);

		if (data.isTemperatureValid()) {
			// this.log.debug("temperature: " + temperature);
			this.setState(CHANNELS+"."+data.getId()+"."+CHANNEL_TEMPERATURE, temperature, true);
		}
	}

	private async saveWeatherStationMeasurementData(data: WeatherStationMeasurementData) : Promise<void> {

		const outdoorTemperature : number = data.getTemperature();
		const windSpeed : number = data.getWindSpeed();
		const isRaining : boolean =  data.getIsRaining();
		const brightness : number = data.getBrightness();

		this.log.info("New weather data: "+ outdoorTemperature +" °C - "+windSpeed+" km/h - isRaining "+isRaining + " - "+brightness + " lux");

		this.setState(WEATHER_STATION +"."+WEATHER_STATION_TEMPERATURE, outdoorTemperature, true);
		this.setState(WEATHER_STATION +"."+WEATHER_STATION_WIND_SPEED, windSpeed, true);
		this.setState(WEATHER_STATION +"."+WEATHER_STATION_BRIGHTNESS, brightness, true);
		this.setState(WEATHER_STATION +"."+WEATHER_STATION_RAIN, isRaining, true);
	}

}

if (require.main !== module) {
	// Export the constructor in compact mode
	module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new Solexa2(options);
} else {
	// otherwise start the instance directly
	(() => new Solexa2())();
}