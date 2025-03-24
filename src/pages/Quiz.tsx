import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { analyzeQuizResponses } from '../lib/ai';

interface Question {
  id: number;
  text: string;
  options: string[];
  category: 'skills' | 'interests' | 'personality' | 'environment' | 'values' | 'goals' | 'learning' | 'challenges';
}

const questions: Question[] = [
  // Technical Skills
  {
    id: 1,
    text: "Which technical skills do you enjoy using or learning?",
    category: 'skills',
    options: [
      "Programming and software development",
      "Data analysis and statistics",
      "Design and visual arts",
      "Writing and content creation"
    ]
  },
  {
    id: 2,
    text: "What type of technical problems do you prefer solving?",
    category: 'skills',
    options: [
      "Complex algorithmic challenges",
      "Visual and interface design",
      "Data-driven analysis",
      "People and process optimization"
    ]
  },
  // Work Environment
  {
    id: 3,
    text: "What's your ideal work environment?",
    category: 'environment',
    options: [
      "Fast-paced startup culture",
      "Structured corporate setting",
      "Creative studio environment",
      "Remote/flexible workspace"
    ]
  },
  {
    id: 4,
    text: "How do you prefer to collaborate with others?",
    category: 'environment',
    options: [
      "Small, agile teams",
      "Large, structured teams",
      "Independent work with occasional collaboration",
      "Cross-functional project teams"
    ]
  },
  // Interests
  {
    id: 5,
    text: "What type of projects excite you the most?",
    category: 'interests',
    options: [
      "Building new technologies",
      "Solving business problems",
      "Creating user experiences",
      "Analyzing trends and patterns"
    ]
  },
  {
    id: 6,
    text: "Which industry interests you the most?",
    category: 'interests',
    options: [
      "Technology and software",
      "Finance and business",
      "Healthcare and science",
      "Media and entertainment"
    ]
  },
  // Personality
  {
    id: 7,
    text: "How do you approach problem-solving?",
    category: 'personality',
    options: [
      "Systematic and analytical",
      "Creative and intuitive",
      "Collaborative and discussion-based",
      "Research and data-driven"
    ]
  },
  {
    id: 8,
    text: "How do you handle deadlines and pressure?",
    category: 'personality',
    options: [
      "Thrive under pressure",
      "Prefer structured planning",
      "Adaptable and flexible",
      "Need clear expectations"
    ]
  },
  // Values
  {
    id: 9,
    text: "What matters most to you in a career?",
    category: 'values',
    options: [
      "Innovation and creativity",
      "Stability and security",
      "Impact and purpose",
      "Growth and learning"
    ]
  },
  {
    id: 10,
    text: "What type of recognition motivates you?",
    category: 'values',
    options: [
      "Technical achievements",
      "Leadership opportunities",
      "Creative excellence",
      "Team success"
    ]
  },
  // Goals
  {
    id: 11,
    text: "Where do you see yourself in 5 years?",
    category: 'goals',
    options: [
      "Technical expert/specialist",
      "Team leader/manager",
      "Independent consultant",
      "Entrepreneur/founder"
    ]
  },
  {
    id: 12,
    text: "What's your preferred career progression?",
    category: 'goals',
    options: [
      "Deep technical expertise",
      "Business and strategy",
      "Creative direction",
      "Research and innovation"
    ]
  },
  // Learning Style
  {
    id: 13,
    text: "How do you prefer to learn new skills?",
    category: 'learning',
    options: [
      "Self-paced online courses",
      "Structured classroom training",
      "Hands-on experimentation",
      "Mentorship and guidance"
    ]
  },
  {
    id: 14,
    text: "What's your preferred way of staying updated in your field?",
    category: 'learning',
    options: [
      "Reading technical documentation",
      "Following industry blogs and news",
      "Attending conferences and workshops",
      "Participating in online communities"
    ]
  },
  // Challenges
  {
    id: 15,
    text: "What type of challenges motivate you?",
    category: 'challenges',
    options: [
      "Technical problem-solving",
      "Creative innovation",
      "Strategic planning",
      "Team leadership"
    ]
  },
  {
    id: 16,
    text: "How do you prefer to handle workplace conflicts?",
    category: 'challenges',
    options: [
      "Direct communication",
      "Mediated discussion",
      "Systematic problem-solving",
      "Collaborative resolution"
    ]
  }
];

// interface CareerRecommendation {
//   title: string;
//   description: string;
//   matchScore: number;
//   keySkills: string[];
// }

export function Quiz() {
  const { user } = useAuthStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Array<{ question: string; answer: string }>>([]);
  const [completed, setCompleted] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnswer = async (answer: string) => {
    const newResponses = [
      ...responses,
      { question: questions[currentQuestion].text, answer }
    ];
    setResponses(newResponses);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsLoading(true);
      setCompleted(true);
      
      try {
        // Get AI analysis
        const aiAnalysis = await analyzeQuizResponses(newResponses);
        setAnalysis(aiAnalysis);

        // Save results to Supabase
        await supabase.from('quiz_results').insert({
          user_id: user?.id,
          answers: newResponses
        });
      } catch (error) {
        console.error('Error processing results:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 mt-12">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Your Career Analysis Results
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-line bg-gray-50 rounded-lg p-6">
                    {analysis}
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <button
                    onClick={() => window.location.href = '/'}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
                  >
                    View Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 mt-12">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Career Assessment</h2>
              <span className="text-gray-500">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <h3 className="text-xl font-medium text-gray-900 mb-6">
            {question.text}
          </h3>

          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}