import httpClient from '../lib/httpClient';

const USERS_KEY = 'mock_auth_users_v1';
const RESET_REQUEST_KEY = 'mock_reset_request_v1';
const DEFAULT_PASSWORD = 'Password123';
const DEMO_OTP = '123456';

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

const tokenFor = () => `mock_jwt_${Math.random().toString(36).slice(2, 12)}`;

const seedUsers = () => [
  {
    id: '1',
    campusId: 'UGR/11111/15',
    name: 'admin',
    email: 'admin@bms.com',
    role: 'admin',
    password: DEFAULT_PASSWORD,
    isFirstLogin: false,
  },
  {
    id: '2',
    campusId: 'UGR/22222/15',
    name: 'instructor',
    email: 'instructor@bms.com',
    role: 'instructor',
    password: DEFAULT_PASSWORD,
    isFirstLogin: false,
  },
  {
    id: '3',
    campusId: 'UGR/33333/15',
    name: 'member',
    email: 'member@bms.com',
    role: 'member',
    password: DEFAULT_PASSWORD,
    isFirstLogin: false,
  },
  {
    id: '4',
    campusId: 'UGR/44444/15',
    name: 'firstmember',
    email: 'first.member@bms.com',
    role: 'member',
    password: DEFAULT_PASSWORD,
    isFirstLogin: true,
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

const publicUser = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  isFirstLogin: user.isFirstLogin,
  name: user.name,
  campusId: user.campusId,
});

const getRoleFromEmailPrefix = (email) => {
  const localPart = (email || '').split('@')[0].toLowerCase();

  if (localPart.startsWith('admin')) {
    return 'admin';
  }

  if (localPart.startsWith('instructor')) {
    return 'instructor';
  }

  if (localPart.startsWith('student') || localPart.startsWith('member')) {
    return 'member';
  }

  return null;
};

export const authService = {
  async login({ email, password }) {
    const users = getUsers();
    const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      const role = getRoleFromEmailPrefix(email);

      if (!role) {
        return fail('Account not found for this email.', 404);
      }

      const demoUser = {
        id: `demo_${role}`,
        campusId: 'UGR/00000/00',
        name: email.split('@')[0],
        email,
        role,
        isFirstLogin: false,
      };

      const response = await makeResponse({
        user: demoUser,
        token: tokenFor(),
      });

      return response.data;
    }

    if (user.password !== password) {
      return fail('Invalid email or password.', 401);
    }

    const response = await makeResponse({
      user: publicUser(user),
      token: user.isFirstLogin ? null : tokenFor(),
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
    const users = getUsers();

    if (users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
      return fail('An account with this email already exists.', 409);
    }

    if (users.some((u) => u.campusId.toLowerCase() === payload.campusId.toLowerCase())) {
      return fail('This campus ID is already registered.', 409);
    }

    const role = payload.email.includes('admin')
      ? 'admin'
      : payload.email.includes('instructor')
        ? 'instructor'
        : 'member';

    const newUser = {
      id: String(Date.now()),
      campusId: payload.campusId,
      name: payload.email.split('@')[0],
      email: payload.email,
      role,
      password: payload.password,
      isFirstLogin: true,
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    const response = await makeResponse({
      message: 'Account created successfully.',
      user: publicUser(newUser),
    }, 201);

    return response.data;
  },

  async forgotPassword({ email }) {
    const request = {
      email,
      otp: DEMO_OTP,
      createdAt: Date.now(),
    };

    localStorage.setItem(RESET_REQUEST_KEY, JSON.stringify(request));

    const response = await makeResponse({
      message: 'Reset code sent successfully.',
      email,
    });

    return response.data;
  },

  async resendOtp({ email }) {
    const request = {
      email,
      otp: DEMO_OTP,
      createdAt: Date.now(),
    };

    localStorage.setItem(RESET_REQUEST_KEY, JSON.stringify(request));

    const response = await makeResponse({
      message: 'OTP resent successfully.',
      email,
    });

    return response.data;
  },

  async verifyOtp({ email, otp }) {
    const requestRaw = localStorage.getItem(RESET_REQUEST_KEY);
    const request = requestRaw ? JSON.parse(requestRaw) : null;

    if (!request || request.email.toLowerCase() !== email.toLowerCase()) {
      return fail('OTP session expired. Request a new code.', 410);
    }

    if (String(request.otp) !== String(otp)) {
      return fail('Invalid OTP. Please try again.', 400);
    }

    const response = await makeResponse({
      message: 'OTP verified successfully.',
      email,
    });

    return response.data;
  },

  async changePassword({ email, password }) {
    const users = getUsers();
    const userIndex = users.findIndex((item) => item.email.toLowerCase() === email.toLowerCase());

    if (userIndex === -1) {
      return fail('Account not found for password update.', 404);
    }

    const updatedUser = {
      ...users[userIndex],
      password,
      isFirstLogin: false,
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
};
