🛡️ Delegated Group Management System
A full-stack web application for managing users, groups, roles, and permissions using Django (backend) and React with Vite (frontend).


🧑‍💻 Tech Stack

🔙 Backend (Django)

Django 5.2.1

Django REST Framework

Channels (WebSockets)

Simple JWT Authentication

MySQL (prod) / SQLite (dev)

CORS Headers

🔜 Frontend (React + Vite)
React 18+

Vite

Axios

JWT handling for auth

Tailwind / Material UI (if used)

🚀 Getting Started
🔧 Backend Setup
bash
Copy
Edit
# Step 1: Navigate to backend
cd djangoBackend

# Step 2: Create virtual environment
python -m venv venv
source venv/Scripts/activate  # or venv/bin/activate on Linux/macOS

# Step 3: Install dependencies
pip install -r requirements.txt  # create this if not already

# Step 4: Set up database
python manage.py makemigrations
python manage.py migrate

# Step 5: Run server
python manage.py runserver
🔐 Make sure your .env or settings.py includes correct DB credentials.

🌐 Frontend Setup
bash
Copy
Edit
# Step 1: Navigate to frontend
cd "frontend delegated-group-management"

# Step 2: Install dependencies
npm install

# Step 3: Run dev server
npm run dev
Make sure your Vite app connects to the backend via the correct URL in the API service file (e.g., http://localhost:8000).

🧪 Features
✅ User Signup/Login with JWT

✅ Role & Group-based permission management

✅ Delegated admin functionality

✅ Real-time notifications using Django Channels

✅ React frontend with protected routes

✅ CORS-enabled communication between frontend and backend

🧰 Environment Variables (Example)
Backend (.env or settings.py):

env
Copy
Edit
DB_NAME=org
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=3306
SECRET_KEY=your_secret_key
Frontend (.env):

env
Copy
Edit
VITE_API_BASE_URL=http://localhost:8000
🛠️ To Do
 Production deployment (Docker / Heroku / Railway)

 UI improvements

 Redis + Channels for production WebSockets

 Testing (Django + React Testing Library)

🧑‍💼 Author
Ayush Kumar Vyas
🔗 GitHub: ayushvyasonwork
📧 Email: work.ayushvyas17@gmail.com

📄 License
This project is licensed under the MIT License.
