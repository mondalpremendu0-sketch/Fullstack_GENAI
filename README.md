# 🤖 PrepGenius - AI Interview Preparation Platform

A full-stack web application that leverages generative AI to conduct and evaluate personalized interview preparation. Built with React 19 on the frontend and Node.js/Express on the backend, deployed on Vercel.

**Live Demo:** [https://fullstack-genai.vercel.app/](https://fullstack-genai.vercel.app/)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Key Components](#-key-components)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Development](#-development)
- [Building for Production](#-building-for-production)
- [Environment Variables](#environment-variables)
- [API Documentation](#-api-documentation)
- [Security Features](#-security-features)
- [Contributing](#-contributing)
- [License](#-license)
- [Support & Troubleshooting](#-support--troubleshooting)

---

## ✨ Features

- **🎯 AI-Powered Interview Prep** - Personalized interview strategy generation using Google's Generative AI
- **📊 Smart Matching** - Analyzes resume and job description to provide match scores
- **💡 Personalized Questions** - Generates tailored technical and behavioral questions
- **📈 Interview Reports** - Comprehensive PDF reports with personalized roadmaps and recommendations
- **🔐 Secure Authentication** - JWT-based authentication with Google OAuth 2.0 support
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **✨ Smooth Animations** - Modern UI with Framer Motion animations and interactive 3D elements
- **📝 Resume Analysis** - Extracts and analyzes PDF resume content
- **💾 Report History** - Access previous interview reports and analysis
- **⚡ Real-time Performance** - Optimized with caching and rate limiting
- **🎨 Professional UI** - Modern design with gradient accents and glass morphism effects

---

## 🛠️ Tech Stack

### Frontend (React 19 + Vite)
- **Framework**: React 19.2.5
- **Build Tool**: Vite 8.0.10
- **Styling**: SCSS/Sass 1.99.0 (46.2% HTML, 40.6% JavaScript, 12.1% SCSS, 1.1% CSS)
- **3D Graphics**: Three.js 0.184.0, React Three Fiber 9.6.1, React Three Drei 10.7.7
- **Routing**: React Router 7.15.0
- **State Management**: React Context API
- **Form Handling**: React Hook Form 7.75.0, Zod validation
- **Animations**: Framer Motion 12.38.0, Lottie (dotlottie-react 0.19.4)
- **PDF Generation**: @react-pdf/renderer 4.5.1, html2pdf.js 0.14.0
- **HTTP Client**: Axios 1.16.0
- **Notifications**: React Toastify 11.1.0
- **Linting**: ESLint 10.2.1

### Backend (Node.js + Express)
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose 9.4.1
- **AI Integration**: Google Generative AI SDK 2.4.0
- **Authentication**: 
  - JWT (jsonwebtoken 9.0.3)
  - Passport Google OAuth 2.0 (passport-google-oauth20 2.0.0)
- **Security**:
  - Helmet 8.2.0 (HTTP security headers)
  - Express Rate Limiting 8.5.2
  - Express Mongo Sanitize 2.2.0
  - CORS 2.8.6
  - Compression 1.8.1
- **Password Hashing**: bcryptjs 3.0.3
- **Data Validation**: Zod 4.4.3
- **File Processing**: Multer 2.1.1, pdf-parse 2.4.5
- **Caching**: node-cache 5.1.2
- **Logging**: Morgan 1.10.1
- **Testing**: Jest 30.4.2, Supertest 7.2.2

---

## 📁 Project Structure

```
Fullstack_GENAI/
│
├── 📁 frontend/                           # React frontend application
│   ├── 📁 src/
│   │   ├── 📁 features/
│   │   │   ├── 📁 Interview/              # Interview feature module
│   │   │   │   ├── 📁 components/         # Interview components
│   │   │   │   │   ├── ErrorModal.jsx     # Error modal display
│   │   │   │   │   ├── Loading.jsx        # Loading animation component
│   │   │   │   │   ├── PreviousReports.jsx # User's previous interview reports
│   │   │   │   │   ├── ResumePdf.jsx      # PDF resume component
│   │   │   │   │   └── UserProfile.jsx    # User profile display in navbar
│   │   │   │   ├── 📁 pages/
│   │   │   │   │   ├── Home.jsx           # Main interview prep page
│   │   │   │   │   ├── interview.jsx      # Interview report page
│   │   │   │   │   └── NotFound.jsx       # 404 page
│   │   │   │   ├── 📁 styles/             # SCSS stylesheets
│   │   │   │   │   ├── Homepage.scss      # Home page styles
│   │   │   │   │   ├── interview.scss     # Interview page styles
│   │   │   │   │   ├── ErrorModal.scss    # Error modal styles
│   │   │   │   │   ├── Loading.scss       # Loading component styles
│   │   │   │   │   ├── PreviousReports.scss # Reports section styles
│   │   │   │   │   ├── UserProfile.scss   # User profile styles
│   │   │   │   │   └── NotFound.scss      # 404 page styles
│   │   │   │   ├── 📁 hooks/
│   │   │   │   │   └── useInterviewContext.js # Interview context hook
│   │   │   │   ├── 📁 services/           # API service calls
│   │   │   │   └── interView.context.jsx  # Interview context provider
│   │   │   │
│   │   │   └── 📁 auth/                   # Authentication feature module
│   │   │       ├── 📁 components/
│   │   │       │   ├── GoogleSignInButton.jsx # Google OAuth button
│   │   │       │   ├── InfiniteLoader.jsx  # Loading animation
│   │   │       │   ├── Logout.jsx         # Logout button component
│   │   │       │   └── Protected.jsx      # Route protection component
│   │   │       ├── 📁 pages/
│   │   │       │   ├── Login.jsx          # Login page
│   │   │       │   ├── Login.scss         # Login styles
│   │   │       │   ├── Register.jsx       # Registration page
│   │   │       │   └── Register.scss      # Register styles
│   │   │       └── auth.context.jsx       # Auth context provider
│   │   │
│   │   ├── App.jsx                        # Main App component with providers
│   │   ├── app.routes.jsx                 # Route definitions (React Router v7)
│   │   ├── Index.css                      # Global styles
│   │   └── main.jsx                       # React entry point
│   │
│   ├── 📄 index.html                      # HTML template
│   ├── 📄 package.json                    # Frontend dependencies
│   ├── 📄 package-lock.json               # Dependency lock file
│   ├── 📄 vite.config.js                  # Vite configuration
│   ├── 📄 vercel.json                     # Vercel deployment config
│   ├── 📄 eslint.config.js                # ESLint configuration
│   ├── 📄 .gitignore                      # Git ignore rules
│   └── 📄 README.md                       # Frontend-specific documentation
│
├── 📁 backend/                            # Node.js/Express backend
│   ├── 📁 src/
│   │   ├── 📁 __test__/                   # Test files
│   │   ├── 📁 config/                     # Configuration files
│   │   ├── 📁 controllers/                # Route handlers
│   │   │   ├── auth.controller.js         # Authentication logic
│   │   │   ├── googleAuth.controller.js   # Google OAuth handler
│   │   │   └── interView.controller.js    # Interview generation logic
│   │   ├── 📁 db/                         # Database connection
│   │   ├── 📁 middleware/                 # Custom middleware
│   │   ├── 📁 model/                      # MongoDB schemas
│   │   │   ├── auth.model.js              # User schema
│   │   │   ├── blacklist.model.js         # Token blacklist schema
│   │   │   └── interViewReport.model.js   # Interview report schema
│   │   ├── 📁 routes/                     # API endpoints
│   │   │   ├── auth.routes.js             # Authentication endpoints
│   │   │   ├── googleAuth.routes.js       # Google OAuth endpoints
│   │   │   └── ai.routes.js               # AI interview endpoints
│   │   ├── 📁 services/                   # Business logic
│   │   │   └── ai.service.js              # AI/Interview service
│   │   ├── 📁 utils/                      # Utility functions
│   │   └── app.js                         # Express app setup
│   │
│   ├── 📄 server.js                       # Server entry point
│   ├── 📄 package.json                    # Backend dependencies
│   ├── 📄 package-lock.json               # Dependency lock file
│   ├── 📄 .env.example                    # Environment template
│   ├── 📄 .gitignore                      # Git ignore rules
│   ├── 📁 coverage/                       # Test coverage reports
│   └── 📄 jest.config.js                  # Jest testing configuration
│
├── 📄 README.md                           # This file
└── 📄 .gitignore                          # Root .gitignore
```

---

## 🔑 Key Components

### Frontend

#### Pages
- **Home.jsx** - Main landing page with interview prep form submission
- **interview.jsx** - Interview report display with analysis and roadmap
- **Login.jsx** - User authentication page
- **Register.jsx** - User registration page
- **NotFound.jsx** - 404 error page

#### Components
- **ErrorModal** - Displays AI generation errors
- **Loading** - Loading animation with Framer Motion
- **PreviousReports** - Lists user's past interview reports
- **ResumePdf** - PDF resume renderer
- **UserProfile** - User info in navigation bar
- **GoogleSignInButton** - OAuth login button
- **Protected** - Route guard component

### Backend

#### Routes
- `/api/auth/*` - User authentication endpoints
- `/api/auth/google/*` - Google OAuth endpoints
- `/api/ai/*` - AI interview generation endpoints

#### Controllers
- **auth.controller.js** - Handles login, register, logout
- **googleAuth.controller.js** - Google OAuth callback handler
- **interView.controller.js** - Interview report generation

#### Models
- **User** (auth.model.js) - User account information
- **InterviewReport** - Generated interview reports
- **TokenBlacklist** - Revoked JWT tokens

#### Services
- **ai.service.js** - Google Generative AI integration and interview logic

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** or **yarn** package manager
- **MongoDB** instance (local or MongoDB Atlas)
- **Google Generative AI API key** (from Google AI Studio)
- **Google OAuth 2.0 credentials** (from Google Cloud Console)

### Environment Variables

#### Backend Setup
Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/prepgenius
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prepgenius

# AI Integration
GOOGLE_GENAI_API_KEY=your_google_genai_api_key_here

# Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# CORS & Security
FRONTEND_URL=http://localhost:5173
```

#### Frontend Setup
The frontend connects to the backend via Axios. Update the API base URL if needed in your environment configuration.

---

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/mondalpremendu0-sketch/Fullstack_GENAI.git
cd Fullstack_GENAI
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies
```bash
cd ../backend
npm install
```

### 4. Set Up Environment Variables
```bash
# Create .env in backend directory
cp .env.example .env
# Edit .env with your credentials
```

---

## 💻 Development

### Running Frontend (Terminal 1)
```bash
cd frontend
npm run dev
```
Frontend available at: `http://localhost:5173`

### Running Backend (Terminal 2)
```bash
cd backend
npm run dev
```
Backend server running on: `http://localhost:5000` (default)

### Running Tests
```bash
cd backend
npm test
```

### ESLint Check
```bash
cd frontend
npm run lint
```

---

## 🔨 Building for Production

### Build Frontend
```bash
cd frontend
npm run build
```
Creates optimized production build in `dist/` directory

### Preview Production Build
```bash
cd frontend
npm run preview
```

### Backend Production
```bash
cd backend
npm start
```

---

## 🌐 Deployment

### Frontend (Vercel)
The frontend is configured for automatic Vercel deployment:

```bash
cd frontend
npm run build
vercel deploy
```

Or connect your GitHub repository to Vercel for automatic deployments on push.

### Backend Deployment
Deploy to services like:
- **Heroku** - `git push heroku main`
- **Railway** - Connect GitHub repository
- **Render** - Connect GitHub repository
- **Vercel** - Serverless functions (requires conversion to serverless functions)

---

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout (invalidate token)
- `POST /api/auth/google/auth` - Google OAuth authentication
- `GET /api/auth/google/callback` - Google OAuth callback

### Interview Endpoints
- `POST /api/ai/generate-interview` - Generate interview report
- `GET /api/ai/report/:id` - Fetch specific interview report
- `GET /api/ai/reports` - List all user reports
- `DELETE /api/ai/report/:id` - Delete interview report

### Request/Response Examples

#### Generate Interview Report
```bash
curl -X POST http://localhost:5000/api/ai/generate-interview \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "jobDescription=@job.txt" \
  -F "selfDescription=Brief background" \
  -F "resume=@resume.pdf"
```

**Response:**
```json
{
  "_id": "report_id",
  "userId": "user_id",
  "matchScore": 75,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "questions": ["..."],
  "roadmap": ["..."],
  "createdAt": "2024-01-20T10:30:00Z"
}
```

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication with expiration
- **Token Blacklist** - Logout invalidates tokens immediately
- **Google OAuth 2.0** - Secure social login integration
- **Rate Limiting** - Prevents brute force attacks
- **CORS Protection** - Whitelist allowed origins
- **Helmet.js** - Sets HTTP security headers
- **MongoDB Injection Prevention** - Data sanitization
- **Password Hashing** - bcryptjs with salt rounds
- **Data Validation** - Zod schema validation for all inputs
- **Environment Secrets** - Sensitive data in .env files only

---

## 🎯 User Flow

1. **Registration/Login** - User creates account or logs in with email or Google OAuth
2. **Home Page** - User enters job description, background, and uploads resume (PDF)
3. **AI Processing** - Backend processes documents and generates AI analysis
4. **Report Display** - User views personalized interview report with:
   - Match score comparison
   - Key strengths to highlight
   - Areas for improvement
   - Technical and behavioral questions
   - Day-by-day preparation roadmap
5. **Report History** - Access previous reports anytime

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is open source and available under the **ISC License**.

---

## 📞 Support & Troubleshooting

### Common Issues

**MongoDB Connection Failed**
```bash
# Check if MongoDB is running
# For local: mongod
# For Atlas: Verify connection string in .env
```

**Port Already in Use**
```bash
# Change port in .env
PORT=5001
```

**Google OAuth Redirect URI Mismatch**
- Update callback URL in Google Cloud Console to match deployment URL
- Ensure GOOGLE_CALLBACK_URL in .env matches OAuth config

### Getting Help
- Open an issue on GitHub
- Check existing issues for solutions
- Review inline code comments and documentation
- Check backend logs for API errors

---

## 🎓 Learning Resources

- [React 19 Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Google Generative AI Docs](https://ai.google.dev/docs)
- [Framer Motion Tutorial](https://www.framer.com/motion)

---

## 🚀 Future Enhancements

- [ ] Video interview simulation with webcam
- [ ] AI feedback on user-submitted answers
- [ ] Interview scheduling with reminders
- [ ] Progress tracking and analytics
- [ ] Competitive benchmarking against other candidates
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration features
- [ ] Advanced filtering and report search

---

**Built with ❤️ by Mondalpremendu0-sketch**

**Repository**: [mondalpremendu0-sketch/Fullstack_GENAI](https://github.com/mondalpremendu0-sketch/Fullstack_GENAI)

**Live Application**: [https://fullstack-genai.vercel.app/](https://fullstack-genai.vercel.app/)
