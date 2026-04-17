import httpClient from '../lib/httpClient';

const USERS_KEY = 'mock_auth_users_v1';
const OTP_SESSIONS_KEY = 'mock_otp_sessions_v1';
const DEFAULT_PASSWORD = 'Password123';
const DEMO_OTP = '123456';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,100}$/;

const wait = (ms = 350) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const makeResponse = (data, status = 200, delay = 350) =>
  httpClient.request({
    url: '/auth/mock',
    method: 'post',
    data,
    adapter: async (config) => {
      await wait(delay);
      return {
        data,
        status,
        statusText: 'OK',
        headers: {},
        config,
      };
    },
  });

const fail = async (message, status = 400) => {
  await wait(300);
  const error = new Error(message);
  error.status = status;
  throw error;
};

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const ensureValidEmail = async (email) => {
  if (!EMAIL_REGEX.test(normalizeEmail(email))) {
    return fail('Enter a valid email address.', 422);
  }

  return null;
};

const ensureStrongPassword = async (password) => {
  if (!STRONG_PASSWORD_REGEX.test(String(password || ''))) {
    return fail('Password must be 8+ chars with uppercase, lowercase, and number.', 422);
  }

  return null;
};

const tokenFor = () => `mock_jwt_${Math.random().toString(36).slice(2, 12)}`;

const seedUsers = () => [
  {
    id: '1',
    campusId: 'UGR/11111/15',
    name: 'admin',
    email: 'admin@bms.com',
    role: 'admin',
    division: 'CPD',
    password: DEFAULT_PASSWORD,
    isVerified: true,
    approvalStatus: 'approved',
    requiresPasswordChange: false,
  },
  {
    id: '2',
    campusId: 'UGR/22222/15',
    name: 'instructor',
    email: 'instructor@bms.com',
    role: 'instructor',
    division: 'Data Science',
    password: DEFAULT_PASSWORD,
    isVerified: true,
    approvalStatus: 'approved',
    requiresPasswordChange: false,
  },
  {
    id: '3',
    campusId: 'UGR/33333/15',
    name: 'member',
    email: 'member@bms.com',
    role: 'member',
    division: 'Cybersecurity',
    password: DEFAULT_PASSWORD,
    isVerified: true,
    approvalStatus: 'approved',
    requiresPasswordChange: false,
  },
  {
    id: '4',
    campusId: 'UGR/44444/16',
    name: 'tempmember',
    email: 'temp.member@bms.com',
    role: 'member',
    division: 'Development',
    password: 'TempPass123',
    isVerified: true,
    approvalStatus: 'approved',
    requiresPasswordChange: true,
  },
];

const getUsers = () => {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    const initialUsers = seedUsers();
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
    return initialUsers;
  }

  try {
    return JSON.parse(raw);
  } catch {
    const initialUsers = seedUsers();
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
    return initialUsers;
  }
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const getOtpSessions = () => {
  const raw = localStorage.getItem(OTP_SESSIONS_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const saveOtpSessions = (sessions) => {
  localStorage.setItem(OTP_SESSIONS_KEY, JSON.stringify(sessions));
};

const upsertOtpSession = ({ email, purpose, otp = DEMO_OTP }) => {
  const sessions = getOtpSessions();
  const keyEmail = String(email || '').toLowerCase();
  const next = sessions.filter((item) => !(item.email.toLowerCase() === keyEmail && item.purpose === purpose));

  next.push({
    email,
    purpose,
    otp,
    isVerified: false,
    createdAt: Date.now(),
  });

  saveOtpSessions(next);
};

const getOtpSession = ({ email, purpose }) => {
  const sessions = getOtpSessions();
  const keyEmail = String(email || '').toLowerCase();
  return sessions.find((item) => item.email.toLowerCase() === keyEmail && item.purpose === purpose) || null;
};

const markOtpVerified = ({ email, purpose }) => {
  const sessions = getOtpSessions();
  const keyEmail = String(email || '').toLowerCase();
  const next = sessions.map((item) => {
    if (item.email.toLowerCase() === keyEmail && item.purpose === purpose) {
      return { ...item, isVerified: true };
    }

    return item;
  });
  saveOtpSessions(next);
};

const clearOtpSession = ({ email, purpose }) => {
  const sessions = getOtpSessions();
  const keyEmail = String(email || '').toLowerCase();
  const next = sessions.filter((item) => !(item.email.toLowerCase() === keyEmail && item.purpose === purpose));
  saveOtpSessions(next);
};

const publicUser = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  division: user.division,
  approvalStatus: user.approvalStatus,
  isVerified: user.isVerified,
  requiresPasswordChange: Boolean(user.requiresPasswordChange),
  name: user.name,
  campusId: user.campusId,
});

