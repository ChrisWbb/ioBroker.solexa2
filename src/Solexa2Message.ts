class Solexa2Message {

	private byteArrayExt: Uint8Array;

	constructor(byteArray: Uint8Array) {
		this.byteArrayExt = new Uint8Array(byteArray.length + 4);
		this.byteArrayExt.set(byteArray, 2);
		this.messageAddLength(this.byteArrayExt);
		this.messageAddCheckSum(this.byteArrayExt);
	}

	private messageAddLength(byteArray: Uint8Array): void {
		const length: number = byteArray.length - 4;
		byteArray[0] = length & 255;
		byteArray[1] = (length >> 8) & 255;
	}

	private messageAddCheckSum(byteArray: Uint8Array): void {
		let calculatedCheckSum = 0;
		for (let pos = 0; pos < byteArray.length - 2; pos++) {
			calculatedCheckSum += byteArray[pos] & 255;
		}
		byteArray[byteArray.length - 2] = calculatedCheckSum & 255;
		byteArray[byteArray.length - 1] = (calculatedCheckSum >> 8) & 255;
	}

	public getMessage() : Uint8Array {
		return this.byteArrayExt;
	}
}

export { Solexa2Message };