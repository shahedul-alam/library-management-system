import express, { NextFunction, Request, Response } from "express";
import z from "zod";
import { Book } from "../models/book.model";
import { Borrow } from "../models/borrow.model";
import { Types } from "mongoose";

// creating borrow router
export const borrowRouter = express.Router();

//middlewares
borrowRouter.use(express.json());

// zod schema
const borrowZodSchema = z.object({
  book: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid Id for book",
    })
    .transform((val) => new Types.ObjectId(val)),
  quantity: z.number(),
  dueDate: z
    .string()
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()) && date >= new Date(), {
      message: "Due date must be a valid date and not in the past",
    }),
});

borrowRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { book, quantity, dueDate } = await borrowZodSchema.parseAsync(
        req.body
      );

      const bookData = await Book.findById(book);

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

      await Book.updateBooksAfterBorrow(book, bookData.copies, quantity);

      const borrowInfo = await Borrow.create(req.body);

      res.status(201).json({
        success: true,
        message: "Book borrowed successfully",
        data: borrowInfo,
      });
    } catch (error: any) {
      /* Passing the error into the global error handler */
      next(error);
    }
  }
);

borrowRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const borrowRecords = await Borrow.aggregate([
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
    } catch (error: any) {
      /* Passing the error into the global error handler */
      next(error);
    }
  }
);
