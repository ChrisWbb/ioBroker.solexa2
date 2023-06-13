class WeatherStationMeasurementData {

	private temperature = -1.0;
	private windSpeed  = -1.0;
	private isRaining  = false;
	private brightness = -1;


	/* setter */

	public setTemperature(temperature : number) : void {
		this.temperature = temperature;
	}

	public setWindSpeed(windSpeed : number) : void {
		this.windSpeed = windSpeed;
	}

	public setIsRaining(isRaining : boolean) : void {
		this.isRaining = isRaining;
	}

	public setBrightness(brightness : number) : void {
		this.brightness = brightness;
	}


	/* getter */

	public getTemperature() : number {
		return this.temperature;
	}

	public getWindSpeed() : number {
		return this.windSpeed;
	}

	public getIsRaining() : boolean {
		return this.isRaining;
	}

	public getBrightness() : number {
		return this.brightness;
	}

}

export {WeatherStationMeasurementData}