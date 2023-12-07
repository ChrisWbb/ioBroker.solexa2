import { AdapterInstance } from "@iobroker/adapter-core";
import { Socket, SocketConnectOpts } from "net";
import { TextDecoder } from "util";

import { BasicInfoData } from "./model/BasicInfoData";
import { ChannelInfoData } from "./model/ChannelInfoData";
import { ChannelMeasurementData } from "./model/ChannelMeasurementData";
import { WeatherStationMeasurementData } from "./model/WeatherStationMeasurementData";

//import { Queue } from "./util/Queue";
import { Solexa2Message } from "./Solexa2Message";

//let adapter: AdapterInstance;

class Solexa2Controller {

	private socket: Socket;
	private log: ioBroker.Logger;
	private basicInfoData: BasicInfoData | undefined;
	private channels: ChannelInfoData[];
	private openMeasurementIDs: number[];
	private reconnectCount: number;
	private lastChannelNum: number;

	//private messageQueue : Queue<Solexa2Message>;

	constructor(adapterInstance: AdapterInstance) {
		this.socket = new Socket();
		this.channels = [];
		this.openMeasurementIDs = [];
		this.log = adapterInstance.log;

		this.reconnectCount = 0;
		this.lastChannelNum = 0;
	}


	public async connect(ipAddress : string, port : number, callbackConnect: () => void, callbackData : (value : BasicInfoData | ChannelInfoData | ChannelMeasurementData | WeatherStationMeasurementData | undefined) => void) : Promise<void> {

		const options: SocketConnectOpts = {
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
			this.log.error("Error: "+ err);
		});

