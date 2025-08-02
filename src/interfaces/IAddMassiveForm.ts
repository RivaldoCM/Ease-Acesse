export type IAddMassive = {
    massiveId?: number,
    user?: number | undefined,
    cityId?: number | null
    forecastReturn?: string,
    failureTime?: string,
    forecastDateToISO?: string | null,
    failureDateToISO?: string | null,
    problemType?: string,
    description?: string,
    affectedLocals?: string
    readyToFinish?: boolean
}