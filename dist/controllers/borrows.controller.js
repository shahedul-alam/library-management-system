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
exports.borrowRouter = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = __importDefault(require("zod"));
const book_model_1 = require("../models/book.model");
const borrow_model_1 = require("../models/borrow.model");
const mongoose_1 = require("mongoose");
// creating borrow router
exports.borrowRouter = express_1.default.Router();
//middlewares
exports.borrowRouter.use(express_1.default.json());
// zod schema
const borrowZodSchema = zod_1.default.object({
    book: zod_1.default
        .string()
        .refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
        message: "Invalid Id for book",
    })
        .transform((val) => new mongoose_1.Types.ObjectId(val)),
    quantity: zod_1.default.number(),
    dueDate: zod_1.default
        .string()
        .transform((val) => new Date(val))
        .refine((date) => !isNaN(date.getTime()) && date >= new Date(), {
        message: "Due date must be a valid date and not in the past",
    }),
});
exports.borrowRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book, quantity, dueDate } = yield borrowZodSchema.parseAsync(req.body);
        const bookData = yield book_model_1.Book.findById(book);
        if (!bookData) {
            res.status(404).json({
                success: false,
                message: "Book retrieved unsuccessful",
                error: "Book not found",
            });
            return;
        }
        if (bookData.copies < quantity || bookData.copies === 0) {
            res.status(400).json({
                success: false,
                message: "Book borrowed unsuccessful",
                error: "Not enough copies available",
            });
            return;
        }
        yield book_model_1.Book.updateBooksAfterBorrow(book, bookData.copies, quantity);
        const borrowInfo = yield borrow_model_1.Borrow.create(req.body);
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrowInfo,
        });
    }
    catch (error) {
        /* Passing the error into the global error handler */
        next(error);
    }
}));
exports.borrowRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const borrowRecords = yield borrow_model_1.Borrow.aggregate([
            { $group: { _id: "$book", totalQuantity: { $sum: "$quantity" } } },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book",
                },
            },
            { $unwind: "$book" },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$book.title",
                        isbn: "$book.isbn",
                    },
                    totalQuantity: 1,
                },
            },
        ]);
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: borrowRecords,
        });
    }
    catch (error) {
        /* Passing the error into the global error handler */
        next(error);
    }
}));
