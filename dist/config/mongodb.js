"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable");
}
const client = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
const connectDB = async () => {
    try {
        await client.connect();
        // Test the connection
        await client.db("admin").command({ ping: 1 });
        console.log("✅ MongoDB Connected");
    }
    catch (error) {
        console.error("❌ MongoDB Connection Failed");
        console.error(error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
exports.default = client;
//# sourceMappingURL=mongodb.js.map