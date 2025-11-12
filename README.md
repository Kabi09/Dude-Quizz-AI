# Dude AI & Dude Quizz

A full-stack MERN quiz application designed for students, featuring a complete practice test engine and an integrated AI assistant.





## ✨ Features

* **Practice Quiz Engine:** Supports multiple question types, including:
    * Multiple Choice (MCQ) with instant answer validation.
    * Drag-and-Drop Fill-in-the-Blank.
* **Dynamic Content:** Browse quizzes by Class (10th, 11th, 12th), Subject, and Unit.
* **AI Assistant:** A floating chatbot powered by a custom backend API (`/api/ollama/chat`) to answer user questions.
* **Email Integration:**
    * **Contact Form:** Saves user messages to MongoDB and sends an automated "Thank You" email via Nodemailer.
    * **Subscription Form:** Saves new subscribers to the database and sends a "Welcome" email.
* **Theme Toggle:** A persistent Light/Dark mode toggle that saves the user's preference in `localStorage`.
* **Math & Science Ready:** Uses **KaTeX** to beautifully render complex mathematical formulas and scientific notation.
* **Chat OCR:** The AI assistant can read text from images uploaded by the user using **Tesseract.js**.

---

## 💻 Tech Stack

* **Frontend:** React, Vite, React Router
* **Backend:** Node.js, Express
* **Database:** MongoDB Atlas (using Mongoose)
* **Email:** Nodemailer (with Gmail for transport)
* **Libraries:** `katex`, `tesseract.js`, `react-router-dom`

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### 1. Backend Setup

First, set up your server and database connection.

1.  Navigate to the backend directory:
    ```sh
    cd backend
    ```
2.  Install the required NPM packages:
    ```sh
    npm install
    ```
3.  Create a `.env` file in the `backend` folder for your environment variables:
    ```sh
    touch .env
    ```
4.  Add the following variables to your `.env` file.

    **`backend/.env`**
    ```ini
    # Port for the server
    PORT=7000

    # MongoDB Atlas connection string
    # Remember to URL-encode special characters in your password (e.g., # becomes %23)
    MONGO="MongoDB url"

    # Nodemailer (Gmail) credentials for sending emails
    # Use a 16-digit "App Password" from your Google Account, NOT your regular password
    EMAIL_USER="your-email@gmail.com"
    EMAIL_PASS="your-16-digit-google-app-password"
    ```

### 2. Frontend Setup

Next, set up the React client.

1.  Navigate to the frontend directory (assuming it's named `frontend`):
    ```sh
    cd frontend
    ```
2.  Install the required NPM packages:
    ```sh
    npm install
    ```
3.  Create a `.env` file in the `frontend` root:
    ```sh
    touch .env
    ```
4.  Add your backend API URL.

    **`frontend/.env`**
    ```ini
    # Base URL for all API calls
    # This must match your backend server's host and port
    VITE_API_URL="http://localhost:7000"
    ```
    *(Note: Your frontend code will make requests like `${VITE_API_URL}/api/contact` or `${VITE_API_URL}/ollama/chat`)*

---

## 📦 Database Seeding

To populate your MongoDB Atlas database with the sample questions, run the seed script.

This script reads your `backend/.env` file automatically, deletes all old questions, and inserts everything from the `/backend/data` folder.

1.  Make sure your `backend/.env` file is complete.
2.  From the **`backend`** folder, run:

    ```sh
    node seed.js
    ```
3.  You will see console output confirming the insertions (e.g., `inserted 10th_Maths_oneMark.json 125`).

---

## ▶️ Running the Application

1.  **Run the Backend Server:**
    * Open a terminal in the `backend` folder.
    * Run:
        ```sh
        npm start
        ```
    * Your server should be running on `http://localhost:7000`.

2.  **Run the Frontend App:**
    * Open a *new* terminal in the `frontend` folder.
    * Run:
        ```sh
        npm run dev
        ```
    * Your React app will open in your browser (usually `http://localhost:5173`).