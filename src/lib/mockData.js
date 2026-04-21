export const ALL_MEMBERS = [
  // Development Division
  { id: 1, name: 'Alice Dev', email: 'alice@dev.com', role: 'member', division: 'Development', idNo: 'CSEC/DEV/001', status: 'Active', attendance: '95%', divisions: ['Development'] },
  { id: 2, name: 'Bob Dev', email: 'bob@dev.com', role: 'member', division: 'Development', idNo: 'CSEC/DEV/002', status: 'Active', attendance: '88%', divisions: ['Development'] },
  { id: 3, name: 'Charlie Dev', email: 'charlie@dev.com', role: 'instructor', division: 'Development', idNo: 'INST/DEV/001', status: 'Active', attendance: '100%', divisions: ['Development'] },
  { id: 13, name: 'Daniel Dev', email: 'daniel@dev.com', role: 'member', division: 'Development', idNo: 'CSEC/DEV/003', status: 'Active', attendance: '92%', divisions: ['Development'] },
  { id: 14, name: 'Elena Dev', email: 'elena@dev.com', role: 'member', division: 'Development', idNo: 'CSEC/DEV/004', status: 'Pending', attendance: '0%', divisions: ['Development'] },
  { id: 15, name: 'Fasil Dev', email: 'fasil@dev.com', role: 'instructor', division: 'Development', idNo: 'INST/DEV/002', status: 'Active', attendance: '98%', divisions: ['Development'] },
  
  // Cyber Security Division
  { id: 4, name: 'Dave Cyber', email: 'dave@cyber.com', role: 'member', division: 'Cyber Security', idNo: 'CSEC/SEC/001', status: 'Active', attendance: '92%', divisions: ['Cyber Security'] },
  { id: 5, name: 'Eve Cyber', email: 'eve@cyber.com', role: 'member', division: 'Cyber Security', idNo: 'CSEC/SEC/002', status: 'Active', attendance: '90%', divisions: ['Cyber Security'] },
  { id: 6, name: 'Frank Cyber', email: 'frank@cyber.com', role: 'instructor', division: 'Cyber Security', idNo: 'INST/SEC/001', status: 'Active', attendance: '100%', divisions: ['Cyber Security'] },
  { id: 16, name: 'George Cyber', email: 'george@cyber.com', role: 'member', division: 'Cyber Security', idNo: 'CSEC/SEC/003', status: 'Active', attendance: '85%', divisions: ['Cyber Security'] },
  { id: 17, name: 'Hanna Cyber', email: 'hanna@cyber.com', role: 'member', division: 'Cyber Security', idNo: 'CSEC/SEC/004', status: 'Suspended', attendance: '45%', divisions: ['Cyber Security'] },
  { id: 18, name: 'Ismail Cyber', email: 'ismail@cyber.com', role: 'instructor', division: 'Cyber Security', idNo: 'INST/SEC/002', status: 'Active', attendance: '99%', divisions: ['Cyber Security'] },

  // Data Science Division
  { id: 7, name: 'Grace Data', email: 'grace@data.com', role: 'member', division: 'Data Science', idNo: 'CSEC/DS/001', status: 'Active', attendance: '96%', divisions: ['Data Science'] },
  { id: 8, name: 'Heidi Data', email: 'heidi@data.com', role: 'member', division: 'Data Science', idNo: 'CSEC/DS/002', status: 'Pending', attendance: '0%', divisions: ['Data Science'] },
  { id: 9, name: 'Ivan Data', email: 'ivan@data.com', role: 'instructor', division: 'Data Science', idNo: 'INST/DS/001', status: 'Active', attendance: '100%', divisions: ['Data Science'] },
  { id: 19, name: 'Jacob Data', email: 'jacob@data.com', role: 'member', division: 'Data Science', idNo: 'CSEC/DS/003', status: 'Active', attendance: '89%', divisions: ['Data Science'] },
  { id: 20, name: 'Kalkidan Data', email: 'kalkidan@data.com', role: 'member', division: 'Data Science', idNo: 'CSEC/DS/004', status: 'Active', attendance: '94%', divisions: ['Data Science'] },
  { id: 21, name: 'Lia Data', email: 'lia@data.com', role: 'instructor', division: 'Data Science', idNo: 'INST/DS/002', status: 'Active', attendance: '97%', divisions: ['Data Science'] },

  // CP Division
  { id: 10, name: 'Judy CP', email: 'judy@cp.com', role: 'member', division: 'CP (Competitive Programming)', idNo: 'CSEC/CP/001', status: 'Active', attendance: '98%', divisions: ['CP (Competitive Programming)'] },
  { id: 11, name: 'Mallory CP', email: 'mallory@cp.com', role: 'member', division: 'CP (Competitive Programming)', idNo: 'CSEC/CP/002', status: 'Active', attendance: '94%', divisions: ['CP (Competitive Programming)'] },
  { id: 12, name: 'Niaj CP', email: 'niaj@cp.com', role: 'instructor', division: 'CP (Competitive Programming)', idNo: 'INST/CP/001', status: 'Active', attendance: '100%', divisions: ['CP (Competitive Programming)'] },
  { id: 22, name: 'Oscar CP', email: 'oscar@cp.com', role: 'member', division: 'CP (Competitive Programming)', idNo: 'CSEC/CP/003', status: 'Active', attendance: '91%', divisions: ['CP (Competitive Programming)'] },
  { id: 23, name: 'Peter CP', email: 'peter@cp.com', role: 'member', division: 'CP (Competitive Programming)', idNo: 'CSEC/CP/004', status: 'Active', attendance: '87%', divisions: ['CP (Competitive Programming)'] },
  { id: 24, name: 'Quinn CP', email: 'quinn@cp.com', role: 'instructor', division: 'CP (Competitive Programming)', idNo: 'INST/CP/002', status: 'Active', attendance: '100%', divisions: ['CP (Competitive Programming)'] },
];

