"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patient_routes_1 = __importDefault(require("./routes/patient.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const outpatient_routes_1 = __importDefault(require("./routes/outpatient.routes"));
const verifyJWT_middleware_1 = __importDefault(require("./middleware/verifyJWT.middleware"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const prisma_1 = require("./utils/prisma");
const app = (0, express_1.default)();
const port = 3001;
const host = process.env.HOST;
process.on("SIGINT", async () => {
    await (0, prisma_1.disconnectPrisma)();
    process.exit(0);
});
process.on("SIGTERM", async () => {
    await (0, prisma_1.disconnectPrisma)();
    process.exit(0);
});
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/pasien", verifyJWT_middleware_1.default, patient_routes_1.default);
app.use("/api/rawat-jalan", verifyJWT_middleware_1.default, outpatient_routes_1.default);
app.listen(port, host, () => {
    console.log(`Server berjalan di http://${host}:${port}`);
});
//# sourceMappingURL=app.js.map