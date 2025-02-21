
# Video Player Backend

- [Model link](https://app.eraser.io/workspace/oY0fh4ufCknF2xKHieD3?origin=share) 

## 📌 Project Overview
The **Video Player Backend** is a RESTful API built using **Node.js** and **Express.js** to manage video uploads, authentication, and playback functionalities. It uses **MongoDB** as the database with **Mongoose**, and supports cloud-based storage with **Cloudinary**. Authentication is secured with **JWT**, and file handling is managed using **Multer**. The backend also includes pagination using **mongoose-aggregate-paginate** and testing with **Postman**.

---

## 🚀 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ORM
- **Authentication:** Bcrypt, JWT
- **File Uploads:** Multer, Cloudinary
- **Pagination:** Mongoose Aggregate Paginate
- **Testing & API Client:** Postman

---

## 🏗 Project Structure

```
video-player-backend/
├── models/              # Mongoose Models
├── routes/              # API Routes
├── controllers/         # Business Logic
├── middlewares/        # Authentication & Error Handling
├── config/             # Configuration Files
├── utils/              # Helper Functions
├── uploads/            # Temporary Storage for Videos
├── .env                # Environment Variables
├── index.js           # Entry Point
└── package.json        # Dependencies
```

---

## 🔑 Features

✅ **User Authentication** (Register, Login, JWT-based Auth)  
✅ **Video Upload & Management** (Multer, Cloudinary)  
✅ **Secure Video Storage & Access**  
✅ **Pagination for Efficient Data Retrieval**  
✅ **Error Handling & Validation**  
✅ **Postman-tested API Endpoints**  

---

## 🛠 Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone <repository-link>
cd video-player/backend
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Configure Environment Variables
Create a **.env** file in the root directory and add:
```env
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
```

### 4️⃣ Run the Server
```sh
npm run dev  # Runs the backend on the specified port
```

---

## 📌 API Endpoints

### 🔹 Authentication
- `POST /api/auth/register` – User registration
- `POST /api/auth/login` – User login

### 🔹 Video Management
- `POST /api/videos/upload` – Upload a video
- `GET /api/videos/:videoId` – Fetch video details
- `GET /api/videos` – Fetch all videos (Paginated)

### 🔹 User Profile
- `GET /api/users/profile` – Get user profile

---

## 🔍 Testing with Postman
- Import the API collection into **Postman**.
- Send requests to the endpoints and verify responses.

---

## 🛠 Future Enhancements
🚀 **Live Streaming Support**  
🚀 **Video Analytics & Views Tracking**  
🚀 **Improved Role-based Access Control**  
🚀 **Comment & Like System for Videos**  

---

## 🤝 Contributing
Contributions are welcome! Feel free to **fork** this repo, create a feature branch, and submit a PR.

---


### 📧 Contact
For any queries or support, reach out via [email](mailto:aliasgar.shchandan@gmail.com).