export const ALL_ADMINS = [
  { id: 101, name: 'Admin Dev', email: 'admin@dev.com', role: 'admin', division: 'Development', idNo: 'ADM/DEV/001', status: 'Active' },
  { id: 102, name: 'Admin Cyber', email: 'admin@cyber.com', role: 'admin', division: 'Cyber Security', idNo: 'ADM/SEC/001', status: 'Active' },
  { id: 103, name: 'Admin Data', email: 'admin@data.com', role: 'admin', division: 'Data Science', idNo: 'ADM/DS/001', status: 'Active' },
  { id: 104, name: 'Admin CP', email: 'admin@cp.com', role: 'admin', division: 'CP (Competitive Programming)', idNo: 'ADM/CP/001', status: 'Active' },
];

export const ALL_SESSIONS = [
  { id: 1, title: 'React Performance', description: 'Advanced hooks and memoization.', date: '2026-04-25', time: '14:00', division: 'Development', instructor: 'Charlie Dev' },
  { id: 2, title: 'Network Auditing', description: 'Using Nmap and Wireshark.', date: '2026-04-26', time: '10:00', division: 'Cyber Security', instructor: 'Frank Cyber' },
  { id: 3, title: 'Neural Networks 101', description: 'Introduction to PyTorch.', date: '2026-04-27', time: '15:00', division: 'Data Science', instructor: 'Ivan Data' },
  { id: 4, title: 'Dynamic Programming', description: 'Matrix Chain Multiplication.', date: '2026-04-28', time: '11:00', division: 'CP (Competitive Programming)', instructor: 'Niaj CP' },
];

export const ALL_TASKS = [
  { id: 1, title: 'Fix Header Bug', assignee: 'Alice Dev', division: 'Development', status: 'In Progress', deadline: '2026-04-22' },
  { id: 2, title: 'Firewall Config', assignee: 'Dave Cyber', division: 'Cyber Security', status: 'Pending', deadline: '2026-04-23' },
  { id: 3, title: 'Clean Sales Data', assignee: 'Grace Data', division: 'Data Science', status: 'Completed', deadline: '2026-04-21' },
  { id: 4, title: 'Graph Problem A', assignee: 'Judy CP', division: 'CP (Competitive Programming)', status: 'Pending', deadline: '2026-04-22' },
];

export const ALL_GROUPS = [
  { id: 1, name: 'Front-end Elites', division: 'Development', membersCount: 5 },
  { id: 2, name: 'Red Team Alpha', division: 'Cyber Security', membersCount: 3 },
  { id: 3, name: 'ML Researchers', division: 'Data Science', membersCount: 4 },
  { id: 4, name: 'Algorithm Crackers', division: 'CP (Competitive Programming)', membersCount: 6 },
];

export const RESOURCES = [
  { id: 1, title: 'React Performance Guide', type: 'PDF', division: 'Development', url: '#', date: '2026-04-20' },
  { id: 2, title: 'Nmap Cheat Sheet', type: 'Link', division: 'Cyber Security', url: '#', date: '2026-04-21' },
];

export const SUBMISSIONS = [
  { id: 1, taskId: 3, student: 'Alice Dev', file: 'dom_assignment.zip', status: 'Pending', submittedAt: '2026-04-21T10:00:00Z', division: 'Development' },
  { id: 2, taskId: 3, student: 'Bob Dev', file: 'dom_fix.js', status: 'Reviewed', submittedAt: '2026-04-21T09:30:00Z', division: 'Development' },
];

export const FEEDBACK_AGGREGATED = [
  { sessionId: 1, avgRating: 4.8, count: 12, topPros: ['Clear examples', 'Good pace'], topCons: ['Audio crackle'] },
  { sessionId: 2, avgRating: 4.5, count: 8, topPros: ['Hands-on lab'], topCons: ['Too advanced for some'] },
];

export const WEEKLY_PROGRESS = [
  { id: 1, groupId: 1, week: 1, progress: 85, status: 'On Track', reports: ['Implemented routing', 'Styled landing page'] },
];
