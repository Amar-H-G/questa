const rows = [
  ['Aarav Mehta', 'Full-stack', 982],
  ['Maya Chen', 'Algorithms', 948],
  ['Noah Silva', 'Frontend systems', 921],
  ['Ira Kapoor', 'Backend scale', 904],
];

export const LeaderboardPage = () => (
  <div className="page-shell space-y-6">
    <div>
      <p className="text-sm text-cyan-200">Performance tracking</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Leaderboard</h1>
    </div>
    <div className="overflow-hidden rounded-lg border border-white/10">
      <table className="w-full border-collapse bg-white/[0.04] text-left text-sm">
        <thead className="bg-white/[0.06] text-slate-400">
          <tr>
            <th className="px-4 py-3">Rank</th>
            <th className="px-4 py-3">Candidate</th>
            <th className="px-4 py-3">Signal</th>
            <th className="px-4 py-3">Score</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row[0]} className="border-t border-white/10">
              <td className="px-4 py-4 text-cyan-200">#{index + 1}</td>
              <td className="px-4 py-4 font-medium">{row[0]}</td>
              <td className="px-4 py-4 text-slate-400">{row[1]}</td>
              <td className="px-4 py-4">{row[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
