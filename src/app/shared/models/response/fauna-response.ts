import { Fauna } from "../fauna.model";

export class FaunaResponse {
    data: Fauna[];
    totalrecord: Number;
    message: string;
    isSuccess: boolean;
    constructor() { }
}