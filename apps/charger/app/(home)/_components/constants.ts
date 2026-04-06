import { ChargerInfo } from "../../../types/charger";

export const STATIONS: ChargerInfo[] = [
  // 3층 (B3) - searchKey: 11012301, 11012303, 11012304
  {
    id: 11012303,
    searchKey: 11012303,
    status: { code: "03", value: "점검 중" },
    type: { code: "01", value: "완속" },
    capacity: "7kW",
    floor: "B3"
  },
  {
    id: 11012304,
    searchKey: 11012304,
    status: { code: "01", value: "충전 가능" },
    type: { code: "01", value: "완속" },
    capacity: "7kW",
    floor: "B3"
  },
  {
    id: 11012301,
    searchKey: 11012301,
    status: { code: "02", value: "충전 중" },
    type: { code: "02", value: "급속" },
    capacity: "50kW",
    floor: "B3"
  },
  // 4층 (B4) - searchKey: 11012302, 11012305, 11012306
  {
    id: 11012305,
    searchKey: 11012305,
    status: { code: "01", value: "충전 가능" },
    type: { code: "01", value: "완속" },
    capacity: "7kW",
    floor: "B4"
  },
  {
    id: 11012306,
    searchKey: 11012306,
    status: { code: "02", value: "충전 중" },
    type: { code: "01", value: "완속" },
    capacity: "7kW",
    floor: "B4"
  },
  {
    id: 11012302,
    searchKey: 11012302,
    status: { code: "01", value: "충전 가능" },
    type: { code: "02", value: "급속" },
    capacity: "50kW",
    floor: "B4"
  },
  // 5층 (B5) - searchKey: 11012307, 11012308, 11012309
  {
    id: 11012307,
    searchKey: 11012307,
    status: { code: "02", value: "충전 중" },
    type: { code: "01", value: "완속" },
    capacity: "7kW",
    floor: "B5"
  },
  {
    id: 11012308,
    searchKey: 11012308,
    status: { code: "01", value: "충전 가능" },
    type: { code: "01", value: "완속" },
    capacity: "7kW",
    floor: "B5"
  },
  {
    id: 11012309,
    searchKey: 11012309,
    status: { code: "03", value: "점검 중" },
    type: { code: "01", value: "완속" },
    capacity: "7kW",
    floor: "B5"
  },
];

export const FLOORS = [3, 4, 5];
