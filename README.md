Library Management System API
A comprehensive Library Management System built with Express, TypeScript, and MongoDB. This RESTful API provides complete book management functionality with borrowing capabilities and advanced querying features.

🚀 Features
Core Functionality
Book Management: Create, read, update, and delete books
Inventory Control: Track book copies and availability status
Borrowing System: Borrow books with quantity control and due date tracking
Advanced Filtering: Filter books by genre with sorting and pagination
Aggregation Analytics: Get borrowed books summary with aggregation pipeline
Technical Highlights
TypeScript: Full type safety and modern JavaScript features
MongoDB Integration: Robust data persistence with Mongoose ODM
Schema Validation: Comprehensive input validation with custom validators
Business Logic: Automatic availability control and inventory management
Middleware Support: Pre and post hooks for enhanced functionality
Error Handling: Structured error responses with detailed validation messages
📋 API Endpoints
Books
POST /api/books - Create a new book
GET /api/books - Get all books (with filtering, sorting, pagination)
GET /api/books/:bookId - Get a specific book by ID
PUT /api/books/:bookId - Update book details
DELETE /api/books/:bookId - Delete a book
Borrowing
POST /api/borrow - Borrow books with quantity control
GET /api/borrow - Get borrowed books summary (aggregation)
🔧 Technology Stack
Runtime: Node.js
Framework: Express.js 5.1.0
Language: TypeScript 5.8.3
Database: MongoDB with Mongoose 8.16.1
Validation: Zod 3.25.75
Environment: dotenv 17.0.1
📁 Project Structure
library-management-system/
├── src/
│   ├── models/
│   │   ├── Book.ts
│   │   └── Borrow.ts
│   ├── interfaces/
│   │   ├── book.interface.ts
│   │   └── borrow.interface.ts
│   ├── controllers/
│   │   ├── books.controller.ts
│   │   └── borrows.controller.ts
│   ├── app.ts
│   └── server.ts
├── package.json
├── tsconfig.json
└── README.md
🛠️ Installation & Setup
Prerequisites
Node.js (v14 or higher)
MongoDB (local installation or MongoDB Atlas)
npm or yarn package manager
Step 1: Clone the Repository
bash
git clone https://github.com/shahedul-alam/library-management-system.git
cd library-management-system
Step 2: Install Dependencies
bash
npm install
Step 3: Environment Configuration
Create a .env file in the root directory:

env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library-management
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library-management

NODE_ENV=development
Step 4: Start the Development Server
bash
npm run dev
The server will start on http://localhost:5000 (or your specified PORT).

📊 Data Models
Book Model
typescript
{
  title: string;           // Required
  author: string;          // Required
  genre: string;           // Required (FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY)
  isbn: string;            // Required, unique
  description?: string;    // Optional
  copies: number;          // Required, non-negative
  available: boolean;      // Default: true
  createdAt: Date;
  updatedAt: Date;
}
Borrow Model
typescript
{
  book: ObjectId;          // Reference to Book
  quantity: number;        // Required, positive integer
  dueDate: Date;           // Required
  createdAt: Date;
  updatedAt: Date;
}
🔍 API Usage Examples
Create a Book
bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true
  }'
Get Books with Filtering
bash
curl "http://localhost:5000/api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5"
Borrow a Book
bash
curl -X POST http://localhost:5000/api/borrow \
  -H "Content-Type: application/json" \
  -d '{
    "book": "64ab3f9e2a4b5c6d7e8f9012",
    "quantity": 2,
    "dueDate": "2025-07-18T00:00:00.000Z"
  }'
🎯 Business Logic
Inventory Management
Automatic copy deduction when books are borrowed
Availability status automatically updated when copies reach zero
Validation ensures sufficient copies before allowing borrowing
Validation Rules
Genre Restriction: Only predefined genres allowed
ISBN Uniqueness: Prevents duplicate book entries
Positive Quantities: Ensures realistic inventory numbers
Due Date Validation: Prevents past dates for borrowing
📈 Advanced Features
Aggregation Pipeline
The borrowed books summary uses MongoDB's aggregation pipeline to:

Group borrow records by book
Calculate total quantities borrowed per book
Join with book details (title, ISBN)
Return comprehensive borrowing analytics
Query Parameters
filter: Filter by genre (FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY)
sortBy: Sort by field (default: createdAt)
sort: Sort direction (asc/desc)
limit: Number of results (default: 10)
🧪 Development Scripts
bash
# Start development server with auto-reload
npm run dev

# Build TypeScript and check git status
npm run stage

# Run tests (to be implemented)
npm test
🔒 Error Handling
The API returns consistent error responses:

json
{
  "message": "Validation failed",
  "success": false,
  "error": {
    "name": "ValidationError",
    "errors": {
      "copies": {
        "message": "Copies must be a positive number",
        "name": "ValidatorError",
        "properties": {
          "message": "Copies must be a positive number",
          "type": "min",
          "min": 0
        },
        "kind": "min",
        "path": "copies",
        "value": -5
      }
    }
  }
}
🤝 Contributing
Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

🆘 Support
For questions or issues, please open an issue in the repository or contact the development team.

Built with ❤️ using Express, TypeScript, and MongoDB

