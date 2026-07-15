"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../src/app"));
const mongodb_1 = require("../src/config/mongodb");
const serverless_http_1 = __importDefault(require("serverless-http"));
let isConnected = false;
const handler = (0, serverless_http_1.default)(app_1.default);
exports.default = async (req, res) => {
    try {
        if (!isConnected) {
            await (0, mongodb_1.connectDB)();
            isConnected = true;
            console.log("✅ MongoDB Connected");
        }
        return handler(req, res);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
//# sourceMappingURL=index.js.map