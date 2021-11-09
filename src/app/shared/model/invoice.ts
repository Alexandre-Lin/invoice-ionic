import { Product } from "./product";

import { Moment } from "moment";

export interface Invoice {
    date: Moment;
    productList: Product[];
    tax: number;
    total: number;
}