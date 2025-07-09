import express, { NextFunction, Request, Response } from "express";
import { Book } from "../models/book.model";
import z from "zod";

// creating book router
export const bookRouter = express.Router();

//middlewares
bookRouter.use(express.json());

// zod schema
const bookZodSchema = z.object({
  title: z.string(),
  author: z.string(),
  genre: z.string(),
  isbn: z.string(),
  description: z.string().optional(),
  copies: z.number(),
  available: z.boolean(),
});

bookRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    /* Destructuring the query parameters from the `req.query` object. */
    const { filter, sortBy, sort, limit } = req.query;

    /* Handling the query parameters to be of right data type and value */
    const sortField = typeof sortBy === "string" ? sortBy : "createdAt";
    const sortOrder = sort === "desc" ? -1 : 1;
    const contentLimit = parseInt(limit as string) || 10;

    /* This code snippet is querying the database to find books based on certain criteria. */
    const books = await Book.find(filter ? { genre: filter } : {})
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
  } catch (error: any) {
    /* Passing the error into the global error handler */
    next(error);
  }
});

bookRouter.get(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      /* Destructuring the parameters from the `req.params` object. */
      const { bookId } = req.params;

      /* This code snippet is querying the database to find book based on objectId. */
      const book = await Book.findById(bookId);

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
    } catch (error: any) {
      /* Passing the error into the global error handler */
      next(error);
    }
  }
);

bookRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      /* Validating and sanitizing the data from req.body using zod */
      const validatedData = await bookZodSchema.parseAsync(req.body);

      /* Validating and sanitizing the data using mongoose and saving into database*/
      const book = await Book.create(validatedData);

      /* The code is setting the HTTP response status to 201 (Created) and sending a JSON response back to the client. */
      res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: book,
      });
    } catch (error: any) {
      /* Passing the error into the global error handler */
      next(error);
    }
  }
);

bookRouter.patch(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      /* Destructuring the parameters from the `req.params` object. */
      const { bookId } = req.params;

      // /* Validating and sanitizing the data from req.body using zod */
      const validatedData = await bookZodSchema
        .partial()
        .strict()
        .parseAsync(req.body);

      /* Querying the database using objectId and updating with new data. */
      const book = await Book.findByIdAndUpdate(bookId, validatedData, {
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
    } catch (error: any) {
      /* Passing the error into the global error handler */
      next(error);
    }
  }
);

bookRouter.delete(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      /* Destructuring the parameters from the `req.params` object. */
      const { bookId } = req.params;

      /* Querying the database using objectId and updating with new data. */
      const book = await Book.findByIdAndDelete(bookId);

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
    } catch (error: any) {
      /* Passing the error into the global error handler */
      next(error);
    }
  }
);
