const CodingProblem = require('../../models/coding-problem.model');
const CodingSubmission = require('../../models/coding-submission.model');

const createProblem = (payload) => CodingProblem.create(payload);
const findProblemById = (id) => CodingProblem.findById(id);
const listProblems = ({ filter, skip, limit }) =>
  CodingProblem.find(filter).select('-testCases.expectedOutput').skip(skip).limit(limit).sort('-createdAt');
const countProblems = (filter) => CodingProblem.countDocuments(filter);
const createSubmission = (payload) => CodingSubmission.create(payload);

module.exports = { createProblem, findProblemById, listProblems, countProblems, createSubmission };
