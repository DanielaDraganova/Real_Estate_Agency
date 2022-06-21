exports.getErrorMessage = (err) => {
  let errorMessage = err.message;

  //Only mongoose error has errors object inside the error
  if (err.errors) {
    console.log("Im here");
    errorMessage = Object.values(err.errors)
      .map((err) => err.message)
      .join("\r\n");
  }
  return errorMessage;
};

exports.getAllErrors = (err) => {
  return Object.values(err.errors).map((err) => err.message);
};
