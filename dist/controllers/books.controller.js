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
exports.bookRouter = void 0;
const express_1 = __importDefault(require("express"));
const book_model_1 = require("../models/book.model");
const zod_1 = __importDefault(require("zod"));
// creating book router
exports.bookRouter = express_1.default.Router();
//middlewares
exports.bookRouter.use(express_1.default.json());
// zod schema
const bookZodSchema = zod_1.default.object({
    title: zod_1.default.string(),
    author: zod_1.default.string(),
    genre: zod_1.default.string(),
    isbn: zod_1.default.string(),
    description: zod_1.default.string().optional(),
    copies: zod_1.default.number(),
    available: zod_1.default.boolean(),
});
exports.bookRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /* Destructuring the query parameters from the `req.query` object. */
        const { filter, sortBy, sort, limit } = req.query;
        /* Handling the query parameters to be of right data type and value */
        const sortField = typeof sortBy === "string" ? sortBy : "createdAt";
        const sortOrder = sort === "desc" ? -1 : 1;
        const contentLimit = parseInt(limit) || 10;
        /* This code snippet is querying the database to find books based on certain criteria. */
        const books = yield book_model_1.Book.find(filter ? { genre: filter } : {})
            .sort({
            [sortField]: sortOrder,
        })
            .limit(contentLimit);
        /* The code is setting the HTTP response status to 200 (Successful Operation) and sending a JSON response back to the client. */
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    }
    catch (error) {
        /* Passing the error into the global error handler */
        next(error);
    }
}));
exports.bookRouter.get("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /* Destructuring the parameters from the `req.params` object. */
        const { bookId } = req.params;
        /* This code snippet is querying the database to find book based on objectId. */
        const book = yield book_model_1.Book.findById(bookId);
        /* The code is setting the HTTP response status to 400 (Unsuccessful Operation) and sending a error back to the client. */
        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book retrieved unsuccessful",
                error: "Book not found",
            });
            return;
        }
        /* The code is setting the HTTP response status to 200 (Successful Operation) and sending a JSON response back to the client. */
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: book,
        });
    }
    catch (error) {
        /* Passing the error into the global error handler */
        next(error);
    }
}));
exports.bookRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /* Validating and sanitizing the data from req.body using zod */
        const validatedData = yield bookZodSchema.parseAsync(req.body);
        /* Validating and sanitizing the data using mongoose and saving into database*/
        const book = yield book_model_1.Book.create(validatedData);
        /* The code is setting the HTTP response status to 201 (Created) and sending a JSON response back to the client. */
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    }
    catch (error) {
        /* Passing the error into the global error handler */
        next(error);
    }
}));
exports.bookRouter.patch("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /* Destructuring the parameters from the `req.params` object. */
        const { bookId } = req.params;
        // /* Validating and sanitizing the data from req.body using zod */
        const validatedData = yield bookZodSchema
            .partial()
            .strict()
            .parseAsync(req.body);
        /* Querying the database using objectId and updating with new data. */
        const book = yield book_model_1.Book.findByIdAndUpdate(bookId, validatedData, {
            new: true,
            runValidators: true,
        });
        /* The code is setting the HTTP response status to 400 (Unsuccessful Operation) and sending a error back to the client. */
        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book update unsuccessful",
                error: "Book not found",
            });
            return;
        }
        /* The code is setting the HTTP response status to 200 (Successful Operation) and sending a JSON response back to the client. */
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book,
        });
    }
    catch (error) {
        /* Passing the error into the global error handler */
        next(error);
    }
}));
exports.bookRouter.delete("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /* Destructuring the parameters from the `req.params` object. */
        const { bookId } = req.params;
        /* Querying the database using objectId and updating with new data. */
        const book = yield book_model_1.Book.findByIdAndDelete(bookId);
        /* The code is setting the HTTP response status to 400 (Unsuccessful Operation) and sending a error back to the client. */
        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book delete unsuccessful",
                error: "Book not found",
            });
            return;
        }
        /* The code is setting the HTTP response status to 200 (Successful Operation) and sending a JSON response back to the client. */
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: book,
        });
    }
    catch (error) {
        /* Passing the error into the global error handler */
        next(error);
    }
}));
