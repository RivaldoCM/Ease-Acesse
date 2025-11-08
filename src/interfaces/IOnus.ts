export type IOnu = {
    onu: {
        oltId: number;
        slot: number;
        pon: number;
        model: string;
        modelOlt: string;
        serialNumber: string;
        onuRx?: string;
        voalleId: number;
    }
}

export type IOnus = {
    oltId: number;
    slot: number;
    pon: number;
    model: string;
    modelOlt: string;
    serialNumber: string;
    onuRx?: string;
    voalleId: number;
}