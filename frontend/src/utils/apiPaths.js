export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", //(both admin and member can)
    LOGIN: "/api/auth/login", ///authenticate user  and return jwt
    GET_USER_PROFILE: "/api/auth/user-profile", //for admiin and user when they login
  },
  USERS: {
    GET_ALL_USERS: "/api/users", ///get all  existed users (admin only)
    GET_USER_BY_ID: (userid) => "/api/users/:userid", ///get single  existed user by id (admin only)

    CREATE_USER: "/api/users", // admin  only

    UPDATE_USER: (userid) => "/api/users/:userid", //update user detail
    DELETE_USER: (userid) => "/api/users/:userid", // delete user by admin
  },
  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data", ///admin only
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-data-dashboard", ///user side data
    GET_ALL_TASKS: "/api/tasks", //get all tasks  (admin will get all , user only get assigned task)

    GET_TASK_BY_ID: (taskID) => `/api/tasks/${taskID}`,
    CREATE_TASK: "/api/tasks", //admiin only
    UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, //admin and user
    DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, //admin only can delete task

    UPDATE_TASK_STATUS: (taskid) => `/api/tasks/${taskid}/status`,
    UPDATE_TODO_CHECKLIST: (taskid) => `/api/tasks/${taskid}/checklist`,
  },
  REPORT: {
    EXPORT_TASKS: "/api/reports/export/tasks", //adminonly
    EXPORT_USERS: "/api/reports/export/users", //adminonly
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
};
