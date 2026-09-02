const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();
  const cookieExpireDays = Number(process.env.COOKIE_EXPIRY) || 5;

  const options = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message: "JWT has been added to user's cookies",
    token,
    user,
  });
};

module.exports = sendToken;
