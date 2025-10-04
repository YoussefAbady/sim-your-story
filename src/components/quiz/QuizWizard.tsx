import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Trophy, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { awardSessionPoints } from "@/services/sessionPointsService";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "💰 What percentage of your salary goes to pension contributions in Poland?",
    options: ["15.52%", "19.52%", "25%", "30%"],
    correctAnswer: 1,
    explanation: "ZUS takes 19.52% of your gross salary each month for your pension fund!"
  },
  {
    question: "👴 At what age can women retire in Poland?",
    options: ["55 years", "60 years", "65 years", "67 years"],
    correctAnswer: 1,
    explanation: "Women can retire at 60, while men retire at 65 in Poland."
  },
  {
    question: "📈 What is the replacement rate?",
    options: [
      "Your pension as % of your last salary",
      "Yearly pension increase",
      "Tax on pension",
      "Contribution rate"
    ],
    correctAnswer: 0,
    explanation: "The replacement rate shows what percentage of your final salary your pension will be!"
  },
  {
    question: "🏥 How does sick leave affect your pension?",
    options: [
      "No effect at all",
      "Reduces contributions",
      "Increases contributions",
      "Doubles contributions"
    ],
    correctAnswer: 1,
    explanation: "Sick leave typically means lower contributions to your pension account, reducing your future pension."
  },
  {
    question: "⏰ What happens if you postpone retirement by 1 year?",
    options: [
      "Pension decreases",
      "No change",
      "Pension increases",
      "Lose all benefits"
    ],
    correctAnswer: 2,
    explanation: "Postponing retirement increases your pension because you contribute longer and receive payments for fewer years!"
  }
];

interface QuizWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuizWizard = ({ open, onOpenChange }: QuizWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const currentQuestion = QUIZ_QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUIZ_QUESTIONS.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setShowResult(true);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    setUserAnswers(prev => [...prev, selectedAnswer]);
  };

  const handleNext = () => {
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async () => {
    const finalCorrectCount = correctAnswers + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0);
    const scorePercentage = (finalCorrectCount / QUIZ_QUESTIONS.length) * 100;
    const pointsEarned = Math.round(scorePercentage * 5); // Up to 500 points for perfect score
    
    setQuizComplete(true);

    // Award session points
    awardSessionPoints('quiz_completed', pointsEarned, (newTotal, earned) => {
      toast.success(`Quiz Complete! 🎉`, {
        description: `You earned ${earned} points! Score: ${scorePercentage.toFixed(0)}%`,
        duration: 5000,
      });
    });

    // Save quiz data to database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userEmail = user?.email || 'anonymous';
      const userName = user?.user_metadata?.name || 'Anonymous User';

      await supabase.from('quizzes').insert({
        quiz_type: 'pension_basics',
        score: finalCorrectCount, // Store correct answer count, not percentage
        total_questions: QUIZ_QUESTIONS.length,
        answers: userAnswers as any,
        quiz_data: QUIZ_QUESTIONS as any,
        user_email: userEmail,
        user_name: userName
      });
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectAnswers(0);
    setQuizComplete(false);
    setUserAnswers([]);
  };

  const handleClose = () => {
    resetQuiz();
    onOpenChange(false);
  };

  if (quizComplete) {
    const finalCorrectCount = correctAnswers + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0);
    const finalScore = (finalCorrectCount / QUIZ_QUESTIONS.length) * 100;
    const pointsEarned = Math.round(finalScore * 5);

    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8"
          >
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
            <DialogTitle className="text-3xl mb-2">Quiz Complete! 🎉</DialogTitle>
            <p className="text-5xl font-bold text-primary my-4">{finalScore.toFixed(0)}%</p>
            <p className="text-lg mb-6">
              You got {finalCorrectCount} out of {QUIZ_QUESTIONS.length} questions correct!
            </p>
            <div className="bg-primary/10 rounded-lg p-4 mb-6">
              <p className="text-2xl font-bold text-primary">+{pointsEarned} Points Earned! 🌟</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={resetQuiz} variant="outline">
                Take Again
              </Button>
              <Button onClick={handleClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Pension Knowledge Quiz
          </DialogTitle>
          <DialogDescription>
            Test your knowledge and earn up to 500 points! 🏆
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
              <span>{correctAnswers} correct</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold">{currentQuestion.question}</h3>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQuestion.correctAnswer;
                  const showCorrect = showResult && isCorrect;
                  const showIncorrect = showResult && isSelected && !isCorrect;

                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      whileHover={!showResult ? { scale: 1.02 } : {}}
                      whileTap={!showResult ? { scale: 0.98 } : {}}
                      className={cn(
                        "w-full p-4 text-left rounded-lg border-2 transition-all",
                        "flex items-center justify-between gap-3",
                        isSelected && !showResult && "border-primary bg-primary/10",
                        showCorrect && "border-green-500 bg-green-50 dark:bg-green-950",
                        showIncorrect && "border-red-500 bg-red-50 dark:bg-red-950",
                        !isSelected && !showResult && "border-border hover:border-primary/50"
                      )}
                    >
                      <span className="flex-1">{option}</span>
                      {showCorrect && <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />}
                      {showIncorrect && <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />}
                    </motion.button>
                  );
                })}
              </div>

              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-4 rounded-lg",
                    selectedAnswer === currentQuestion.correctAnswer
                      ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
                      : "bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800"
                  )}
                >
                  <p className="font-medium mb-1">
                    {selectedAnswer === currentQuestion.correctAnswer ? "✅ Correct!" : "💡 Good try!"}
                  </p>
                  <p className="text-sm">{currentQuestion.explanation}</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleClose}>
              Exit Quiz
            </Button>
            {!showResult ? (
              <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null}>
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNext}>
                {currentStep < QUIZ_QUESTIONS.length - 1 ? "Next Question" : "Finish Quiz"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};