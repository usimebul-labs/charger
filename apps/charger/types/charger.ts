export interface CodeValue {
    code: string;
    value: string;
}

export interface ChargerInfo {
    id: number;
    searchKey: number;
    status: CodeValue;
    type: CodeValue;
    capacity: string;
    floor: "B3" | "B4" | "B5";
}