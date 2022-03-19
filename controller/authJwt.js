import jwt from "jsonwebtoken";


async function refreshToken(req, res) {
  const refreshToken = req.body.token;
  if (!refreshToken)
    res.sendStatus(401).send({ message: "No token provided!" });

  // if database don't include refresh user sendded token
  // send status(403) Unauthorized
  //

  jwt.verify(refreshToken, process.env.ACCESS_TOKEN, (err, data) => {
    if (err) {
      return res.status(403).send({ message: "Unauthorized!" });
    }
    const accessToken = jwt.sign(
      {
        userId: data.userId,
      },
      process.env.ACCESS_TOKEN_SERCET,
      {
        expiresIn: 86400,
      }
    );
    res.json({ accessToken });
  });
}

export { verifyToken };
