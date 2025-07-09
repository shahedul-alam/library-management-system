"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
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
}, {
    versionKey: false,
    timestamps: true,
});
bookSchema.statics.updateBooksAfterBorrow = function (id, copies, quantity) {
    const availableCopies = copies - quantity;
    return this.findByIdAndUpdate(id, Object.assign({ copies: availableCopies }, (availableCopies === 0 && { available: false })));
};
exports.Book = (0, mongoose_1.model)("Book", bookSchema);
