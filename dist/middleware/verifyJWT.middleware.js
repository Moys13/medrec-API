"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jwt_1 = require("../utils/jwt");
const response_1 = __importDefault(require("../utils/response"));
dotenv_1.default.config();
const verifyJWT = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token)
        return res.status(401).json((0, response_1.default)("401", "Gagal menghubungkan", null, {
            message: "Akses token diperlukan",
        }));
    const payload = (0, jwt_1.verifyAccessToken)(token);
    if (!payload)
        return res.status(401).json((0, response_1.default)("401", "Gagal menghubungkan", null, {
            message: "Akses token tidak valid",
        }));
    req.user = payload;
    next();
};
exports.default = verifyJWT;
//# sourceMappingURL=verifyJWT.middleware.js.map