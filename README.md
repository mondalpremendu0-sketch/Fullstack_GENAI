# 🤖 Fullstack GENAI - Interview AI Platform

A full-stack web application that leverages generative AI to conduct and evaluate AI-powered interviews. Built with modern web technologies and deployed on Vercel.

**Live Demo:** [https://fullstack-genai.vercel.app](https://premendu.indevs.in/)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **AI-Powered Interviews** - Conduct interactive interviews using Google's Generative AI
- **React 19 Frontend** - Modern, responsive UI built with React 19 and Vite
- **3D Visualizations** - Interactive 3D elements using Three.js and React Three Fiber
- **PDF Generation** - Generate interview reports and documents as PDFs
- **Authentication** - Secure authentication with JWT and Google OAuth 2.0
- **Real-time Notifications** - Toast notifications with react-toastify
- **Advanced Styling** - SCSS/CSS styling with Sass preprocessing
- **API Security** - Rate limiting, CORS protection, helmet security headers
- **Form Validation** - Robust form handling with React Hook Form and Zod validation
- **Animations** - Smooth animations with Framer Motion and Lottie

## 🛠️ Tech Stack

### Frontend (46.2% HTML, 40.6% JavaScript, 12.1% SCSS, 1.1% CSS)
- **Framework**: React 19.2.5
- **Build Tool**: Vite 8.0.10
- **Styling**: SCSS/Sass 1.99.0, CSS
- **3D Graphics**: Three.js 0.184.0, React Three Fiber 9.6.1, React Three Drei 10.7.7
- **State & Routing**: React Router 7.15.0
- **Form Handling**: React Hook Form 7.75.0
- **Animations**: Framer Motion 12.38.0, Lottie (dotlottie-react)
- **PDF Generation**: react-pdf, html2pdf.js
- **HTTP Client**: Axios 1.16.0
- **Notifications**: React Toastify 11.1.0
- **Linting**: ESLint 10.2.1

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB (with Mongoose 9.4.1)
- **AI Integration**: Google Generative AI 2.4.0
- **Authentication**: JWT (jsonwebtoken 9.0.3), Google OAuth 2.0 (passport-google-oauth20)
- **Security**: 
  - Helmet 8.2.0 (security headers)
  - Express Rate Limiting 8.5.2
  - Express Mongo Sanitize 2.2.0
  - CORS 2.8.6
  - Compression 1.8.1
- **Password Hashing**: bcryptjs 3.0.3
- **Data Validation**: Zod 4.4.3, zod-to-json-schema
- **Logging**: Morgan 1.10.1
- **File Upload**: Multer 2.1.1
- **PDF Processing**: pdf-parse 2.4.5
- **Caching**: node-cache 5.1.2
- **Testing**: Jest 30.4.2, Supertest 7.2.2

## 📁 Project Structure

```
Fullstack_GENAI/
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── styles/          # SCSS/CSS files
│   │   ├── App.jsx          # Main App component
│   │   └── main.jsx         # Entry point
│   ├── index.html           # HTML template
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.js       # Vite configuration
│   ├── vercel.json          # Vercel deployment config
│   └── eslint.config.js     # ESLint configuration
│
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Custom middleware
│   │   └── utils/           # Utility functions
│   ├── server.js            # Entry point
│   ├── package.json         # Backend dependencies
│   ├── .env.example         # Environment variables template
│   └── coverage/            # Test coverage reports
│
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- MongoDB instance (local or cloud)
- Google Generative AI API key

### Environment Variables

#### Backend Setup
Create a `.env` file in the `backend/` directory based on `.env.example`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
NODE_ENV=development
```

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

## 💻 Development

### Running the Frontend
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:5173` (Vite default)

### Running the Backend
```bash
cd backend
npm run dev
```
The backend server will run on the port specified in your `.env` file (default: 5000)

### Running Tests
```bash
cd backend
npm test
```

### Linting
```bash
cd frontend
npm run lint
```

## 🔨 Building for Production

### Build Frontend
```bash
cd frontend
npm run build
```
This creates an optimized production build in the `dist/` directory.

### Preview Production Build
```bash
cd frontend
npm run preview
```

### Backend Production
The backend runs directly with Node.js:
```bash
cd backend
npm start
```

## 🌐 Deployment

### Frontend Deployment (Vercel)
The frontend is configured for Vercel deployment:
```bash
cd frontend
npm run build
# Deploy to Vercel
vercel deploy
```

Or push to GitHub and connect your repository to Vercel for automatic deployments.

## 📚 API Documentation

The backend provides RESTful API endpoints for:
- User authentication and authorization
- Interview management
- AI-powered interview generation and evaluation
- PDF report generation
- User profile management

For detailed API documentation, refer to the backend route files in `backend/src/routes/`

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Google OAuth 2.0** - Social login integration
- **Rate Limiting** - Protection against brute force attacks
- **CORS** - Cross-Origin Resource Sharing protection
- **Helmet.js** - HTTP security headers
- **Data Sanitization** - MongoDB injection prevention
- **Password Hashing** - bcryptjs for secure password storage
- **Data Validation** - Zod schema validation

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the ISC License.

## 📞 Support

For questions or issues, please:
- Open an issue on GitHub
- Check existing documentation
- Review the code comments and inline documentation

---

**Built with ❤️ by the development team**

**Repository**: [mondalpremendu0-sketch/Fullstack_GENAI](https://github.com/mondalpremendu0-sketch/Fullstack_GENAI)
