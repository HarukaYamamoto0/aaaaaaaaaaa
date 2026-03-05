export enum ConnectionMode {
	Adapter = 0xfa60,
	Wired = 0xfa55,
}

interface ControlTransferBase {
	bmRequestType: number;
	bRequest: number;
	wValue: number;
	wIndex: number;
}

export interface ControlTransferIn extends ControlTransferBase {
	data: number;
}

export interface ControlTransferOut extends ControlTransferBase {
	data: Buffer;
}

export type ControlTransferOptions = ControlTransferIn | ControlTransferOut;

export enum Button {
	LEFT = 0,
	RIGHT = 1,
	MIDDLE = 2,
	FORWARD = 3,
	BACKWARD = 4,
	DPI = 5,
	SCROLL_UP = 6,
	SCROLL_DOWN = 7,
}
