const setTokenCookie = (res, token) => {
  if (!token) {
    throw new Error("Token not generated");
  }

  res.cookie('authToken', token, {
    httpOnly: true,
    expires: new Date(Date.now() + 30* 24 * 60 * 60 * 1000), // 15 days
    sameSite: 'strict',
  });
};

export default setTokenCookie;
