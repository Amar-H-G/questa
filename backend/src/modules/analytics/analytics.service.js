const repository = require('./analytics.repository');

const round = (value) => Math.round(value * 10) / 10;

const QuizAttempt = require('../../models/quiz-attempt.model');

const getOverview = async () => {
  const [overview, trend] = await Promise.all([repository.countOverview(), repository.getAttemptTrend()]);
  const averageScore = overview.evaluatedAttempts.length
    ? round(overview.evaluatedAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / overview.evaluatedAttempts.length)
    : 0;

  return {
    users: overview.users,
    quizzes: overview.quizzes,
    attempts: overview.attempts,
    submissions: overview.submissions,
    completionRate: overview.attempts ? round((overview.evaluatedAttempts.length / overview.attempts) * 100) : 0,
    averageScore,
    acceptanceRate: overview.submissions ? round((overview.acceptedSubmissions / overview.submissions) * 100) : 0,
    trend: trend.map((item) => ({
      label: `${item._id.month}/${item._id.day}`,
      attempts: item.attempts,
      averageScore: round(item.averageScore || 0),
    })),
  };
};

const exportAttemptsCsv = async (filters) => {
  const query = {};
  if (filters.quizId) query.quiz = filters.quizId;
  if (filters.cheated !== undefined) query.cheated = filters.cheated === 'true';
  if (filters.scoreMin !== undefined) query.score = { $gte: Number(filters.scoreMin) };

  const attempts = await QuizAttempt.find(query)
    .populate('user', 'name email')
    .populate('quiz', 'title')
    .sort('-createdAt');

  let csvContent = 'Candidate Name,Candidate Email,Quiz,Score,Percentage,Warnings,Cheated,Suspicious Flags,Date\n';
  for (const att of attempts) {
    const name = (att.user?.name || 'Anonymous').replace(/"/g, '""');
    const email = (att.user?.email || 'N/A').replace(/"/g, '""');
    const quizTitle = (att.quiz?.title || 'Unknown Quiz').replace(/"/g, '""');
    const flags = (att.suspiciousActivityFlags || []).join('; ').replace(/"/g, '""');
    csvContent += `"${name}","${email}","${quizTitle}",${att.score},${att.percentage},${att.warningsCount || 0},${att.cheated || false},"${flags}","${att.createdAt.toISOString()}"\n`;
  }
  return csvContent;
};

const exportAttemptsPdf = async (filters, res) => {
  const query = {};
  if (filters.quizId) query.quiz = filters.quizId;
  if (filters.cheated !== undefined) query.cheated = filters.cheated === 'true';
  if (filters.scoreMin !== undefined) query.score = { $gte: Number(filters.scoreMin) };

  const attempts = await QuizAttempt.find(query)
    .populate('user', 'name email')
    .populate('quiz', 'title')
    .sort('-createdAt');

  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(res);

  doc.fillColor('#0f172a').fontSize(20).text('SurCodex Candidate Performance Report', { align: 'left' });
  doc.moveDown(0.2);
  doc.fillColor('#0ea5e9').fontSize(10).text('VERIFIED TECHNICAL EVALUATION STANDINGS', { tracking: 1 });
  doc.moveDown(1.5);

  let y = doc.y;
  doc.fillColor('#475569').fontSize(9);
  doc.text('Candidate Name', 40, y);
  doc.text('Quiz Title', 180, y);
  doc.text('Score', 330, y);
  doc.text('Warnings', 380, y);
  doc.text('Cheated', 440, y);
  doc.text('Status', 500, y);

  doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(40, y + 15).lineTo(570, y + 15).stroke();
  doc.moveDown(1.2);

  for (const att of attempts) {
    if (doc.y > 700) {
      doc.addPage();
      doc.fillColor('#0f172a').fontSize(20).text('SurCodex Candidate Performance Report', { align: 'left' });
      doc.moveDown(1.5);
      y = doc.y;
      doc.fillColor('#475569').fontSize(9);
      doc.text('Candidate Name', 40, y);
      doc.text('Quiz Title', 180, y);
      doc.text('Score', 330, y);
      doc.text('Warnings', 380, y);
      doc.text('Cheated', 440, y);
      doc.text('Status', 500, y);
      doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(40, y + 15).lineTo(570, y + 15).stroke();
      doc.moveDown(1.2);
    }

    const currentY = doc.y;
    doc.fillColor('#1e293b').fontSize(9);
    doc.text(att.user?.name || 'Anonymous', 40, currentY, { width: 130, ellipsis: true });
    doc.text(att.quiz?.title || 'Unknown Quiz', 180, currentY, { width: 140, ellipsis: true });
    doc.text(`${att.percentage}%`, 330, currentY);
    doc.text(`${att.warningsCount || 0}`, 380, currentY);
    doc.text(att.cheated ? 'YES' : 'NO', 440, currentY);
    
    const statusText = att.status || 'evaluated';
    doc.fillColor(att.cheated ? '#ef4444' : '#10b981').text(statusText.toUpperCase(), 500, currentY);
    doc.moveDown(1.5);
  }

  doc.end();
};

module.exports = { getOverview, exportAttemptsCsv, exportAttemptsPdf };
