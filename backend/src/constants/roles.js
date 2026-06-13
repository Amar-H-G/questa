const ROLES = Object.freeze({
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  RECRUITER: 'recruiter',
});

const ROLE_PERMISSIONS = Object.freeze({
  [ROLES.ADMIN]: ['*'],
  [ROLES.TEACHER]: ['quiz:write', 'quiz:read', 'analytics:read', 'coding:read'],
  [ROLES.STUDENT]: ['quiz:attempt', 'coding:submit', 'profile:read'],
  [ROLES.RECRUITER]: ['analytics:read', 'leaderboard:read', 'profile:read'],
});

module.exports = { ROLES, ROLE_PERMISSIONS };
