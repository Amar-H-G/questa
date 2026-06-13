const queueSubmission = async (submission) => ({
  provider: 'judge0',
  providerStatus: 'queued',
  submissionId: submission.id,
});

module.exports = { queueSubmission };
