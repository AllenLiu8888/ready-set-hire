# Ready Set Hire - Interview Management System

## 📋 Project Overview

Ready Set Hire is a full-stack interview management system designed to streamline the recruitment process. The system allows recruiters to create and manage interview templates, question banks, and enables candidates to complete interviews using speech recognition technology.

## 🚀 Key Features

### Admin Features

- **📊 Dashboard**: System overview with interview, question, and applicant statistics
- **💼 Interview Management**: Create, edit, and publish interview templates
- **❓ Question Bank**: Manage interview questions with different difficulty levels
- **👥 Applicant Management**: Track candidate status and interview progress
- **🤖 AI Question Generation**: Automatically generate interview questions using AI

### Candidate Features

- **🎯 Interview Flow**: User-friendly interview experience interface
- **🎤 Speech Recognition**: Support for voice responses to questions
- **💾 Auto-save**: Real-time answer preservation
- **✅ Progress Tracking**: Clear interview progress indicators

## 🔧 Installation & Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation Steps

1. **Clone the repository**

```bash
git clone [repository-url]
cd ready-set-hire
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create `.env.local` file with the following configuration:

```env
# API Configuration
VITE_API_BASE_URL=https://comp2140a2.uqcloud.net/api
VITE_JWT_TOKEN=YOUR_JWT_TOKEN_HERE
VITE_USERNAME=YOUR_STUDENT_ID

# AI Service Configuration (Optional)
VITE_AI_API_URL=YOUR_AI_API_URL
VITE_AI_API_KEY=YOUR_AI_API_KEY
```

> ⚠️ **Important**:
> - Get your JWT token from Blackboard My Grades - A2 JSON Web Token column
> - Replace YOUR_STUDENT_ID with your actual student ID

4. **Start development server**

```bash
npm run dev
```

Visit `http://localhost:5173` to view the application

## 📋 Usage Statement

This project incorporates various technologies and tools across different categories:

### Framework Usage
- **TailwindCSS Plus Framework**: Similar to DaisyUI, used for consistent design system and component styling

### Library Usage
- **Lucide React**: Icon library providing consistent iconography across the application
- **React Speech Recognition**: Voice recognition and transcription functionality for candidate interviews
- **Tailwind Variants**: Managing different styles for various component states and variants
- **Headless UI**: Accessible, unstyled UI components for complex interactions(For TailwindCSS PLUS)

### AI Usage
- **AI Model Integration**: The system connects to OpenAI LLM models, utilizing artificial intelligence services to automatically generate interview questions based on job roles and requirements
- **Comment Writing Assistance**: Used Codex and Claude to assist in modifying and supplementing code comments, ensuring accurate and clear documentation
- **Learning Assistance**: When encountering difficult concepts, leveraged AI tools for explanation and learning support
- **Development Assistance**: Throughout the development process, utilized AI tools to assist with code documentation writing, debugging, and optimization work, providing significant help in selecting various libraries

All AI-generated content is reviewed by administrators.

## ⚖️ Speech-to-Text in Hiring Interviews 
Responsible AI & Accessibility (Rubric 5.1 Research Question)

### 1. Bias & Fairness

**Potential Issues**
- Accuracy varies with accents, dialects, and speech styles
- Non-native speakers may face lower recognition accuracy

**Possible Solutions**
- Test regularly across diverse groups
- Include varied language data in training
- Do not rely solely on automatic transcription for evaluation

### 2. Accessibility Needs

**Potential Issues**
- Candidates with speech impairments may be disadvantaged
- Lack of alternative input methods
- Insufficient feedback or response time

**Possible Solutions**
- Provide text input alternatives
- Offer clear visual feedback
- Allow adequate response time

### 3. Privacy & Consent

**Potential Issues**
- Candidates unclear about data usage
- Risk of data misuse or leaks

**Possible Solutions**
- Obtain explicit consent before recording
- Set clear data retention and deletion policies
- Offer an opt-out option without penalty

### 4. Technical Reliability

