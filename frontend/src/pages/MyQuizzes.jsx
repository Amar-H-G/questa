import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api';

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const { data } = await API.get('/quizzes/my-quizzes');
        setQuizzes(data);
      } catch (error) {
        console.error("Failed to fetch quizzes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading quizzes...</div>;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Quizzes</h1>
          <Link 
            to="/create-quiz"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            + Create New
          </Link>
        </div>

        {quizzes.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-lg border border-border">
            <p className="text-muted-foreground text-lg mb-4">You haven't created any quizzes yet.</p>
            <Link to="/create-quiz" className="text-primary hover:underline">
              Get started by creating one!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <motion.div
                key={quiz._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 bg-card rounded-lg shadow border border-border"
              >
                <h3 className="text-xl font-bold text-foreground mb-2">{quiz.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {quiz.description || "No description provided."}
                </p>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
                    <span>{quiz.responseCount} Responses</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQuizzes;
