class ChannelInfoData {

	private name  = "";
	private id  = -1;
	private functionId  = -1;

	/* setter */

	public setName(name : string) : void {
		this.name = name;
	}

	public setId(id : number) : void {
		this.id = id;
	}

	public setFunctionId(functionId : number) : void {
		this.functionId = functionId;
	}


	/* getter */

	public getName() : string {
		return this.name;
	}

	public getId() : number {
		return this.id;
	}

	public getFunctionId() : number {
		return this.functionId;
	}

	public getFunctionName() : string {
		switch (this.functionId) {
			case 3:
				return "Markise";
			case 46:
				return "Markise";
			case 60:
				return "Licht";
			case 64:
				return "Innen Temperatur";
		}
		return "unkown";
	}

	public hasTemperatureSensor() : boolean {
		return this.getFunctionId() === 64;
	}
}

export {ChannelInfoData}