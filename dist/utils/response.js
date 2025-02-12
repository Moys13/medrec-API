"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseApi = (status, message, data, error, meta) => {
    return {
        status,
        message,
        data,
        timestamp: new Date().toISOString(),
        error: error || null,
        meta: meta || null,
    };
};
exports.default = responseApi;
//# sourceMappingURL=response.js.map