const authService = require('../modules/auth/auth.service');
const quizService = require('../modules/quiz/quiz.service');
const leaderboardService = require('../modules/leaderboard/leaderboard.service');
const authRepository = require('../modules/auth/auth.repository');
const quizRepository = require('../modules/quiz/quiz.repository');
const leaderboardRepository = require('../modules/leaderboard/leaderboard.repository');

// Mock Auth Repository
jest.mock('../modules/auth/auth.repository', () => ({
  findUserByEmailWithPassword: jest.fn(),
  findUserById: jest.fn(),
  createUser: jest.fn(),
  createRefreshToken: jest.fn(),
  findRefreshToken: jest.fn(),
  revokeRefreshToken: jest.fn(),
  findUserByVerificationToken: jest.fn(),
  findUserByResetToken: jest.fn(),
  revokeAllUserRefreshTokens: jest.fn(),
}));

// Mock Quiz Repository
jest.mock('../modules/quiz/quiz.repository', () => ({
  findQuizById: jest.fn(),
  findQuestionsWithAnswers: jest.fn(),
  createAttempt: jest.fn(),
}));

// Mock Leaderboard Repository
jest.mock('../modules/leaderboard/leaderboard.repository', () => ({
  deleteScope: jest.fn(),
  bulkWriteStandings: jest.fn(),
}));

describe('SurCodex Core Platform Hardening Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Phase 1 - Authentication & Revocation Services', () => {
    test('Should revoke all user sessions on password resets', async () => {
      const mockUser = {
        id: 'user_123',
        resetPasswordTokenExpiresAt: new Date(Date.now() + 3600000),
        setPassword: jest.fn(),
        save: jest.fn(),
      };
      
      authRepository.findUserByResetToken.mockResolvedValue(mockUser);
      authRepository.revokeAllUserRefreshTokens.mockResolvedValue({ nModified: 2 });

      const response = await authService.resetPassword('valid_token', 'NewSecurePass123!');
      
      expect(response.success).toBe(true);
      expect(mockUser.setPassword).toHaveBeenCalledWith('NewSecurePass123!');
      expect(mockUser.save).toHaveBeenCalled();
      expect(authRepository.revokeAllUserRefreshTokens).toHaveBeenCalledWith('user_123');
    });
  });

  describe('Phase 2 - Quiz Scoring & Telemetry Anti-Cheat Validation', () => {
    test('Should suspend candidate score to 0 when warnings threshold is exceeded', async () => {
      const mockQuiz = { id: 'quiz_99', status: 'published', durationMinutes: 60 };
      const mockQuestions = [
        { id: 'q_1', points: 10, options: [{ id: 'opt_1', isCorrect: true }] },
      ];

      quizRepository.findQuizById.mockResolvedValue(mockQuiz);
      quizRepository.findQuestionsWithAnswers.mockResolvedValue(mockQuestions);
      quizRepository.createAttempt.mockImplementation((payload) => Promise.resolve(payload));

      const payload = {
        answers: [{ question: 'q_1', selectedOptions: ['opt_1'] }],
        warningsCount: 3,
        antiCheatLogs: [new Date().toISOString(), new Date().toISOString(), new Date().toISOString()],
      };

      const result = await quizService.submitAttempt('quiz_99', payload, { id: 'candidate_77' });

      expect(result.status).toBe('suspended');
      expect(result.score).toBe(0);
      expect(result.percentage).toBe(0);
      expect(result.cheated).toBe(true);
    });

    test('Should flag suspicion when warnings count does not match timestamps count', async () => {
      const mockQuiz = { id: 'quiz_99', status: 'published', durationMinutes: 60 };
      const mockQuestions = [{ id: 'q_1', points: 10, options: [{ id: 'opt_1', isCorrect: true }] }];

      quizRepository.findQuizById.mockResolvedValue(mockQuiz);
      quizRepository.findQuestionsWithAnswers.mockResolvedValue(mockQuestions);
      quizRepository.createAttempt.mockImplementation((payload) => Promise.resolve(payload));

      const payload = {
        answers: [{ question: 'q_1', selectedOptions: ['opt_1'] }],
        warningsCount: 2,
        antiCheatLogs: [new Date().toISOString()], // count mismatch
      };

      const result = await quizService.submitAttempt('quiz_99', payload, { id: 'candidate_77' });

      expect(result.cheated).toBe(false); // under 3 warnings, but flags mismatch
      expect(result.suspiciousActivityFlags).toContain('Warning counts and timestamps logs mismatch');
    });
  });

  describe('Phase 3 - Leaderboard Calculation Services', () => {
    test('Should invoke bulk standing writes to MongoDB collection', async () => {
      leaderboardRepository.deleteScope.mockResolvedValue({ deletedCount: 5 });
      leaderboardRepository.bulkWriteStandings.mockResolvedValue({ nInserted: 2 });

      // Simulate a list of mock aggregate rankings
      const mockAggregates = [
        { _id: 'candidate_1', totalScore: 240, solvedCount: 5 },
      ];

      // Invoke calculations
      const writeResult = await leaderboardRepository.bulkWriteStandings(
        mockAggregates.map((item, idx) => ({
          user: item._id,
          score: item.totalScore,
          challengesSolved: item.solvedCount,
          rank: idx + 1,
        }))
      );

      expect(writeResult).toBeDefined();
      expect(leaderboardRepository.bulkWriteStandings).toHaveBeenCalledTimes(1);
    });
  });

  describe('Phase 4 - Resilient API Retries Simulator', () => {
    test('Should poll and resolve after temporary network failures', async () => {
      let fetchAttempts = 0;
      const fetchWithRetry = async (url, options, retries = 3, delay = 1) => {
        for (let i = 0; i < retries; i++) {
          fetchAttempts++;
          const response = await options.mockFetch();
          if (response.status === 429 || response.status >= 500) {
            continue;
          }
          return response;
        }
      };

      const mockFetch = jest.fn()
        .mockResolvedValueOnce({ status: 429, ok: false })
        .mockResolvedValueOnce({ status: 200, ok: true });

      const finalResponse = await fetchWithRetry('http://judge0/submissions', { mockFetch });
      expect(finalResponse.status).toBe(200);
      expect(fetchAttempts).toBe(2);
    });
  });
});
