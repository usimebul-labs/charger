export interface CodeValue {
    code: string;
    value: string;
}

export interface Station {
    id: number;
    stationName: string;
    stationKey: string;
    addressRoad: string;
    lat: number;
    lng: number;
    operationStatus: string;
    operationStatusObj: CodeValue;
    memo: string | null;
    // 필요한 필드만 추가하여 사용하세요
    [key: string]: any;
}

export interface ChargerInfo {
    id: number;
    trusterName: string;
    station: Station;
    chargerKey: string;
    operationStatus: CodeValue;
    status: CodeValue;
    type: CodeValue;
    model: string;
    chargerClass: CodeValue;
    capacity: string;
    connection: boolean;
}