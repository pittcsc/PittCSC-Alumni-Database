:P
# Pitt CSC Alumni Network

## Tech Stack

### Backend
- **FastAPI**
- **SQLModel**
- **SQLite**
- **JWT Authentication**
- **SMTP Email**

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Lucide React** - Beautiful, customizable icons
- **Axios** - HTTP client for API calls

## Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **npm or yarn**

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Alumni
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables (optional)
# Copy and modify the example env file if needed
# The app will work with default settings

# Initialize the database and run the server
python -m uvicorn app.main:app --reload
```

The backend will be running at `http://localhost:8000`
- API documentation: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

### 3. Frontend Setup

Open a new terminal window/tab:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be running at `http://localhost:5173`

### 4. Access the Application

1. Open your browser and go to `http://localhost:5173`
2. You'll see the modern Pitt CSC Alumni Network homepage
3. Create an account or browse the alumni directory
4. The app will automatically connect to the backend API

## Development Commands

### Backend Commands

```bash
cd backend

# Start development server with auto-reload
python -m uvicorn app.main:app --reload

# Run with custom host/port
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Reset database (if needed)
python drop.py
```

### Frontend Commands

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Update browserslist database
npx update-browserslist-db@latest
```

## Environment Variables

### Backend (.env in root directory)
```env
# Database
SQLITE_DB=sqlite:///./alumni.db

# Security
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=43200

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAILS_FROM_EMAIL=noreply@pittcsc.org
EMAILS_FROM_NAME=Pitt CSC Alumni Network

# Admin User (optional)
FIRST_SUPERUSER=admin@pittcsc.org
FIRST_SUPERUSER_PASSWORD=admin
FIRST_SUPERUSER_NAME=Admin User
```

### Frontend (.env in frontend directory)
```env
# API Configuration
VITE_API_URL=http://localhost:8000/api/v1

# App Configuration
VITE_APP_NAME=Pitt CSC Alumni Network
VITE_ENV=development
```

## Project Structure

```
Alumni/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Configuration and security
│   │   ├── email_templates/ # Email templates
│   │   └── models.py       # Database models
│   ├── requirements.txt    # Python dependencies
│   └── drop.py            # Database reset script
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── alumni/    # Alumni-specific components
│   │   │   ├── home/      # Homepage components
│   │   │   ├── layout/    # Layout components
│   │   │   └── ui/        # UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # State management
│   │   └── types/         # TypeScript types
│   ├── package.json       # Node dependencies
│   └── tailwind.config.js # Tailwind configuration
└── README.md              # This file
```

## API Endpoints

The backend provides a comprehensive REST API. Key endpoints include:

### Authentication
- `POST /api/v1/login/access-token` - User login
- `POST /api/v1/users/signup` - User registration
- `GET /api/v1/users/me` - Get current user

### Users/Alumni
- `GET /api/v1/users/` - Get all users (paginated)
- `GET /api/v1/users/{user_id}` - Get user by ID
- `PATCH /api/v1/users/me` - Update current user profile

### Companies
- `GET /api/v1/companies/` - Get all companies
- `GET /api/v1/companies/{name}` - Get company details

### Connections
- `GET /api/v1/requests/` - Get connection requests
- `POST /api/v1/requests/` - Create connection request

Visit `http://localhost:8000/docs` for complete API documentation.

## Design System

The frontend uses a modern design system based on Pitt CSC branding:

- **Colors**: Pitt Navy (#003594), Pitt Gold (#FFB81C), and semantic colors
- **Typography**: Inter for body text, Lexend for headings
- **Components**: Consistent, accessible UI components
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design approach

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in the run commands if 8000 or 5173 are in use
2. **Database issues**: Run `python drop.py` in the backend to reset the database
3. **Package issues**: Delete `node_modules` and run `npm install` again
4. **CORS errors**: Ensure the backend CORS settings include your frontend URL

### Getting Help

- Check the API documentation at `http://localhost:8000/docs`
- Review the console for error messages
- Ensure both backend and frontend are running
- Verify environment variables are set correctly

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions about the Pitt CSC Alumni Network, contact:
- **Pitt CSC**: [https://pittcsc.org](https://pittcsc.org)
- **Email**: alumni@pittcsc.org

---

Built with ❤️ by the Pitt Computer Science Club