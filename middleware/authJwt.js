import jwt from "jsonwebtoken";

const authorizeJwt = { 
    verifyToken: async (req, res, next) => {
    let token = req.headers["x-access-token"];
    console.log(token);
    if (!token) {
      return res.status(401).send({ message: "No token provided!" });
    }
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SERCET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.userId = decoded.id;
      next();
    });
  }
};

export default authorizeJwt;


