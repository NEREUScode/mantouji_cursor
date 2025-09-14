# Mantouji.ma - Regional Product Platform

A responsive web platform that connects regional product producers with consumers across Morocco.

## 🚀 Features

- **Authentication & Roles**: Secure JWT-based authentication with producer, consumer, and admin roles
- **Product Management**: Full CRUD operations for products with image uploads
- **Search & Discovery**: Advanced search and filtering capabilities
- **Reviews & Ratings**: Community-driven product reviews and ratings
- **AI-Powered Insights**: ML predictions and OpenAI integration for smart recommendations
- **Interactive Heatmaps**: Regional data visualization using Leaflet.js
- **Analytics Dashboards**: Comprehensive analytics for producers and admins
- **Responsive Design**: Modern UI with dark mode support

## 🛠 Tech Stack

### Frontend

- **React 19** with TypeScript
- **TailwindCSS** for styling
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Leaflet.js** for maps
- **Chart.js** for analytics
- **Lucide React** for icons

### Backend

- **Flask** with Python
- **PostgreSQL** database
- **JWT** authentication
- **SQLAlchemy** ORM
- **Flask-Migrate** for database migrations

### AI & ML

- **OpenAI API** for natural language processing
- **Scikit-learn** for machine learning models
- **Pandas** for data processing

## 📁 Project Structure

```
mantouji_cursor/
├── backend/                 # Flask API
│   ├── app/
│   │   ├── blueprints/     # API routes
│   │   ├── models/         # Database models
│   │   ├── utils/          # Utility functions
│   │   └── services/       # Business logic
│   ├── config.py           # Configuration
│   └── requirements.txt    # Python dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   └── package.json        # Node dependencies
├── database/               # Database files
│   └── schema.sql          # Database schema
├── ai/                     # AI/ML models
├── docs/                   # Documentation
└── tests/                  # Test files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- PostgreSQL 12+
- Git

### Backend Setup

1. **Navigate to backend directory**:

   ```bash
   cd backend
   ```

2. **Create virtual environment**:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and API keys
   ```

5. **Set up database**:

   ```bash
   # Create PostgreSQL database
   createdb mantouji_db

   # Run migrations
   flask db upgrade
   ```

6. **Run the backend**:
   ```bash
   python app.py
   ```

### Frontend Setup

1. **Navigate to frontend directory**:

   ```bash
   cd frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   ```bash
   # Create .env.local file
   echo "REACT_APP_API_URL=http://localhost:5000/api" > .env.local
   ```

4. **Run the frontend**:
   ```bash
   npm start
   ```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)

```env
DATABASE_URL=postgresql://username:password@localhost:5432/mantouji_db
JWT_SECRET_KEY=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key
FLASK_ENV=development
SECRET_KEY=your-flask-secret-key
```

#### Frontend (.env.local)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_MAPBOX_TOKEN=your_mapbox_token
```

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

- **users**: User accounts and profiles
- **products**: Product listings
- **reviews**: Product reviews and ratings
- **favorites**: User favorite products
- **orders**: Order management
- **ai_predictions**: ML model predictions
- **moderation_logs**: Admin moderation actions

## 🧪 Testing

### Backend Tests

```bash
cd backend
python -m pytest tests/
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment

1. Set up production environment variables
2. Configure PostgreSQL database
3. Run database migrations
4. Deploy using Gunicorn or similar WSGI server

### Frontend Deployment

1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy the `build` folder to your hosting service

## 📝 API Documentation

The API follows RESTful conventions:

- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact:

- Email: info@mantouji.ma
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Payment integration
- [ ] Advanced AI features
- [ ] Multi-language support
- [ ] Real-time notifications
