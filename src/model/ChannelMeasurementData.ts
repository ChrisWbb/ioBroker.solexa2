class ChannelMeasurementData {

	private INVALID_NUMBER = -99;

	private id  = -1;
	private readStatus  = -1;
	private statusFlag = -1;
	private value1  = -1;
	private value2  = -1;
	private newParameter = -1;
	private temperature = this.INVALID_NUMBER;


	/* setter */

	public setId(id : number) : void {
		this.id = id;
	}

	public setReadStatus(readStatus : number) : void {
		this.readStatus = readStatus;
	}

	public setStatusFlag(statusFlag : number) : void {
		this.statusFlag = statusFlag;
	}

	public setValue1(value1 : number) : void {
		this.value1 = value1;
	}

	public setValue2(value2 : number) : void {
		this.value2 = value2;
	}

	public setNewParameter(newParameter : number) : void {
		this.newParameter = newParameter;
	}

	public setTemperature(temperature : number) : void {
		this.temperature = temperature;
	}

	/* getter */

	public getId() : number {
		return this.id;
	}

	public getReadStatus() : number {
		return this.readStatus;
	}

	public getStatusFlag() : number {
		return this.statusFlag;
	}

	public getValue1() : number {
		return this.value1;
	}

	public getValue2() : number {
		return this.value2;
	}

	public getNewParameter() : number {
		return this.newParameter;
	}

	public getTemperature() : number {
		return this.temperature;
	}

	public isTemperatureValid() : boolean {
		return this.temperature != this.INVALID_NUMBER
	}

}

export {ChannelMeasurementData}