# SCRMS_CUSTOMER_FE

A React project using TypeScript, Tailwind CSS, and Redux Toolkit.

## 🚀 Features
- User authentication with Redux Toolkit
- Responsive UI with Tailwind CSS
- Role-based access control
- REST API integration with ASP.NET backend

## 🛠️ Setup & Installation
1. Clone this repository:
   git clone https://github.com/your-repo.git
   cd SCRMS_CUSTOMER_FE

2. Install dependencies:
    npm install

3. Start the development server:
    npm run dev

4. Open in browser: 
    Default: http://localhost:5173 (Vite default port)

📁 Project Structure

    SCRMS_CUSTOMER_FE/
    │── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Page components
    │   ├── store/       # Redux state management
    │   ├── assets/      # Static assets (images, icons, etc.)
    │   ├── hooks/       # Custom React hooks
    │   ├── utils/       # Helper functions
    │   ├── App.tsx      # Main application component
    │── public/          # Public assets (index.html, favicon, etc.)
    │── .gitignore       # Git ignore file
    │── vite.config.ts   # Vite configuration
    │── package.json     # Dependencies & scripts
    │── README.md        # Project documentation

⚙️ Environment Variables
    Create a .env file in the root folder and add:
    VITE_API_BASE_URL=https://api.example.com
    VITE_APP_NAME=SCRMS

🛠️ Build & Deploy
    To build for production:
    npm run build