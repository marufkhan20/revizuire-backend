// create article validation
const createValidation = (article) => {
  const { title, description } = article || {};
  const validationError = {};

  if (!title) {
    validationError.title = "Title is Required!!";
  }

  if (!description) {
    validationError.description = "Description is Required!!";
  }

  return validationError;
};

module.exports = {
  createValidation,
};
