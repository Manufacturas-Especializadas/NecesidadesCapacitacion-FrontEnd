const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("API base URL is not defined in environment variables");
}

export const API_CONFIG = {
    baseUrl: API_BASE_URL,
    endpoints: {
        auth: {
            roles: "/api/Auth/GetRoles",
            register: "/api/Auth/Register",
            login: "/api/Auth/Login",
            logout: "/api/Auth/Logout"
        },
        training: {
            prioritys: "/api/TrainingNeed/GetPriority",
            categorys: "/api/TrainingNeed/GetCategory",
            trainingNeeds: "/api/TrainingNeed/GetTrainingNeeds",
            trainingNeedsByUser: "/api/TrainingNeed/GetTrainingNeedsByUser",
            downloadExcel: "/api/TrainingNeed/DownloadExcel",
            create: "/api/TrainingNeed/Create",
            delete: "/api/TrainingNeed/Delete/"
        }
    }
};