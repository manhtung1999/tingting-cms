import request from "./request";

export default {
  getStatements: (payload) => {
    return request.get("api/admin/v1/money-statement/get-statements", payload);
  },
  getTransactions: (payload) => {
    return request.get("api/admin/v1/money-statement/get-transactions", payload);
  },

  exportTransactions: (payload) => {
    return request.get("api/admin/v1/money-statement/export-transactions", payload);
  },
 
  companyRepayment: (payload) => {
    return request.post("api/admin/v1/transaction/company-repayment", payload);
  },
};
