class BasicInfoData {

	private errorMode  = false;
	private learnMode  = false;
	private weatherStation  = false;
	private statusBridge  = -1;
	private newParameter  = -1;
	private maxChannels  = -1;
	private protocolVersion  = "";


	/* setter */

	public setErrorMode(errorMode : boolean) : void {
		this.errorMode = errorMode;
	}

	public setLearnMode(learnMode : boolean) : void {
		this.learnMode = learnMode;
	}

	public setWeatherStation(weatherStation : boolean) : void {
		this.weatherStation = weatherStation;
	}

	public setStatusBridge(statusBridge : number) : void {
		this.statusBridge = statusBridge;
	}

	public setNewParameter(newParameter : number) : void {
		this.newParameter = newParameter;
	}

	public setMaxChannels(maxChannels : number) : void {
		this.maxChannels = maxChannels;
	}

	public setProtocolVersion(protocolVersion : string) : void {
		this.protocolVersion = protocolVersion;
	}

	/* getter */

	public getErrorMode() : boolean {
		return this.errorMode;
	}

	public getLearnMode() : boolean {
		return this.learnMode;
	}

	public getWeatherStation() : boolean {
		return this.weatherStation;
	}

	public getStatusBridge() : number {
		return this.statusBridge;
	}

	public getNewParameter() : number {
		return this.newParameter;
	}

	public getMaxChannels() : number {
		return this.maxChannels;
	}

	public getProtocolVersion() : string {
		return this.protocolVersion;
	}
}

export {BasicInfoData}