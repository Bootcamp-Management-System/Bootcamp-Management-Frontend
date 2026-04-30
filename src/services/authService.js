import api from '../api/api';

const USERS_KEY = 'mock_auth_users_v1';
const OTP_SESSIONS_KEY = 'mock_otp_sessions_v1';
const DEFAULT_PASSWORD = 'DemoPass123';
const DEMO_OTP = '123456';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CAMPUS_ID_REGEX = /^UGR\/\d{3,8}\/\d{2}$/i;
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,100}$/;

const fail = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  throw error;
};

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const normalizeId = (value) => String(value || '').trim().toUpperCase();

const ensureValidIdentifier = async (identifier) => {
  const trimmed = String(identifier || '').trim();
  if (!trimmed) {
    return fail('Email or ID number is required.', 422);
  }

  if (!EMAIL_REGEX.test(trimmed) && !CAMPUS_ID_REGEX.test(trimmed)) {
    return fail('Enter a valid email or campus ID (ex: UGR/12345/15).', 422);
  }

  return null;
};

const ensureValidEmail = async (email) => {
  const trimmed = String(email || '').trim();
  if (!trimmed) {
    return fail('Email is required.', 422);
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return fail('Enter a valid email address.', 422);
  }

  return null;
};

const resolveUserByIdentifier = (identifier) => {
  const trimmed = String(identifier || '').trim();
  if (!trimmed) {
    return null;
  }

  const users = getUsers();

  if (EMAIL_REGEX.test(trimmed)) {
    const normalizedEmail = normalizeEmail(trimmed);
    return users.find((item) => item.email.toLowerCase() === normalizedEmail) || null;
  }

  const normalizedId = normalizeId(trimmed);
  return users.find((item) => item.campusId.toUpperCase() === normalizedId) || null;
};

const ensureStrongPassword = async (password) => {
  if (!STRONG_PASSWORD_REGEX.test(String(password || ''))) {
    return fail('Password must be 8+ chars with uppercase, lowercase, and number.', 422);
  }

  return null;
};

const ensureDivisions = (user) => {
  if (!user || user.role !== 'member') {
    return user;
  }

  if (!Array.isArray(user.divisions) || user.divisions.length === 0) {
    return {
      ...user,
      divisions: ['Development', 'Cyber Security', 'Data Science', 'CP (Competitive Programming)'],
    };
  }

  return user;
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

const normalizeRole = (role) => {
  if (!role) return role;
  if (role === 'student') return 'member';
  if (role === 'super-admin' || role === 'super admin') return 'super_admin';
  return role;
};

const publicUser = (user) => {
  if (!user) return null;
  const role = normalizeRole(user.role);
  const id = user.id || user._id;
  return {
    id,
    _id: id,
    email: user.email,
    role,
    division: user.division,
    approvalStatus: user.approvalStatus,
    isVerified: user.isVerified,
    requiresPasswordChange: Boolean(user.requiresPasswordChange),
    name: user.name,
    campusId: user.campusId || user.idNo,
    divisions: user.divisions,
    memberships: user.memberships || [],
    is_Member: Boolean(user.is_Member),
    firstLogin: user.firstLogin,
  };
};

const normalizeAuthResponse = (response) => {
  const payload = response?.data?.data || response?.data || response || {};
  const rawUser = payload.user || payload.data?.user || payload.account || null;
  const token =
    payload.token ||
    payload.accessToken ||
    payload.data?.token ||
    payload.data?.accessToken ||
    null;
  const normalizedUser = ensureDivisions(publicUser(rawUser));

  return {
    user: normalizedUser,
    token,
    requiresPasswordChange: Boolean(
      payload.requiresPasswordChange || payload.data?.requiresPasswordChange || normalizedUser?.requiresPasswordChange
    ),
    requiresApproval: Boolean(
      payload.requiresApproval || payload.data?.requiresApproval || (normalizedUser?.approvalStatus && normalizedUser.approvalStatus !== 'approved')
    ),
  };
};

export const authService = {
  async login({ email, password }) {
    await ensureValidEmail(email);

    if (!String(password || '').trim()) {
      return fail('Password is required.', 422);
    }

    if (String(password).length < 8) {
      return fail('Password must be at least 8 characters.', 422);
    }

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      if (response?.data?.message && !response?.data?.token && !response?.data?.user) {
        return {
          user: { email },
          token: null,
          requiresOtp: true,
          requiresPasswordChange: false,
          requiresApproval: false,
          message: response.data.message,
        };
      }

      const normalized = normalizeAuthResponse(response);

      if (!normalized.user && !normalized.token && response?.data?.message) {
        return {
          user: { email },
          token: null,
          requiresPasswordChange: true,
          requiresApproval: false,
        };
      }

      return normalized;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Login failed.';
      return fail(message, error?.response?.status || 400);
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/users/me', {
        skipAuthRedirect: true,
      });
      const payload = response?.data?.data || response?.data?.user || response?.data;
      return ensureDivisions(publicUser(payload));
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Session validation failed.';
      return fail(message, error?.response?.status || 401);
    }
  },

  async verifyOtpBackend({ email, otp, newPassword }) {
    await ensureValidEmail(email);

    if (!String(otp || '').trim()) {
      return fail('OTP is required.', 422);
    }

    const payload = { email, otp };
    if (newPassword) {
      payload.newPassword = newPassword;
    }

    const response = await api.post('/auth/verify-otp', payload);

    return normalizeAuthResponse(response);
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
    try {
      const response = await api.post('/auth/signup', payload);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Signup failed.';
      return fail(message, error?.response?.status || 400);
    }
  },

  async forgotPassword({ email }) {
    await ensureValidEmail(email);

    const normalizedEmail = normalizeEmail(email);

    try {
      const response = await api.post('/auth/forgot-password', { email: normalizedEmail });
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Failed to send password reset code.';
      return fail(message, error?.response?.status || 400);
    }
  },

  async resendOtp({ email }) {
    await ensureValidEmail(email);

    const normalizedEmail = normalizeEmail(email);

    try {
      const response = await api.post('/auth/resend-otp', { email: normalizedEmail });
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Failed to resend OTP.';
      return fail(message, error?.response?.status || 400);
    }
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

  async changePassword({ oldPassword, newPassword }) {
    try {
      const response = await api.post('/auth/change-password', {
        oldPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Failed to update password.';
      return fail(message, error?.response?.status || 400);
    }
  },

  async resetPassword({ email, otp, newPassword }) {
    await ensureValidEmail(email);
    await ensureStrongPassword(newPassword);

    const normalizedEmail = normalizeEmail(email);

    if (!String(otp || '').trim()) {
      return fail('OTP is required.', 422);
    }

    try {
      const response = await api.post('/auth/reset-password', {
        email: normalizedEmail,
        otp,
        newPassword,
      });
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Failed to reset password.';
      return fail(message, error?.response?.status || 400);
    }
  },
  
  async completeOnboarding(onboardingData) {
    try {
      const response = await api.post('/users/onboarding', onboardingData);
      return response.data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Onboarding failed.';
      return fail(message, error?.response?.status || 400);
    }
  },
};
