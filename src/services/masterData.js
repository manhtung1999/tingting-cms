import request from "./request";

export default {
  getCountUnread: (payload) => {
    return request.get("api/admin/v1/chat/get-count-unread", payload);
  },

  changeUserPassword: (payload) => {
    return request.post("api/v1/user/change-password", payload);
  },

  updateProfile: (payload) => {
    return request.post("api/v1/user/update", payload);
  },

  getLanguages: (payload) => {
    return request.get("api/v1/language/languages", payload);
  },
  getAllCompany: (payload) => {
    return request.get("api/admin/v1/company/get-all-companies", payload);
  },
  getMyProfile: (payload) => {
    return request.get("api/v1/user/get-my-profile", payload);
  },
  updateProfile: (payload) => {
    return request.post("api/admin/v1/user/edit-user", payload);
  },
};
