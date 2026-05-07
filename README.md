# AI Study Planner & Quiz Generator

An intelligent, full-stack web application designed to revolutionize the way students organize their learning. Powered by **Google Gemini AI**, this platform generates personalized study schedules and interactive quizzes to help you master any topic.

![Project Preview](https://via.placeholder.com/800x400?text=AI+Study+Planner+Preview)

## Features

- **AI Schedule Generator**: Get a custom-tailored study plan based on your subject and specific topic.
- **AI Quiz Generator**: Test your knowledge with 5-question multiple-choice quizzes generated on the fly.
- **Smart Explanations**: Review your quiz results with detailed explanations for every correct answer.
- **Global Leaderboard**: Compete with other students and track your rank for specific subjects.
- **PDF Export**: Download your AI-generated study schedules as professionally formatted PDFs.
- **Math Rendering**: Full support for LaTeX mathematical formulas using KaTeX.
- **Secure Auth**: Robust authentication using JWT and Google OAuth2.
- **Premium UI**: Modern, responsive Glassmorphism design for a superior user experience.

##Tech Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Security**: Spring Security (JWT + Google OAuth2)
- **Database**: MySQL 8.x
- **ORM**: Spring Data JPA (Hibernate)
- **AI Integration**: Google Gemini API

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Vanilla CSS (Custom Glassmorphism)
- **Markdown**: `react-markdown` with Math support (`remark-math`, `rehype-katex`)
- **Exports**: `html2pdf.js`
- **Networking**: Axios

## Getting Started

### Prerequisites
- JDK 17 or higher
- Node.js & npm
- MySQL Server
- Google Gemini API Key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/study-planner.git
   cd study-planner
   ```

2. **Backend Setup**:
   - Navigate to the `backend` folder.
   - Configure your database and API keys in `src/main/resources/application.properties`.
   - Run the application:
     ```bash
     ./mvnw spring-boot:run
     ```

3. **Frontend Setup**:
   - Navigate to the `frontend` folder.
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements
- Google Gemini API for the intelligent content generation.
- The open-source community for the amazing libraries used in this project.
