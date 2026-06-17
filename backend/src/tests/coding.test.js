const codingService = require('../modules/coding/coding.service');
const repository = require('../modules/coding/coding.repository');
const executionService = require('../modules/coding/execution.service');
const CodingAttempt = require('../models/coding-attempt.model');
const CodingSubmission = require('../models/coding-submission.model');
const CodingProblem = require('../models/coding-problem.model');
const ApiError = require('../utils/api-error');

// Mock coding repository
jest.mock('../modules/coding/coding.repository', () => ({
  createProblem: jest.fn(),
  findProblemById: jest.fn(),
  listProblems: jest.fn(),
  countProblems: jest.fn(),
  createSubmission: jest.fn(),
  findSubmissionById: jest.fn(),
}));

// Mock Mongoose models
jest.mock('../models/coding-attempt.model');
jest.mock('../models/coding-submission.model');
jest.mock('../models/coding-problem.model');

// Mock execution service
jest.mock('../modules/coding/execution.service', () => ({
  queueSubmission: jest.fn(),
  runPlayground: jest.fn(),
}));

describe('Coding Assessment Module - End-to-End Workflows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Teacher Problem Management Workflow', () => {
    test('Should allow teacher to create a new problem successfully', async () => {
      const mockPayload = {
        title: 'Merge Intervals',
        difficulty: 'medium',
        prompt: 'Given an array of intervals...',
        constraints: ['intervals.length >= 1'],
        supportedLanguages: ['javascript', 'python'],
      };
      const mockTeacher = { id: 'teacher_001', role: 'teacher' };
      
      repository.createProblem.mockResolvedValue({
        id: 'problem_111',
        ...mockPayload,
        author: 'teacher_001',
      });

      const result = await codingService.createProblem(mockPayload, mockTeacher);

      expect(result).toBeDefined();
      expect(repository.createProblem).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Merge Intervals',
          author: 'teacher_001',
          slug: expect.any(String),
        })
      );
    });

    test('Should populate teacher analytics when a teacher fetches a problem details', async () => {
      const mockProblem = {
        id: 'problem_222',
        title: 'Two Sum',
        status: 'published',
        testCases: [{ _id: 'tc_1', isHidden: false }, { _id: 'tc_2', isHidden: true }],
        toJSON: function() { return this; }
      };
      const mockTeacher = { id: 'teacher_001', role: 'teacher' };
      
      repository.findProblemById.mockResolvedValue(mockProblem);
      
      // Mock attempts returned for this problem
      CodingAttempt.find.mockResolvedValue([
        { student: 'std_1', problem: 'problem_222', status: 'accepted', score: 100 },
        { student: 'std_2', problem: 'problem_222', status: 'wrong_answer', score: 50 },
      ]);

      const result = await codingService.getProblem('problem_222', mockTeacher);

      expect(result.analytics).toBeDefined();
      expect(result.analytics.totalAttempts).toBe(2);
      expect(result.analytics.totalSolved).toBe(1);
      expect(result.analytics.totalFailed).toBe(1);
      expect(result.analytics.passRate).toBe(50);
      expect(result.analytics.averageScore).toBe(75);
    });
  });

  describe('Student Submission & Attempt Verification Workflow', () => {
    test('Should hide hidden test cases from candidate responses', async () => {
      const mockProblem = {
        id: 'problem_333',
        title: 'Reverse String',
        status: 'published',
        testCases: [
          { _id: 'tc_1', isHidden: false, input: 'hello', expectedOutput: 'olleh' },
          { _id: 'tc_2', isHidden: true, input: 'world', expectedOutput: 'dlrow' }
        ],
        toJSON: function() { return this; }
      };
      const mockStudent = { id: 'stud_999', role: 'student' };

      repository.findProblemById.mockResolvedValue(mockProblem);

      const result = await codingService.getProblem('problem_333', mockStudent);

      // Verify sample case is visible but hidden case is removed
      expect(result.testCases.length).toBe(1);
      expect(result.testCases[0].isHidden).toBe(false);
      expect(result.testCases[0].input).toBe('hello');
    });

    test('Should create submission and lock attempt on initial student submit', async () => {
      const mockProblem = {
        id: 'problem_444',
        title: 'FizzBuzz',
        status: 'published',
        supportedLanguages: ['javascript'],
      };
      const mockStudent = { id: 'student_99', role: 'student' };
      const mockPayload = { language: 'javascript', sourceCode: 'console.log("Fizz");' };

      repository.findProblemById.mockResolvedValue(mockProblem);
      
      // Mock that no prior attempt exists
      CodingAttempt.findOne.mockResolvedValue(null);

      // Mock creation return values
      repository.createSubmission.mockResolvedValue({ id: 'sub_123', status: 'queued' });
      CodingAttempt.create.mockResolvedValue({ student: 'student_99', problem: 'problem_444' });
      executionService.queueSubmission.mockResolvedValue({ status: 'queued' });

      const response = await codingService.submit('problem_444', mockPayload, mockStudent);

      expect(response).toBeDefined();
      expect(CodingAttempt.create).toHaveBeenCalledWith(
        expect.objectContaining({
          student: 'student_99',
          problem: 'problem_444',
          submission: 'sub_123',
        })
      );
    });

    test('Should block second submission attempt at the database service level', async () => {
      const mockProblem = {
        id: 'problem_444',
        title: 'FizzBuzz',
        status: 'published',
        supportedLanguages: ['javascript'],
      };
      const mockStudent = { id: 'student_99', role: 'student' };
      const mockPayload = { language: 'javascript', sourceCode: 'console.log("Fizz");' };

      repository.findProblemById.mockResolvedValue(mockProblem);
      
      // Mock that an attempt already exists
      CodingAttempt.findOne.mockResolvedValue({ student: 'student_99', problem: 'problem_444' });

      await expect(
        codingService.submit('problem_444', mockPayload, mockStudent)
      ).rejects.toThrow(ApiError);

      await expect(
        codingService.submit('problem_444', mockPayload, mockStudent)
      ).rejects.toThrow('You have already submitted this coding challenge');
    });
  });
});
