// login validation
const registerValidation = (user) => {
  const { name, email, password, confirmPassword, role } = user || {};

  const validationError = {};

  if (!name) {
    validationError.name = "Name is Required!!";
  }

  if (!email) {
    validationError.email = "Email is Required!!";
  }

  if (!password) {
    validationError.password = "Password is Required!!";
  }

  if (password?.length < 6) {
    validationError.password = "Password must be more than 6 characters!!";
  }

  if (password !== confirmPassword) {
    validationError.confirmPassword =
      "Password and Confirm Passoword doest not match!!";
  }

  if (!role) {
    validationError.role = "Role is Required!!";
  }

  return validationError;
};

// login validation
const loginValidation = (user) => {
  const { email, password } = user || {};
  const validationError = {};

  if (!email) {
    validationError.email = "Email is Required!!";
  }

  if (!password) {
    validationError.password = "Password is Required!!";
  }

  return validationError;
};

module.exports = {
  registerValidation,
  loginValidation,
};
