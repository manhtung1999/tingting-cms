const PAGE_SIZE = 20;
const DATE_TRANSACTION = 'YYYY-MM-DD HH:mm:ss.S';
const DATE_FORMAT_TRANSACTION = 'YYYY-MM-DD HH:mm:ss';
const DATE_FILTER = 'YYYY/MM/DD';
const DATE_TIME = 'HH:mm DD-MM-YYYY';
const DATE_TIME_FULL = 'HH:mm:ss DD-MM-YYYY';
const DATE = 'DD/MM/YYYY';
const DATE_TODAY = 'DD-MM-YYYY';
const DATE_FORMAT = 'DD/MM/YYYY';
const ROLE_USER = 0;
const TOKEN_KEY = 'token';
const ADMIN_KEY = 'Admin';
const DEVICE_KEY = 'device_key';
const EXPORT_KEY = 'export_key';

const MIN_WITHDRAW = 10000;
const TIME_DELAY_EXPORT = 180000; // 3 phut
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

const PaymentTypeAll = {
    bankQr: 0,
    bank: 1,
    electronicWalletQr: 2,
    electronicWallet: 3,
    coin: 4,
    card: 5,
};

const PaymentTypeValue = {
    0: 'bankQr',
    1: 'bank',
    2: 'electronicWalletQr',
    3: 'electronicWallet',
    4: 'coin',
};

const PaymentTypeValueAll = {
    0: 'bankQr',
    1: 'bank',
    2: 'electronicWalletQr',
    3: 'electronicWallet',
    4: 'coin',
    5: 'card',
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
    IN_PROGRESS_CARD: 4,
    DEVICE_RECEIVING: 5,
    DEVICE_PROCESSING: 6,
    DEVICE_PROCESSED_FAIL: 7,
    DEVICE_PROCESSED_DONE: 8,
    DEVICE_PROCESS_FAIL: 9,
};

const TransactionStatusValue = {
    0: 'IN_PROGRESS_USER',
    1: 'IN_PROGRESS_STAFF',
    2: 'SUCCESS',
    3: 'FAIL',
    4: 'IN_PROGRESS_CARD',
    5: 'DEVICE_RECEIVING',
    6: 'DEVICE_PROCESSING',
    7: 'DEVICE_PROCESSED_FAIL',
    8: 'DEVICE_PROCESSED_DONE',
    9: 'DEVICE_PROCESS_FAIL',
};

const SystemTransactionType = {
    MONEY_IN_SYSTEM: 'MONEY_IN_SYSTEM',
    MONEY_OUT_SYSTEM: 'MONEY_OUT_SYSTEM',
    MONEY_SEND_INTERNAL: 'MONEY_SEND_INTERNAL',
    USER_EDIT_MONEY: 'USER_EDIT_MONEY',
};

const SystemTransactionTypeName = {
    MONEY_IN_SYSTEM_DEPOSIT: 'MONEY_IN_SYSTEM_DEPOSIT',
    MONEY_IN_SYSTEM_WITHDRAW: 'MONEY_IN_SYSTEM_WITHDRAW',
    MONEY_OUT_SYSTEM: 'MONEY_OUT_SYSTEM',
    MONEY_SEND_INTERNAL: 'MONEY_SEND_INTERNAL',
    USER_EDIT_MONEY: 'USER_EDIT_MONEY',
};

const Lock = {
    YES: 'YES',
    NO: 'NO',
};

const TypeLock = {
    ONE: 'ONE',
    ALL: 'ALL',
};

const TypeLockCard = {
    OPEN: 'OPEN',
    CLOSE_ALL: 'CLOSE_ALL',
    CLOSE_SEND_MONEY: 'CLOSE_SEND_MONEY',
    CLOSE_WITHDRAW_MONEY: 'CLOSE_WITHDRAW_MONEY',
};

const MenhGia = [10000, 20000, 50000, 100000, 200000, 500000, 1000000];

const TelecomServiceCode = {
    Viettel: 'Viettel',
    Vina: 'Vina',
    Vnmobile: 'Vnmobile',
    Mobi: 'Mobi',
};

export {
    DATE_TRANSACTION,
    PAGE_SIZE,
    DATE_FILTER,
    DATE_TIME,
    DATE,
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
    EXPORT_KEY,
    TIME_DELAY_EXPORT,
    SystemTransactionTypeName,
    Lock,
    TypeLock,
    MenhGia,
    TelecomServiceCode,
    PaymentTypeValueAll,
    PaymentTypeAll,
    TypeLockCard,
};
