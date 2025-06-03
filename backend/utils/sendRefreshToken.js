export default (res, token) => {
  res.cookie("jid", token, {
    httpOnly: true,
    path: "/api/auth/refresh_token", // مسیر خاص برای ریفرش
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};