		this.socket.connect(options);
	}

	public async disconnect() : Promise<void> {
		this.socket.removeAllListeners();
		this.socket.destroy();
	}

	private async convertData(data : Uint8Array, callbackData: (value: BasicInfoData | ChannelInfoData | ChannelMeasurementData | WeatherStationMeasurementData | undefined) => void) : Promise<void> {

		const responseCode = data[2] & 255;
		this.log.info("responseCode: "+responseCode + " reconnect: " + this.reconnectCount);

		if (responseCode != 212 ) {
			if (this.isCheckSumOK(data)) {
				switch (responseCode) {
					case 4 : {
						this.readChannelValues(data, callbackData);
						break;
					}
					case 204 : {
						this.readBasicInfos(data, callbackData);
						break;
					}
					case 205 : {
						this.readChannelInfos(data, callbackData);
						break;
					}
					case 207 : {
						this.readChannelValues(data, callbackData);
						break;
					}
					default :{
						this.log.error("responseCode not supported: "+responseCode);
					}
				}
				//this.sendNextMessage();
			} else {
				this.log.error("Checksum is not ok");
				//this.resendMessage();
			}
		}
	}

	public async fetchAllMeasurementData() : Promise<void> {

		this.openMeasurementIDs = [];

		for(let i = 0; i < this.channels.length; i++) {
			this.openMeasurementIDs.push(this.channels[i].getId())
		}

		this.log.info("called fetchAllMeasurementData (#channel:"+this.openMeasurementIDs.length+")");

		this.fetchNextMeasurementData();
	}

	public async fetchNextMeasurementData() : Promise<void> {
		this.log.info("called fetchNextMeasurementData");
		const nextID = this.openMeasurementIDs.shift();
		if (nextID) {
			this.sendCommandGetChannelValues(nextID);
		}

		//this.sendCommandGetChannelValues(1);
	}

	public sendCommandGetBasicInfos() : void {
		this.log.info("called sendCommandGetBasicInfos");
		this.sendMessage(new Uint8Array([200]));
	}

	public sendCommandGetChannel(channelNum : number) : void {
		this.lastChannelNum = channelNum;
		this.log.info("called sendCommandGetChannel("+channelNum+")");
		this.sendMessage(new Uint8Array([201,channelNum]));
	}

	public sendCommandGetChannelValues(channelNum : number) : void {
		this.log.info("called sendCommandGetChannelValues("+channelNum+")");
		this.sendMessage(new Uint8Array([130,channelNum]));
	}

	public sendCommandUp(channelNum : number) : void {
		//todo nummer prüfen
		this.sendMessage(new Uint8Array([117,channelNum]));
	}

	public sendCommandDown(channelNum : number) : void {
		//todo nummer prüfen
		this.sendMessage(new Uint8Array([100,channelNum]));
	}

	private sendMessage(byteArray: Uint8Array): void {

		const message: Solexa2Message = new Solexa2Message(byteArray);
		//this.messageQueue.enqueue(message);

		//if (this.messageQueue.size() === 1) {
		//	this.sendFirstMessage();
		//}
		const buffer = Buffer.from(message.getMessage());
		this.socket.write(buffer);
		this.log.info("called sendMessage("+message.getMessage()+")");
	}
	/*
	private sendFirstMessage(): void {

		const message = this.messageQueue.first();
		if (message instanceof Solexa2Message) {
			this.logByteArray(message.getMessage(), "sendFirstMessage")
			//console.info("queue size: "+this.messageQueue.size());
			const buffer = Buffer.from(message.getMessage());
			this.socket.write(buffer);
		}
	}

	private resendMessage(): void {

		this.sendFirstMessage();
	}


	private sendNextMessage(): void {
		this.messageQueue.dequeue();
		if (!this.messageQueue.isEmpty()) {
			this.sendFirstMessage();
		}
	}
*/

	private isCheckSumOK(byteArray: Uint8Array) : boolean {
		let calculatedCheckSum  = 0;
		for (let pos = 0; pos < byteArray.length - 2; pos++) {
			calculatedCheckSum += byteArray[pos] & 255;
		}
		const receivedCheckSum: number =
          (byteArray[byteArray.length - 2] & 255) +
          ((byteArray[byteArray.length - 1] & 255) << 8);
		if (receivedCheckSum !== calculatedCheckSum) {
			this.log.error(
				`Error wrong checksum: ${receivedCheckSum} != ${calculatedCheckSum}`
			);
			return false;
		}
		return true;
	}

	private logByteArray(byteArray: Uint8Array, message: string): void {
		let str: string = message + ": ";
		for (let pos = 0; pos < byteArray.length; pos++) {
			str += byteArray[pos] + " ";
		}
		console.info(str);
	}

	private readBasicInfos(uint8: Uint8Array, callbackData: (arg0: BasicInfoData) => void) : void {

		const data : BasicInfoData = new BasicInfoData();

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

	private readChannelInfos(uint8: Uint8Array, callbackData: (arg0: ChannelInfoData) => void) : void {

		const data : ChannelInfoData = new ChannelInfoData();

		const byteArrayName: Uint8Array = new Uint8Array(16);
		byteArrayName.set(uint8.subarray(7, 23), 0);
		data.setName(new TextDecoder("utf-8").decode(byteArrayName).trim());
		data.setId(uint8[3] & 255);
		data.setFunctionId(uint8[4] & 255);

		this.log.debug("readChannelInfos for channel: "+data.getId());

		if (data.getFunctionId() ===  3 || data.getFunctionId() ==  46 || data.getFunctionId() ==  60) {
			this.channels.push(data);
			callbackData(data);
		}

		if (this.basicInfoData && (this.lastChannelNum + 1) < this.basicInfoData.getMaxChannels()) {
			this.sendCommandGetChannel(this.lastChannelNum+1);
		}
	}

	private readChannelValues(uint8: Uint8Array, callbackData: (arg0: ChannelMeasurementData | WeatherStationMeasurementData) => void) : void {

		const data : ChannelMeasurementData = new ChannelMeasurementData();

		data.setId(uint8[3] & 255);
		data.setReadStatus(uint8[4] & 255);
		data.setStatusFlag((uint8[5] & 255) + ((uint8[6] & 255) << 8) + ((uint8[7] & 255) << 16) + ((uint8[8] & 255) << 24));
		data.setValue1(uint8[9] & 255);
		data.setValue2(uint8[10] & 255);
		data.setNewParameter(uint8[11] & 255);

		// if (uint8[21] == 66 && uint8.length > 27) {
		// 	data.setTemperature(Buffer.from([uint8[22], uint8[23]]).readIntLE(0, 2)/10.0);
		// }

		callbackData(data);

		if (uint8[12] == 87) { // uint8[12] == 119 || uint8[12] == 115)  ???

			const weatherData : WeatherStationMeasurementData = new WeatherStationMeasurementData();

			weatherData.setTemperature(Buffer.from([uint8[13], uint8[14]]).readIntLE(0, 2)/10.0);
			weatherData.setWindSpeed(Buffer.from([uint8[15], uint8[16]]).readUIntLE(0, 2)/10.0);
			weatherData.setIsRaining(uint8[17] != 78);
			weatherData.setBrightness(Buffer.from([uint8[18], uint8[19], uint8[20],0]).readUIntLE(0, 4));

			callbackData(weatherData);
		}

		this.fetchNextMeasurementData();
	}

}

export { Solexa2Controller };