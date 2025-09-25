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

## 🤖 AI Usage Statement

This project incorporates AI technologies in the following ways:

- **AI Question Generation**: The system can automatically generate interview questions based on job roles and requirements using AI services
- **Speech-to-Text**: Utilizes browser-based speech recognition APIs to convert candidate voice responses into text
- **Development Assistance**: AI tools were used to assist with code documentation, debugging, and optimization during development

All AI-generated content is reviewed and can be edited by administrators before use in actual interviews.

## ⚖️ Responsible AI & Accessibility Considerations

### Speech-to-Text in Hiring Interviews - Key Considerations:

#### Bias and Fairness
- Speech recognition accuracy varies across accents, dialects, and speech patterns
- Non-native speakers may experience lower recognition accuracy
- Regional vocabulary and pronunciation differences can affect transcription quality
- System should be regularly tested across diverse speaker demographics

#### Accessibility Requirements
- Provide alternative input methods (text typing) for all speech interfaces
- Support for candidates with speech disabilities or impairments
- Clear visual feedback during speech recognition process
- Adequate time allowances for responses without penalties

#### Privacy and Consent
- Explicit consent required before recording voice data
- Clear data retention and deletion policies
- Transparency about how voice data is processed and stored
- Option to opt-out of voice recording without disadvantage

#### Technical Reliability
- Fallback mechanisms for technical failures
- Internet connectivity requirements clearly communicated
- Testing environment provided before actual interview
- Support for multiple attempts if recognition fails

#### Legal Compliance
- Adherence to disability discrimination laws (ADA, etc.)
- Compliance with data protection regulations (GDPR, CCPA)
- Equal opportunity employment requirements
- Documentation of reasonable accommodations provided

#### Quality Assurance
- Human review of transcriptions for critical decisions
- Regular auditing of system performance across demographics
- Continuous monitoring for bias in outcomes
- Feedback mechanism for candidates to report issues

#### Transparency and Communication
- Clear explanation of how speech recognition affects evaluation
- Information about technology limitations upfront
- Guidelines on optimal recording conditions
- Support channels for technical assistance

## 📄 License

This project is a COMP2140 course assignment project.

## 👥 Contributors

- Student: Yikai Liu
- Student ID: 47672626
- Course: COMP2140

## 📞 Support

For issues, please contact the course teaching team.

---

*Last Updated: 2025-09-26*