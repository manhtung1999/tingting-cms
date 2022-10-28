import request from "./request";

export default {
  getUserBorrow: (payload) => {
    return request.get("api/admin/v1/user/get-users-borrowing", payload);
  },
  staffRepayment: (payload) => {
    return request.post("api/admin/v1/transaction/staff-repayment", payload);
  },
};
