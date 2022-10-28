import request from "./request";

export default {
  getDashboard: (payload) => {
    return request.get("api/admin/v1/statistic/get-dashboard", payload);
  },

  getTransactionChart: (payload) => {
    return request.get("api/admin/v1/statistic/get-transaction-chart", payload);
  },

  overviewCompleted: (payload) => {
    return request.get("api/admin/v1/statistic/journey-completed?", payload);
  },
};
