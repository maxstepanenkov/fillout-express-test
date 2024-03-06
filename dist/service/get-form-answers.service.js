"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
function filterFunc(queryParams, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, condition, value } = queryParams;
        const fullfilledData = data.response.reduce((acc, item_) => {
            const filteredData = data.response.filter((item) => {
                switch (condition) {
                    case 'equals': {
                        return item[id] === value;
                    }
                    case 'does_not_equal': {
                        return item[id] !== value;
                    }
                    case 'greater_than': {
                        if (typeof value !== 'number')
                            console.log('Value is not a number');
                        return item[id] > value;
                    }
                    case 'less_than': {
                        if (typeof value !== 'number')
                            console.log('Value is not a number');
                        return item[id] < value;
                    }
                }
            });
            const obj = Object.assign(Object.assign({}, item_), { questions: filteredData });
            return Object.assign(Object.assign({}, acc), { obj });
        }, []);
        return fullfilledData;
    });
}
function getFormsAnswers(formId, queryParams) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, status } = yield axios_1.default.get(`${process.env.FILLOUT_URL}/${formId}/submissions`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${process.env.FILLOUT_API_KEY}`
                }
            });
            return filterFunc(queryParams, data);
        }
        catch (err) {
            if (axios_1.default.isAxiosError(err)) {
                console.log('error message: ', err.message);
                return err.message;
            }
            else {
                console.log('unexpected error: ', err);
                return 'An  unexpected error occured';
            }
        }
    });
}
exports.default = getFormsAnswers;
