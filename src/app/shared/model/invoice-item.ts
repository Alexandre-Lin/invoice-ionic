import { Product } from "./product";

import { Moment } from "moment";

export interface InvoiceItem {
    keyStoredId: string,
    date: Moment;
    productList: Product[];
    // tax percentage (not the tax charge amount)
    tax: number;
    total: number;
    paymentMode: string;
}