
export const isAvailable = (statusCode: string) => {
    return ["2", "8", "9"].includes(statusCode);
};

export const CHARGER_TYPES = {
    RAPID: "06",
    SLOW: "02"
} as const;
