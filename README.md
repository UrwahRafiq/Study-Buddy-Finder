# 📚 Study Buddy Finder

A web platform designed to help university students in Pakistan connect with compatible study partners, collaborate on academic goals, and enhance their learning experience.

---

## 🌟 Features

- 👥 **Smart Matching**: Find students based on similar academic interests and enrolled courses using NLP
- 💬 **Real-Time Chat**: 1-on-1 and group messaging powered by Socket.IO
- 📁 **File Sharing**: Seamlessly exchange notes and resources
- 🗓️ **Calendar Integration**: Schedule study sessions with reminders
- 📈 **Progress Tracking**: Set academic goals and track performance
- 📝 **Community Blog**: Share knowledge, experiences, and tips

---

## 🛠️ Tech Stack

### Frontend
- React.js
- TailwindCSS
- React Calendar

### Backend
- Strapi (Node.js Headless CMS)
- Python (NLP matching logic)
- PostgreSQL

### Real-Time & Other Tools
- Socket.IO
- Google Calendar API (optional)
- LocalStorage (client-side file handling)

---

## 📂 Project Structure
Study-Buddy-Finder/
├── frontend/ # React application
│ ├── public/
│ ├── src/
│ └── .env
├── backend/ # Strapi CMS
│ ├── api/
│ ├── config/
│ └── .env
├── matching/ # Python NLP matching logic
├── README.md
└── .gitignore


---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Python 3.x
- PostgreSQL
- Git

---

### 1. Clone the Repository

```bash
git clone git@github.com:UrwahRafiq/Study-Buddy-Finder.git
cd Study-Buddy-Finder
