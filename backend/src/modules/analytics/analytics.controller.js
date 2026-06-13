const asyncHandler = require('../../utils/async-handler');
const service = require('./analytics.service');

const overview = asyncHandler(async (_req, res) => {
  const data = await service.getOverview();
  res.json({ success: true, data });
});

const exportCsv = asyncHandler(async (req, res) => {
  const csv = await service.exportAttemptsCsv(req.query);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=candidates-report.csv');
  res.send(csv);
});

const exportPdf = asyncHandler(async (req, res) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=candidates-report.pdf');
  await service.exportAttemptsPdf(req.query, res);
});

module.exports = { overview, exportCsv, exportPdf };
