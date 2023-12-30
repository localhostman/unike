export const PLATFORM_DOMAIN = [
    "https://elink.istarl.com",
    "http://elink.istarl.com",
    "http://localhost:8100",
    "http://localhost:8101",
    "capacitor://localhost"
];

export const DELIVERY_METHOD = {
    SELF_DELIVERY: 1,
    MERCIANT_DELIVERY: 2,
    PLATFORM_DELIVERT: 3,
    POST: 4
};

export const PAYMENT_METHOD = {
    CASH_ON_DELIVERY: 1,
    WX_PAY: 2,
    MONEY_TRANSFER: 3,
    PAYPAL: 4
};

export const SHOP_SETTING = {
    EXCHANGE_RATE: "exchange_rate",
    TRANSPORT_FARE: "transport_fare"
}

export const ORDER_STATE = {
    RESO: -2,
    ANNULLATO: -1,
    INVIATO: 0,
    SPEDITO: 1,
    COMPLETATO: 2,
    PAGATO: 3,
    CREATO: 4,
    RECENSITO: 5,
    STAMPATO: 6,
    IN_PREPARAZIONE: 7
}

export const PROMO_TYPE = {
    MAN_JIAN: 1,
    MAN_SONG: 2,
    YAO_YOU: 3,
    COMMON: 4,
    TRADABLE: 5,
    SHOU_DAN: 6,
    ZHE_KOU_MA: 7,
    HUO_DONG: 8
};

export const PROMO_STATE = {
    DAILY_OFF: -4,
    DAILY_NUM_OFF: -3,
    PERIOD_NUM_OFF: -2,
    EXPIRED: -1,
    AVAILABLE: 0,
    GOT: 1,
    USED: 2,
}

export const PRODUCT_PROP_TYPE = {
    COMMON: "common",
    COLOR: "color"
}


export const PRODUCT_SORT = [
    { id: 'Sort desc', Name: 'Consigliati' },
    { id: 'Name asc', Name: 'Descrizioni' },
    { id: 'CTime desc', Name: 'Novità' },
    { id: 'Price asc', Name: 'Prezzi da basso a alto' },
    { id: 'Price desc', Name: 'Prezzi da alto a basso' }
];

export const INS_MEDIA_TYPE = {
    IMAGE: "IMAGE",
    VIDEO: "VIDEO",
    CAROUSEL_ALBUM: "CAROUSEL_ALBUM"
};

export const FILE_PREFIX: string = "file_";
export const PRODUCT_PROP_SEPARATOR = "_";
export const CATEGORY_UNIT_LEN: number = 3;
export const PROP_UNIT_LEN: number = 2;
export const COLLECTION_IDNO: string = "001";
export const MATETIAL_IDNO: string = "002";