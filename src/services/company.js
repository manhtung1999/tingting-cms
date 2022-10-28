import request from "./request";

export default {
  getListCompanies: (payload) => {
    return request.get("api/admin/v1/company/get-companies", payload);
  },
  getDetailCompany: (payload) => {
    return request.get("api/admin/v1/company/get-detail", payload);
  },

  createCompany: (payload) => {
    return request.post("api/admin/v1/company/add-company", payload);
  },
  updateCompany: (payload) => {
    return request.post("api/admin/v1/company/edit-company", payload);
  },
  companyRepayment: (payload) => {
    return request.post("api/admin/v1/transaction/company-repayment", payload);
  },
  deleteCompany: (payload) => {
    return request.post("api/admin/v1/company/delete-company", payload);
  },
};
