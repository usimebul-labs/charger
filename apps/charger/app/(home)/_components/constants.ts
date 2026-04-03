import { Station } from "./types";

export const STATIONS: Station[] = [
  // 3층
  { id: "11012303", label: "11012303", floor: 3, type: "완속", status: "점검 중" },
  { id: "11012304", label: "11012304", floor: 3, type: "완속", status: "충전 가능" },
  { id: "11012301", label: "11012301", floor: 3, type: "급속", status: "충전 중" },
  // 4층
  { id: "11012305", label: "11012305", floor: 4, type: "완속", status: "충전 가능" },
  { id: "11012306", label: "11012306", floor: 4, type: "완속", status: "충전 중" },
  { id: "11012302", label: "11012302", floor: 4, type: "급속", status: "충전 가능" },
  // 5층
  { id: "11012307", label: "11012307", floor: 5, type: "완속", status: "충전 중" },
  { id: "11012308", label: "11012308", floor: 5, type: "완속", status: "충전 가능" },
  { id: "11012309", label: "11012309", floor: 5, type: "완속", status: "점검 중" },
];

export const FLOORS = [3, 4, 5];
