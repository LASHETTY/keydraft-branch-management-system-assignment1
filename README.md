# Branch Management System

A comprehensive branch management interface that allows users to manage branch data with features like CRUD operations, data import/export, and various viewing options.

## 🌟 Live Demo
[View Live Demo](https://keydraft-branch-management-system.vercel.app)

## 🔑 Login Credentials
- Username: barath
- Password: 12345

## ✨ Features

- **Authentication**
  - Secure login system
  - Protected routes
  - Logout functionality

- **Data Operations**
  - Create new branch entries
  - View existing branch data
  - Update branch information
  - Delete branch records

- **Data Import/Export**
  - Excel file upload for bulk data import
  - Excel file download of branch data

- **Interface Features**
  - Real-time search functionality with filtering
  - Sortable data columns
  - Pagination (10 rows per page)
  - Grid/List view toggle
  - Full-screen mode
  - Responsive design

- **Modern UI**
  - Material Design components
  - Clean and professional layout
  - Status indicators
  - Interactive data grid
  - Smooth animations

## 🛠️ Tech Stack

- **Frontend**
  - React.js
  - Material-UI (MUI)
  - Axios for API calls
  - XLSX for Excel operations

- **Backend**
  - Node.js
  - Express.js
  - MongoDB for database
  - Mongoose ODM

## 🚀 Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/LASHETTY/keydraft-branch-management-system-assignment1.git
cd keydraft-branch-management-system-assignment1
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
   Create `.env` files in both frontend and backend directories:

Backend `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/branch-management
NODE_ENV=development
```

4. Start the application
```bash
# Start backend server
cd backend
npm start

# Start frontend development server (in a new terminal)
cd frontend
npm start
```

5. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
branch-management-system/
├── backend/
│   ├── server.js          # Entry point
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Login.js
    │   │   └── BranchManagement.js
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── .env
```

## 🔧 API Endpoints

- `POST /api/login` - User authentication
- `GET /api/branches` - Get all branches (with pagination)
- `POST /api/branches` - Create new branch
- `PUT /api/branches/:id` - Update branch
- `DELETE /api/branches/:id` - Delete branch

## 📱 Screenshots

[Add screenshots of your application here]

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**LASHETTY**
- GitHub: [@LASHETTY](https://github.com/LASHETTY)

## 🙏 Acknowledgments

- [Material-UI](https://mui.com/)
- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
