import request from './request';

export default {
    getSecretKey: payload => {
        return request.post(`api/v1/secret-key/get?userId=${payload.userId}`);
    },
};
