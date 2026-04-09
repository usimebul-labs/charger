export interface CodeValue {
    code: string;
    value: string;
}

export interface ChargerStatus extends CodeValue {
    desc?: string;
}

export interface ChargerType extends CodeValue {
    adapter?: string;
}

export interface ChargerInfo {
    id: number;
    searchKey: number;
    status: ChargerStatus;
    type: ChargerType;
    capacity: string;
    floor: "B3" | "B4" | "B5";
}