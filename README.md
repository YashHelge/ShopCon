# ShopCon - E-Commerce Shopping Application

A full-stack e-commerce application built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

- 🛒 **Product Catalog**: Browse and search products by category or name
- 🔍 **AI-Powered Image Search**: Capture or upload product images to find similar items
- 💬 **AI Shopping Assistant**: Chat with an AI for product recommendations and help
- 🛍️ **Shopping Cart**: Add items to cart with quantity management
- 👤 **User Authentication**: Register and login to place orders
- 📦 **Order Management**: View order history
- ➕ **Admin Product Addition**: Add new products to the catalog

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- OpenAI API (for AI features)
- Multer (for file uploads)

### Frontend
- Vanilla JavaScript
- HTML5
- CSS3
- Responsive design

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- OpenAI API Key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YashHelge/ShopCon.git
   cd ShopCon
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```

3. **Environment Configuration**
   - Copy `.env` file and update:
     ```
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/shopcon
     JWT_SECRET=your_jwt_secret_here
     OPENAI_API_KEY=your_openai_api_key_here
     ```

4. **Frontend Setup**
   ```bash
   cd ../Frontend
   # No installation needed for vanilla JS
   ```

### Running the Application

1. **Start MongoDB** (if using local instance)

2. **Start Backend**
   ```bash
   cd Backend
   npm start
   # or
   node server.js
   ```

3. **Start Frontend**
   ```bash
   cd Frontend
   npx serve .
   # or open index.html in browser (may have CORS issues)
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products (with search/filter)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Add new product
- `POST /api/products/seed` - Seed sample products
- `POST /api/products/search-image` - AI image search

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Place order (authenticated)
- `GET /api/orders/myorders` - Get user orders (authenticated)

### AI
- `POST /api/ai/chat` - AI chat assistant

## Usage

1. **Browse Products**: Visit the products page to see available items
2. **Search**: Use the search bar or category filters
3. **Image Search**: Click "📷 Image Search" to find products by image
4. **Add to Cart**: Click "Add to Cart" on any product
5. **Checkout**: Login/register, then place your order
6. **AI Chat**: Click "💬 AI" for shopping assistance
7. **Add Products**: Use "➕ Add Product" to expand the catalog

## Project Structure

```
ShopCon/
├── Backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── cart.js
│   │   └── ai.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/          # For image uploads
│   ├── server.js
│   ├── package.json
│   └── .env
├── Frontend/
│   ├── index.html
│   ├── app.js
│   ├── style.css
│   └── (served via npx serve)
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues or questions, please open an issue on GitHub or contact the maintainers.