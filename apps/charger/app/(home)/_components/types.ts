export type StationStatus = "충전 가능" | "충전 중" | "점검 중";
export type StationType = "완속" | "급속";

export interface Station {
  id: string; // e.g. 110112301
  label: string; // e.g. A-01
  floor: number;
  type: StationType;
  status: StationStatus;
}