export const authService = {
  async login({ email, password }) {
    await ensureValidEmail(email);

    if (!String(password || '').trim()) {
      return fail('Password is required.', 422);
    }

    if (String(password).length < 8) {
      return fail('Password must be at least 8 characters.', 422);
    }

    const users = getUsers();
    const normalizedEmail = normalizeEmail(email);
    const user = users.find((item) => item.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return fail('Account not found for this email.', 404);
    }

    if (!user.isVerified) {
      return fail('Please verify your email first.', 403);
    }

    if (user.approvalStatus !== 'approved') {
      return fail('Your application is still pending admin approval.', 403);
    }

    if (user.password !== password) {
      return fail('Invalid email or password.', 401);
    }

    const response = await makeResponse({
      user: publicUser(user),
      token: user.requiresPasswordChange ? null : tokenFor(),
      requiresPasswordChange: Boolean(user.requiresPasswordChange),
    });

    return response.data;
  },

  async googleLogin() {
    const users = getUsers();
    const user = users.find((item) => item.email === 'member@bms.com') || users[0];

    const response = await makeResponse({
      user: publicUser(user),
      token: tokenFor(),
    });

    return response.data;
  },

  async signup(payload) {
    await ensureValidEmail(payload.email);
    await ensureStrongPassword(payload.password);

    const users = getUsers();
    const normalizedEmail = normalizeEmail(payload.email);

    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      return fail('An account with this email already exists.', 409);
    }

    if (users.some((u) => u.campusId.toLowerCase() === payload.campusId.toLowerCase())) {
      return fail('This campus ID is already registered.', 409);
    }

    const newUser = {
      id: String(Date.now()),
      campusId: payload.campusId,
      name: normalizedEmail.split('@')[0],
      email: normalizedEmail,
      role: 'member',
      division: payload.division,
      password: payload.password,
      motivation: payload.motivation,
      dedication: payload.dedication,
      whyDivision: payload.whyDivision,
      isVerified: false,
      approvalStatus: 'pending',
      requiresPasswordChange: false,
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    upsertOtpSession({ email: normalizedEmail, purpose: 'register' });

    const response = await makeResponse({
      message: 'Account created. Verify OTP to continue.',
      user: publicUser(newUser),
    }, 201);

    return response.data;
  },

  async forgotPassword({ email }) {
    await ensureValidEmail(email);

    const users = getUsers();
    const normalizedEmail = normalizeEmail(email);
    const user = users.find((item) => item.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return fail('Account not found for this email.', 404);
    }

    upsertOtpSession({ email: normalizedEmail, purpose: 'forgot-password' });

    const response = await makeResponse({
      message: 'Reset code sent successfully.',
      email: normalizedEmail,
    });

    return response.data;
  },

  async resendOtp({ email, purpose }) {
    await ensureValidEmail(email);

    if (!purpose) {
      return fail('OTP purpose is required.', 400);
    }

    const normalizedEmail = normalizeEmail(email);
    upsertOtpSession({ email: normalizedEmail, purpose });

    const response = await makeResponse({
      message: 'OTP resent successfully.',
      email: normalizedEmail,
      purpose,
    });

    return response.data;
  },

  async verifyOtp({ email, otp, purpose }) {
    await ensureValidEmail(email);

    if (!purpose) {
      return fail('OTP purpose is required.', 400);
    }

    const normalizedEmail = normalizeEmail(email);
    const session = getOtpSession({ email: normalizedEmail, purpose });

    if (!session) {
      return fail('OTP session expired. Request a new code.', 410);
    }

    if (String(session.otp) !== String(otp)) {
      return fail('Invalid OTP. Please try again.', 400);
    }

    markOtpVerified({ email: normalizedEmail, purpose });

    if (purpose === 'register') {
      const users = getUsers();
      const userIndex = users.findIndex((item) => item.email.toLowerCase() === normalizedEmail);

      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          isVerified: true,
          approvalStatus: users[userIndex].approvalStatus || 'pending',
        };
        saveUsers(users);
      }
    }

    const response = await makeResponse({
      message: 'OTP verified successfully.',
      email: normalizedEmail,
      purpose,
    });

    return response.data;
  },

  async getUserByEmail(email) {
    await ensureValidEmail(email);

    const users = getUsers();
    const normalizedEmail = normalizeEmail(email);
    const user = users.find((item) => item.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return fail('Account not found for this email.', 404);
    }

    const response = await makeResponse({ user: publicUser(user) });
    return response.data;
  },

  async checkApproval({ email }) {
    await ensureValidEmail(email);

    const users = getUsers();
    const normalizedEmail = normalizeEmail(email);
    const user = users.find((item) => item.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return fail('Account not found for this email.', 404);
    }

    const response = await makeResponse({
      approvalStatus: user.approvalStatus,
      isApproved: user.approvalStatus === 'approved',
      user: publicUser(user),
    });
    return response.data;
  },

  async mockApproveUser({ email }) {
    await ensureValidEmail(email);

    const users = getUsers();
    const normalizedEmail = normalizeEmail(email);
    const userIndex = users.findIndex((item) => item.email.toLowerCase() === normalizedEmail);

    if (userIndex === -1) {
      return fail('Account not found for this email.', 404);
    }

    users[userIndex] = {
      ...users[userIndex],
      approvalStatus: 'approved',
      requiresPasswordChange: false,
      isVerified: true,
    };
    saveUsers(users);

    const response = await makeResponse({
      message: 'Mock approval completed.',
      user: publicUser(users[userIndex]),
    });

    return response.data;
  },

  async changePassword({ email, password }) {
    await ensureValidEmail(email);
    await ensureStrongPassword(password);

    const users = getUsers();
    const normalizedEmail = normalizeEmail(email);
    const userIndex = users.findIndex((item) => item.email.toLowerCase() === normalizedEmail);

    if (userIndex === -1) {
      return fail('Account not found for password update.', 404);
    }

    const updatedUser = {
      ...users[userIndex],
      password,
      requiresPasswordChange: false,
    };

    users[userIndex] = updatedUser;
    saveUsers(users);

    const response = await makeResponse({
      message: 'Password updated successfully.',
      user: publicUser(updatedUser),
      token: tokenFor(),
    });

    return response.data;
  },

  async resetPassword({ email, password }) {
    await ensureValidEmail(email);
    await ensureStrongPassword(password);

    const normalizedEmail = normalizeEmail(email);
    const session = getOtpSession({ email: normalizedEmail, purpose: 'forgot-password' });

    if (!session || !session.isVerified) {
      return fail('Reset session is invalid. Verify OTP again.', 410);
    }

    const users = getUsers();
    const userIndex = users.findIndex((item) => item.email.toLowerCase() === normalizedEmail);

    if (userIndex === -1) {
      return fail('Account not found for this email.', 404);
    }

    users[userIndex] = {
      ...users[userIndex],
      password,
      requiresPasswordChange: false,
    };
    saveUsers(users);
    clearOtpSession({ email: normalizedEmail, purpose: 'forgot-password' });

    const response = await makeResponse({
      message: 'Password reset successful. You can login now.',
      user: publicUser(users[userIndex]),
    });
    return response.data;
  },
};
