import database from "../database/database.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const authController = {
  signup: async (req, res) => {
    const { userName, userPassword, userEmail } = req.body;
    try {
      const isValidUserNameAndEmail = await Promise.all([
        checkValidUserName(userName),
        checkValidUserEmail(userEmail),
      ]);
      try {
        const id = await database.instance.createUser(
          userName,
          bcryptjs.hashSync(userPassword, 8),
          userEmail,
          "user"
        );

        return res.status(201).end(`User was registered successfully!" ${id}`);
      } catch (dbsError) {
        return res
          .status(402)
          .end(`Can't create User, something fuckup: ${dbsError}`);
      }
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  },
  signin: async (req, res) => {
    const { userName, userPassword } = req.body;
    const user = await database.instance.findUserByName(userName);
    if (!user) {
      res.status(402).send(`UserName: ${userName} Not Found!`);
    } else {
      const isValidPassword = bcryptjs.compareSync(userPassword, user.password);

      if (!isValidPassword) {
        res.status(401).send("Invalid Password!");
      } else {
        const token = jwt.sign(
          { id: user._id },
          process.env.ACCESS_TOKEN_SERCET,
          {
            expiresIn: 86400, // 24 hours
          }
        );

        res.status(200).send({
          id: user._id,
          userName: user.name,
          email: user.email,
          accessToken: token,
        });
      }
    }
  },
};

async function checkValidUserName(userName) {
  const user = await database.instance.findUserByName(userName);
  if (user === null) return;
  else throw new Error("UserName already exist");
}

async function checkValidUserEmail(userEmail) {
  const isUnique = await database.instance.findUserByEmail(userEmail);
  if (isUnique === null) return;
  else throw new Error("UserEmail already exist");
}

export default authController;
