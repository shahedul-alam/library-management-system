"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_controller_1 = require("./controllers/books.controller");
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const borrows_controller_1 = require("./controllers/borrows.controller");
// creating an app using express 
const app = (0, express_1.default)();
// router middlewares
app.use("/api/books", books_controller_1.bookRouter);
app.use("/api/borrow", borrows_controller_1.borrowRouter);
// entry point of the server
app.get("/", (req, res) => {
    res.send("Welcome to the library management system's server");
});
// middleware to handle invalid routes
app.use((req, res, next) => {
    res.status(404).send("Sorry, that route doesn't exists!");
});
// global error handler
app.use((error, req, res, next) => {
    if (error instanceof zod_1.ZodError) {
        // Zod validation error
        res.status(400).json({
            success: false,
            message: "Zod Validation Failed",
            error,
        });
    }
    else if (error instanceof mongoose_1.default.Error.ValidationError) {
        // Mongoose schema validation error
        res.status(400).json({
            success: false,
            message: "Mongoose Validation Failed",
            error,
        });
    }
    else if (error instanceof mongoose_1.default.Error.CastError) {
        // Mongoose casting error (e.g. invalid ObjectId)
        res.status(400).json({
            success: false,
            message: "Mongoose Casting Failed",
            error,
        });
    }
    else if (error instanceof Error) {
        // Generic JS error
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });
    }
    else {
        // Truly unknown error
        res.status(500).json({
            success: false,
            message: "Unknown Error",
            error,
        });
    }
});
exports.default = app;
