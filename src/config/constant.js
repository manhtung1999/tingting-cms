const PAGE_SIZE = 20;
const DATE_TRANSACTION = 'YYYY-MM-DD HH:mm:ss.S';
// const DATE_TRANSACTION = 'YYYY-MM-DDHH:mm:ss';
const DATE_FORMAT_TRANSACTION = 'YYYY-MM-DD HH:mm:ss';
const DATE_FILTER = 'YYYY/MM/DD';
const DATE_FILTER_1 = 'YYYY/MM/DD';
const TIME_FORMAT = 'THH:mm:ss.SSS+00:00';
const DATE_TIME = 'HH:mm DD-MM-YYYY';
const DATE_TIME_FULL = 'HH:mm:ss DD-MM-YYYY';
const DATE = 'DD/MM/YYYY';
const DATE_TODAY = 'DD-MM-YYYY';
const DATE_FORMAT = 'DD/MM/YYYY';
const ROLE_USER = 0;
const ROLE_ADMIN_SYSTEM = 1; // 1
const ROLE_ADMIN_COMPANY = 2; // 2
const TOKEN_KEY = 'token';
const ADMIN_KEY = 'Admin';
const DEVICE_KEY = 'device_key';
const MIN_WITHDRAW = 10000;
const ADMIN_ID = 1;
const TIEN_KHONG_RO_NGUON = 'Tiền không rõ nguồn.';
const Role = {
    ROLE_USER: 0,
    ROLE_ADMIN: 1,
    ROLE_STAFF: 2,
    ROLE_ACCOUNTANT: 3,
    ROLE_AGENT: 4,
};

const RoleName = {
    0: 'ROLE_USER',
    1: 'ROLE_ADMIN',
    2: 'ROLE_STAFF',
    3: 'ROLE_ACCOUNTANT',
    4: 'ROLE_AGENT',
};

const DeviceStatusValue = {
    off: 0,
    on: 1,
    // error: 2,
};

const DeviceStatus = {
    0: 'off',
    1: 'on',
    2: 'error',
};

const PaymentType = {
    bankQr: 0,
    bank: 1,
    electronicWalletQr: 2,
    electronicWallet: 3,
    coin: 4,
};

const PaymentTypeValue = {
    0: 'bankQr',
    1: 'bank',
    2: 'electronicWalletQr',
    3: 'electronicWallet',
    4: 'coin',
};

const TransactionType = {
    send_money: 0,
    withdraw_money: 1,
};

const TransactionTypeValue = {
    0: 'send_money',
    1: 'withdraw_money',
};

const TransactionStatus = {
    IN_PROGRESS_USER: 0,
    IN_PROGRESS_STAFF: 1,
    SUCCESS: 2,
    FAIL: 3,
};

const TransactionStatusValue = {
    0: 'IN_PROGRESS_USER',
    1: 'IN_PROGRESS_STAFF',
    2: 'SUCCESS',
    3: 'FAIL',
};

const SystemTransactionType = {
    MONEY_IN_SYSTEM: 'MONEY_IN_SYSTEM',
    MONEY_OUT_SYSTEM: 'MONEY_OUT_SYSTEM',
    MONEY_SEND_INTERNAL: 'MONEY_SEND_INTERNAL',
    USER_EDIT_MONEY: 'USER_EDIT_MONEY',
};

export {
    DATE_TRANSACTION,
    PAGE_SIZE,
    TIME_FORMAT,
    DATE_FILTER,
    DATE_FILTER_1,
    DATE_TIME,
    DATE,
    ROLE_ADMIN_SYSTEM,
    ROLE_ADMIN_COMPANY,
    ROLE_USER,
    DATE_TODAY,
    DATE_FORMAT,
    TOKEN_KEY,
    ADMIN_KEY,
    DEVICE_KEY,
    Role,
    RoleName,
    DeviceStatus,
    DeviceStatusValue,
    PaymentType,
    DATE_TIME_FULL,
    TransactionType,
    TransactionStatus,
    TransactionStatusValue,
    PaymentTypeValue,
    DATE_FORMAT_TRANSACTION,
    TransactionTypeValue,
    MIN_WITHDRAW,
    ADMIN_ID,
    TIEN_KHONG_RO_NGUON,
    SystemTransactionType,
};
