import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(455).send({ message: "You are not logged in" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(403).send({ message: "You are not logged in" });
    }

    req.userId = payload.id;
    next();
  });
};
