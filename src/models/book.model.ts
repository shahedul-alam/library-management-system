import { Model, model, Schema, Types } from "mongoose";
import { BookStaticMethods, IBook } from "../interfaces/book.interface";

const bookSchema = new Schema<IBook, Model<IBook>, BookStaticMethods>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: {
      type: String,
      required: true,
      enum: [
        "FICTION",
        "NON_FICTION",
        "SCIENCE",
        "HISTORY",
        "BIOGRAPHY",
        "FANTASY",
      ],
    },
    isbn: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    copies: { type: Number, required: true },
    available: { type: Boolean, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

bookSchema.statics.updateBooksAfterBorrow = function (
  id: Types.ObjectId,
  copies: number,
  quantity: number
): Promise<any> {
  const availableCopies = copies - quantity;

  return this.findByIdAndUpdate(id, {
    copies: availableCopies,
    ...(availableCopies === 0 && { available: false }),
  });
};

export const Book = model<IBook, Model<IBook> & BookStaticMethods>(
  "Book",
  bookSchema
);
