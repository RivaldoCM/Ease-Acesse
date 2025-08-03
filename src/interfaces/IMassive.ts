type IMassive = {
    id: number;
    created_at: Date;
    Cities: {
        id: number;
        name: string;
    }
    User_Massive_created_by: {
        name: string;
    },
    User_Massive_last_updated_by: {
        name: string | null;
    },
    User_Massive_finished_by: {
        name: string | null;
    },
    affected_local: string;
    description: string;
    failure_date: Date;
    forecast_return: Date;
    finished_status: string;
    status: boolean;
    type: string;
    ready_to_finish: boolean;
}
