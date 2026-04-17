import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(100, 'Password is too long.'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits.')
    .regex(/^\d{6}$/, 'OTP must contain only numbers.'),
});

export const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
      .regex(/\d/, 'Password must contain at least one number.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, 'Full name must be at least 3 characters.'),
    campusId: z
      .string()
      .trim()
      .min(6, 'Campus ID is required.')
      .regex(/^UGR\/\d{3,8}\/\d{2}$/i, 'Campus ID must start with UGR format, for example UGR/12345/15.'),
    email: z.string().trim().email('Enter a valid email address.'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
      .regex(/\d/, 'Password must contain at least one number.'),
  })
;

export const zodToFormikErrors = (error) => {
  const formikErrors = {};

  if (!error?.issues) {
    return formikErrors;
  }

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (key && !formikErrors[key]) {
      formikErrors[key] = issue.message;
    }
  }

  return formikErrors;
};
