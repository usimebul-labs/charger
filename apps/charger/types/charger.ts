import { Interface } from "readline";

export interface CodeValue {
    code: any;
    value: any;
}

export interface ChargerInfo {
    id: number;
    searchKey: number;
    status: CodeValue;
    type: CodeValue;
    capacity: string;
    floor: "B3" | "B4" | "B5";
}