**Potential Issues**
- Network instability or system errors
- Lack of pre-interview testing

**Possible Solutions**
- Provide fallback mechanisms
- Communicate technical requirements
- Offer test environment and multiple attempts

### 5. Legal Compliance

**Potential Issues**
- Risk of violating anti-discrimination or privacy laws

**Possible Solutions**
- Comply with ADA, GDPR, CCPA, etc.
- Provide reasonable accommodations

### 6. Quality Assurance

**Potential Issues**
- Errors in transcription may affect outcomes
- Bias may go undetected over time

**Possible Solutions**
- Human review for critical decisions
- Regular audits and bias monitoring
- Candidate feedback mechanism

### 7. Transparency & Communication

**Potential Issues**
- Candidates unclear about system's impact
- Lack of usage guidance or support

**Possible Solutions**
- Explain role and limits of speech recognition
- Provide best practice guidelines
- Ensure technical support availability

## 🛠️ Tech Stack

### Frontend

- **React 19.1.1** - User interface framework
- **React Router 7.0.1** - Routing management
- **Tailwind CSS 4.1.13** - Styling framework
- **Vite 7.1.7** - Build tool
- **React Speech Recognition 4.0.1** - Speech recognition
- **Headless UI 2.2.8** - Unstyled UI components
- **Lucide React** - Icon library

### Backend Integration

- **RESTful API** - Backend service communication
- **JWT Authentication** - Token-based authentication
- **AI Service Integration** - AI question generation service

## 📁 Project Structure

```text
ready-set-hire/
├── src/
│   ├── components/         # Reusable components
│   │   ├── form/           # Form components
│   │   ├── layout/         # Layout components
│   │   ├── shared/         # Shared components
│   │   └── ai/             # AI-related components
│   ├── pages/              # Page components
│   │   ├── applicants/     # Applicant management pages
│   │   ├── interviews/     # Interview management pages
│   │   ├── questions/      # Question management pages
│   │   └── take-interview/ # Candidate interview pages
│   ├── services/           # API service layer
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main application component
│   └── main.jsx            # Application entry point
├── public/                 # Static assets
├── .env.local              # Environment configuration
└── package.json            # Project dependencies
```

## 📜 Available Scripts

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🎯 Core Modules

### 1. Interview Management

- Create and edit interview templates
- Set interview status (Draft/Published/Archived)
- Link questions to interviews
- Generate candidate interview links

### 2. Question Management

- Create questions with different difficulty levels (Easy/Intermediate/Advanced)
- Question categorization and tagging
- AI-powered question generation
- Bulk import/export questions

### 3. Applicant Management

- Register candidate information
- Assign interviews
- View interview status and answers
- Export candidate data

### 4. Interview Experience

- Friendly welcome page
- Question-by-question presentation
- Voice recognition for answers
- Text input fallback
- Real-time progress display
- Completion confirmation page

## 🔐 API Integration

The system communicates with backend services through RESTful APIs. Main endpoints include:

- `/interviews` - Interview management
- `/questions` - Question management
- `/applicants` - Applicant management
- `/applicant-answers` - Applicant answer management

All API requests require JWT authentication token.

## 🎨 UI Components

### Form Components

- `TextInput` - Text input field
- `TextAreaInput` - Multi-line text input
- `SelectInput` - Dropdown selector
- `ActionButton` - Action button

### Layout Components

- `AppLayout` - Main application layout
- `DesktopSidebar` - Desktop sidebar

### Shared Components

- `SuccessAlert` - Success notification
- `FailAlert` - Failure notification
- `ConfirmAlert` - Confirmation dialog

## 🚦 State Management

The application uses React's built-in state management:

- `useState` - Component local state
- `useEffect` - Side effect management
- `useCallback` - Performance optimization
- Context API - Cross-component state sharing (when needed)

## 📄 License

This project is a COMP2140 course assignment project.

## 👥 Contributors

- Student: Yikai Liu
- Student ID: 47672626
- Course: COMP2140


---

*Last Updated: 2025-09-26*