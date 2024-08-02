const USER_ROLE_ENUM = {
    ADMIN: "admin",
    USER: "user",
} as const;

type UserRoleEnumType = (typeof USER_ROLE_ENUM)[keyof typeof USER_ROLE_ENUM];

const CART_STATUS_ENUM = {
    PENDING: "pending",
    ORDERED: "ordered",
    DELIVERED: "delivered",
} as const;

type CartStatusEnumType =
    (typeof CART_STATUS_ENUM)[keyof typeof CART_STATUS_ENUM];

const PRODUCT_SORT_ENUM = {
    NEW_FIRST: "newFirst",
    PRICE_LOW_TO_HIGH: "priceLowToHigh",
    PRICE_HIGH_TO_LOW: "priceHighToLow",
} as const;

type ProductSortEnumType =
    (typeof PRODUCT_SORT_ENUM)[keyof typeof PRODUCT_SORT_ENUM];

export {
    USER_ROLE_ENUM,
    UserRoleEnumType,
    CART_STATUS_ENUM,
    CartStatusEnumType,
    PRODUCT_SORT_ENUM,
    ProductSortEnumType,
};
