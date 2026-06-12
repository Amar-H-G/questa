import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div className="flex justify-between items-center bg-card p-6 rounded-lg shadow border border-border">
            <h1 className="text-3xl font-bold text-foreground">Welcome, {user.name}!</h1>
            <button
            onClick={logout}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
            >
            Logout
            </button>
        </div>

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            {/* Dashboard Cards */}
            <Link to="/my-quizzes">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-6 bg-card rounded-lg shadow border border-border hover:border-primary/50 cursor-pointer h-full"
                >
                    <h3 className="text-xl font-semibold text-foreground">My Quizzes</h3>
                    <p className="text-muted-foreground mt-2">View and manage your created quizzes</p>
                </motion.div>
            </Link>

            <Link to="/create-quiz">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-6 bg-card rounded-lg shadow border border-border hover:border-primary/50 cursor-pointer h-full"
                >
                    <h3 className="text-xl font-semibold text-foreground">Create New</h3>
                    <p className="text-muted-foreground mt-2">Create a new quiz from scratch</p>
                </motion.div>
            </Link>

            <Link to="#">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-6 bg-card rounded-lg shadow border border-border hover:border-primary/50 cursor-pointer h-full opacity-50"
                >
                    <h3 className="text-xl font-semibold text-foreground">Analytics</h3>
                    <p className="text-muted-foreground mt-2">Coming Soon</p>
                </motion.div>
            </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
