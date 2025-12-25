export const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,   // must be false for localhost
    sameSite: "lax",
    path: "/",       // ✅ ensure cookie is sent to all routes
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};
