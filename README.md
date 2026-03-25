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
- MongoDB (local or cloud instance) - **For deployment, use MongoDB Atlas**
- OpenAI API Key (for AI features)

### Database Setup (MongoDB Atlas for Production)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account.
2. Create a new cluster (free tier).
3. In "Network Access", allow access from anywhere (0.0.0.0/0) for Render.
4. In "Database Access", create a user with read/write permissions.
5. Get the connection string from "Connect" > "Connect your application".
6. Replace `<username>`, `<password>`, and `<cluster>` in the URI.

Example URI: `mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/shopcon?retryWrites=true&w=majority`

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

## Deployment

### Backend (Render)
1. Create a Render account at [render.com](https://render.com).
2. Create a new "Web Service" and connect your GitHub repo `YashHelge/ShopCon`.
3. Set build settings:
   - **Root Directory**: `Backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Set environment variables:
   - `PORT`: `5000`
   - `MONGO_URI`: Your MongoDB Atlas URI
   - `JWT_SECRET`: A secure random string
   - `OPENAI_API_KEY`: Your OpenAI API key
5. Deploy. Your backend will be at `https://your-service.onrender.com`.

### Frontend (Netlify/Vercel)
1. Go to [netlify.com](https://netlify.com) or [vercel.com](https://vercel.com).
2. Connect your GitHub repo.
3. Set build settings:
   - **Build Command**: (leave empty for static)
   - **Publish Directory**: `Frontend`
4. Set environment variable (if needed):
   - `API_URL`: `https://your-backend.onrender.com/api`
5. Deploy. Your frontend will be at `https://your-site.netlify.app`.

### Update Frontend API URL
In production, update `Frontend/app.js`:
```js
const API = 'https://your-backend.onrender.com/api';
```

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