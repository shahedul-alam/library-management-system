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
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const port = 5000;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // connecting to mongodb using mongoose
        yield mongoose_1.default.connect(`mongodb+srv://${process.env.DB_HOST}:${process.env.DB_PASS}@cluster0.cu6ru.mongodb.net/LibraryDB?retryWrites=true&w=majority&appName=Cluster0`);
        console.log("Connected to MongoDB using Mongoose");
        // listening the server on post 5000
        app_1.default.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
    catch (error) {
        console.error(error);
    }
});
main();
