# Mantouji.ma - Regional Product Marketplace

A full-stack web platform connecting regional product producers with consumers, featuring AI services, interactive maps, and comprehensive dashboards.

## 🚀 Features

### Core Functionality
- **User Authentication & Roles**: Secure JWT-based authentication with Producer, Consumer, and Admin roles
- **Product Management**: Complete CRUD operations for products with image upload
- **Role-Based Access Control**: Different interfaces and features based on user role
- **Reviews & Ratings**: Product review system with moderation capabilities
- **Favorites & Search**: User favorites and search history tracking
- **Interactive Dashboards**: Role-specific analytics and management tools

### Technical Features
- **Responsive Design**: Mobile-first design with TailwindCSS
- **Dark Mode**: Complete dark/light theme support
- **Real-time Analytics**: Product views, favorites, and sales tracking
- **Search & Filtering**: Advanced product search with multiple filters
- **Pagination**: Efficient data loading with pagination
- **API Documentation**: Comprehensive REST API endpoints

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Lucide React** for icons

### Backend
- **Flask** with Python 3.12
- **SQLAlchemy** ORM
- **Flask-JWT-Extended** for authentication
- **Flask-CORS** for cross-origin requests
- **PostgreSQL** database (with in-memory fallback for development)

### Development Tools
- **ESLint** for code linting
- **Prettier** for code formatting
- **Git** for version control

## 📋 Prerequisites

- **Node.js** 16+ and npm
- **Python** 3.12+
- **PostgreSQL** 12+ (optional, uses in-memory for development)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd mantouji_cursor
```

### 2. Backend Setup
```bash
cd backend

# Install Python dependencies
pip3 install -r requirements.txt

# Run the backend server
python3 simple_app.py
```

The backend will be available at `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will be available at `http://localhost:3000`

### 4. Using the Start Script
```bash
# Make the start script executable
chmod +x start.sh

# Run both backend and frontend
./start.sh
```

## 📁 Project Structure

```
mantouji_cursor/
├── backend/                 # Flask backend
│   ├── app/                # Main application package
│   │   ├── blueprints/     # API blueprints
│   │   ├── models/         # Database models
│   │   └── utils/          # Utility functions
│   ├── simple_app.py       # Development server
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   └── package.json        # Node dependencies
├── database/               # Database schema and migrations
├── docs/                   # Documentation
└── tests/                  # Test files
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products with filtering
- `GET /api/products/{id}` - Get product details
- `POST /api/products` - Create product (Producer only)
- `PUT /api/products/{id}` - Update product (Producer only)
- `DELETE /api/products/{id}` - Delete product (Producer only)

### Reviews
- `GET /api/products/{id}/reviews` - Get product reviews
- `POST /api/products/{id}/reviews` - Add review (Consumer only)
- `PUT /api/reviews/{id}` - Update review
- `DELETE /api/reviews/{id}` - Delete review

### Analytics
- `GET /api/analytics/producer/{id}/stats` - Producer dashboard stats
- `GET /api/analytics/admin/overview` - Admin overview stats

## 👥 User Roles

### Consumer
- Browse and search products
- View product details
- Add products to cart
- Leave reviews and ratings
- Manage favorites
- View personal dashboard

### Producer
- Manage their products
- View analytics dashboard
- Track product performance
- Manage inventory
- View customer insights

### Admin
- Manage all users and products
- Access moderation tools
- View platform analytics
- Manage content and reviews

## 🎨 UI/UX Features

- **Responsive Design**: Works on all device sizes
- **Dark Mode**: Toggle between light and dark themes
- **Role-Based Navigation**: Different menus based on user role
- **Interactive Components**: Smooth animations and transitions
- **Accessibility**: WCAG compliant design

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Frontend and backend validation
- **Input Validation**: Comprehensive data validation
- **CORS Protection**: Configured for production use
- **Environment Variables**: Secure configuration management

## 🚀 Deployment

### Backend Deployment
```bash
# Install production dependencies
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 simple_app:app
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Serve with a web server (nginx, Apache, etc.)
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
python3 -m pytest tests/
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📊 Development Status

- ✅ Project structure and environment setup
- ✅ Database schema and PostgreSQL setup
- ✅ Flask backend with Blueprints
- ✅ User authentication system (JWT)
- ✅ User management API endpoints
- ✅ Product management API endpoints
- ✅ React frontend foundation
- ✅ Authentication UI components
- ✅ Product listing and search functionality
- ✅ Product detail and management UI
- ✅ Reviews and ratings system
- ✅ Favorites and search tracking
- ✅ Producer dashboard - basic stats
- ✅ Admin dashboard - moderation tools
- ✅ Security implementation
- ✅ Test data generation
- ✅ UI/UX polish and dark mode

## 🔄 Pending Features

- AI prediction system (ML model)
- OpenAI integration for insights
- Heatmap visualization (Leaflet.js)
- Chart.js integration for dashboards
- API documentation (Swagger)
- Performance optimization
- Deployment configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@mantouji.ma or create an issue in the repository.

---

**Mantouji.ma** - Connecting regional producers with consumers through technology.