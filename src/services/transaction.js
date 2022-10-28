import request from "./request";

export default {
  getTransactions: (payload) => {
    return request.get("api/admin/v1/transaction/get-transactions", payload);
  },
  updateTransaction: (payload) => {
    return request.post(
      "api/admin/v1/transaction/update-status-transaction",
      payload
    );
  },

  getDetailTransaction: (payload) => {
    return request.get(
      "api/admin/v1/transaction/get-detail-transaction",
      payload
    );
  },

  checkTransaction: (payload) => {
    return request.post("api/admin/v1/transaction/check-transaction", payload);
  },
};
