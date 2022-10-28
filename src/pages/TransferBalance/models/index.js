import companyService from "@/services/company";
import { message } from "antd";
import { handleErrorModel } from "@/util/function";
import { router } from "umi";

export default {
  namespace: "COMPANY",
  state: {
    loading: false,
    companies: [],
    totalRow: 0,
    updateResponse: {},
    detailTransaction: {},
    detailCompany: {},
    repaymentResponse: {},
    deleteResponse: {},
  },
  reducers: {
    getCompanySuccess(state, action) {
      return {
        ...state,
        transactions: action.payload,
        loading: false,
      };
    },

    updateTransactionSuccess(state, action) {
      return {
        ...state,
        updateResponse: action.payload,
        loading: false,
      };
    },

    getDetailTransactionSuccess(state, action) {
      return {
        ...state,
        detailTransaction: action.payload,
        loading: false,
      };
    },

    loading(state) {
      return {
        ...state,
        loading: true,
      };
    },

    error(state) {
      return {
        ...state,
        loading: false,
      };
    },

    success(state) {
      return {
        ...state,
        loading: false,
      };
    },

    getListCompaniesSuccess(state, action) {
      return {
        ...state,
        companies: action.payload.data,
        loading: false,
        totalRow: action.payload.totalRecord,
      };
    },
    getDetailCompanySuccess(state, action) {
      return {
        ...state,
        detailCompany: action.payload,
        loading: false,
      };
    },
    companyRepaymentSuccess(state, action) {
      return {
        ...state,
        repaymentResponse: action.payload,
        loading: false,
      };
    },
    deleteCompanySuccess(state, action) {
      return {
        ...state,
        deleteResponse: action.payload,
        loading: false,
      };
    },
  },

  effects: {
    *getListCompanies(action, { call, put }) {
      yield put({ type: "loading" });
      try {
        const res = yield call(companyService.getListCompanies, action.payload);
        if (res.status === 200) {
          yield put({
            type: "getListCompaniesSuccess",
            payload: res.body,
          });
        } else {
          message.error(res.body.message);
          yield put({ type: "error" });
        }
      } catch (error) {
        handleErrorModel(error);
        yield put({ type: "error" });
      }
    },

    *getDetailCompany(action, { call, put }) {
      yield put({ type: "loading" });
      try {
        const res = yield call(companyService.getDetailCompany, action.payload);
        if (res.status === 200) {
          yield put({
            type: "getDetailCompanySuccess",
            payload: res.body.data,
          });
        } else {
          message.error(res.body.message);
          yield put({ type: "error" });
        }
      } catch (error) {
        handleErrorModel(error);
        yield put({ type: "error" });
      }
    },

    *createCompany(action, { call, put }) {
      yield put({ type: "loading" });
      try {
        const res = yield call(companyService.createCompany, action.payload);
        if (res.status === 200) {
          yield put({ type: "success" });
          message.success(res.body.message);
          router.push("/admin/company-manage");
        } else {
          message.error(res.body.message);
          yield put({ type: "error" });
        }
      } catch (error) {
        handleErrorModel(error);
        yield put({ type: "error" });
      }
    },

    *updateCompany(action, { call, put }) {
      yield put({ type: "loading" });
      try {
        const res = yield call(
          companyService.updateCompany,
          action.payload.data
        );
        if (res.status === 200) {
          yield put({ type: "success" });
          message.success(res.body.message);
          router.push(`/admin/detail-company/${action.payload.code}`);
        } else {
          message.error(res.body.message);
          yield put({ type: "error" });
        }
      } catch (error) {
        handleErrorModel(error);
        yield put({ type: "error" });
      }
    },
    *companyRepayment(action, { call, put }) {
      yield put({ type: "loading" });
      try {
        const res = yield call(companyService.companyRepayment, action.payload);
        if (res.status === 200) {
          yield put({ type: "companyRepaymentSuccess", payload: res.body });
          message.success(res.body.message);
        } else {
          message.error(res.body.message);
          yield put({ type: "error" });
        }
      } catch (error) {
        handleErrorModel(error);
        yield put({ type: "error" });
      }
    },

    *deleteCompany(action, { call, put }) {
      yield put({ type: "loading" });
      try {
        const res = yield call(companyService.deleteCompany, action.payload);
        if (res.status === 200) {
          yield put({ type: "deleteCompanySuccess", payload: res.body });
          message.success(res.body.message);
        } else {
          message.error(res.body.message);
          yield put({ type: "error" });
        }
      } catch (error) {
        handleErrorModel(error);
        yield put({ type: "error" });
      }
    },
  },
};
