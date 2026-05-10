export function validatePassword(password) {
  const errors = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Must contain an uppercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Must contain a number");
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Must contain a special character");
  }

  return errors;
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return null;
}
