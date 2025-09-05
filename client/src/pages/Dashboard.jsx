import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { quizAPI, submissionAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Plus, 
  BookOpen, 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp,
  Calendar,
  Award,
  Brain,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
  });
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [quizzesResponse, historyResponse] = await Promise.all([
        quizAPI.getUserQuizzes(),
        submissionAPI.getHistory()
      ]);

      const quizzes = quizzesResponse.data.quizzes || [];
      const submissions = historyResponse.data.history || [];

      setRecentQuizzes(quizzes.slice(0, 5));
      setRecentSubmissions(submissions.slice(0, 5));

      // Calculate stats
      const totalAttempts = submissions.length;
      const averageScore = totalAttempts > 0 
        ? submissions.reduce((sum, sub) => sum + sub.score, 0) / totalAttempts 
        : 0;
      const bestScore = totalAttempts > 0 
        ? Math.max(...submissions.map(sub => sub.score)) 
        : 0;

      setStats({
        totalQuizzes: quizzes.length,
        totalAttempts,
        averageScore: Math.round(averageScore * 10) / 10,
        bestScore,
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreBadge = (score) => {
    if (score >= 90) return 'badge-success';
    if (score >= 70) return 'badge-warning';
    return 'badge-error';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200/50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                Welcome back, {user?.username}! 👋
              </h1>
              <p className="text-base-content/70 text-lg">
                Ready to continue your learning journey?
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 md:mt-0"
            >
              <Link to="/create-quiz" className="btn btn-primary btn-lg btn-gradient group">
                <Plus className="w-5 h-5 mr-2" />
                Create New Quiz
                <Zap className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="card bg-base-100 shadow-lg border border-base-300 card-hover">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/70 text-sm">Total Quizzes</p>
                  <p className="text-2xl font-bold text-primary">{stats.totalQuizzes}</p>
                </div>
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg border border-base-300 card-hover">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/70 text-sm">Total Attempts</p>
                  <p className="text-2xl font-bold text-secondary">{stats.totalAttempts}</p>
                </div>
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg border border-base-300 card-hover">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/70 text-sm">Average Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>
                    {stats.averageScore}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg border border-base-300 card-hover">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/70 text-sm">Best Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(stats.bestScore)}`}>
                    {stats.bestScore}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-success" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Quizzes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-base-100 shadow-lg border border-base-300"
          >
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="card-title text-xl">
                  <Brain className="w-6 h-6 text-primary mr-2" />
                  Recent Quizzes
                </h2>
                <Link to="/dashboard" className="btn btn-ghost btn-sm">
                  View All
                </Link>
              </div>

              {recentQuizzes.length > 0 ? (
                <div className="space-y-3">
                  {recentQuizzes.map((quiz) => (
                    <motion.div
                      key={quiz._id}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-primary">{quiz.subject}</h3>
                        <p className="text-sm text-base-content/70">
                          Grade {quiz.grade} • {quiz.questions.length} questions
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="badge badge-outline">
                          {new Date(quiz.createdAt).toLocaleDateString()}
                        </div>
                        <Link
                          to={`/quiz/${quiz._id}`}
                          className="btn btn-primary btn-sm"
                        >
                          View
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-base-content/30 mx-auto mb-4" />
                  <p className="text-base-content/70">No quizzes created yet</p>
                  <Link to="/create-quiz" className="btn btn-primary btn-sm mt-2">
                    Create Your First Quiz
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-base-100 shadow-lg border border-base-300"
          >
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="card-title text-xl">
                  <Clock className="w-6 h-6 text-secondary mr-2" />
                  Recent Activity
                </h2>
                <Link to="/history" className="btn btn-ghost btn-sm">
                  View All
                </Link>
              </div>

              {recentSubmissions.length > 0 ? (
                <div className="space-y-3">
                  {recentSubmissions.map((submission) => (
                    <motion.div
                      key={submission._id}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{submission.subject}</h3>
                        <p className="text-sm text-base-content/70">
                          Grade {submission.grade} • Attempt #{submission.attemptNo}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`badge ${getScoreBadge(submission.score)}`}>
                          {submission.score}%
                        </div>
                        <div className="badge badge-outline">
                          {new Date(submission.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-base-content/30 mx-auto mb-4" />
                  <p className="text-base-content/70">No quiz attempts yet</p>
                  <p className="text-sm text-base-content/50 mt-1">
                    Create a quiz and start learning!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/create-quiz" className="card bg-gradient-to-br from-primary to-primary/80 text-primary-content shadow-lg card-hover">
              <div className="card-body text-center">
                <Plus className="w-12 h-12 mx-auto mb-4" />
                <h3 className="card-title justify-center">Create Quiz</h3>
                <p className="text-primary-content/80">Generate AI-powered questions</p>
              </div>
            </Link>

            <Link to="/leaderboard" className="card bg-gradient-to-br from-secondary to-secondary/80 text-secondary-content shadow-lg card-hover">
              <div className="card-body text-center">
                <Trophy className="w-12 h-12 mx-auto mb-4" />
                <h3 className="card-title justify-center">Leaderboard</h3>
                <p className="text-secondary-content/80">See top performers</p>
              </div>
            </Link>

            <Link to="/history" className="card bg-gradient-to-br from-accent to-accent/80 text-accent-content shadow-lg card-hover">
              <div className="card-body text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4" />
                <h3 className="card-title justify-center">History</h3>
                <p className="text-accent-content/80">View past attempts</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;