import express, { Application, NextFunction, Request, Response } from "express";
import { bookRouter } from "./controllers/books.controller";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { borrowRouter } from "./controllers/borrows.controller";

// creating an app using express 
const app: Application = express();

// router middlewares
app.use("/api/books", bookRouter);
app.use("/api/borrow", borrowRouter);

// entry point of the server
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the library management system's server");
});

// middleware to handle invalid routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("Sorry, that route doesn't exists!");
});

// global error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ZodError) {
    // Zod validation error
    res.status(400).json({
      success: false,
      message: "Zod Validation Failed",
      error,
    });
  } else if (error instanceof mongoose.Error.ValidationError) {
    // Mongoose schema validation error
    res.status(400).json({
      success: false,
      message: "Mongoose Validation Failed",
      error,
    });
  } else if (error instanceof mongoose.Error.CastError) {
    // Mongoose casting error (e.g. invalid ObjectId)
    res.status(400).json({
      success: false,
      message: "Mongoose Casting Failed",
      error,
    });
  } else if (error instanceof Error) {
    // Generic JS error
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  } else {
    // Truly unknown error
    res.status(500).json({
      success: false,
      message: "Unknown Error",
      error,
    });
  }
});

export default app;
