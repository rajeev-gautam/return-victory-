# <b> SUDARSHAN GRID <br> AI THAT UNDERSTANDS INDIA </b>

AI-Powered Government Scheme Recommender & Fake Portal Detection System. Built for Hackathons with a focus on premium UI and citizen safety.

##  Features

- **AI Chatbot**: Intelligent assistant for government queries using Groq (Mixtral 8x7b).
- **Scheme Recommender**: Personalized recommendations based on user profile.
- **Fake Portal Detection**: Protect users from phishing with AI-powered URL analysis.
- **Visual Dashboard**: Comprehensive overview of security threats and recommended benefits.
- **Premium UI**: Dark mode, glassmorphism, smooth animations with Framer Motion.

##  Tech Stack

- **Frontend**: React (Vite)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **AI Engine**: Groq API via Axios (llama-3.3-70b-versatile)

##  Installation & Setup

1. **Clone the repository** (if applicable) or enter the project directory.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Groq API key:
   ```env
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```

##  Security Note
This application uses `dangerouslyAllowBrowser: true` for the Groq client to allow direct browser-to-API communication for demonstration purposes. In a production environment, always route AI requests through a secure backend to protect your API keys.
