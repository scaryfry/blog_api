import { Router } from "express";
import * as User from "../data/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import auth from "../util/authentication.js";
const router = Router();

router.post("register", (req,res) => {
  const {name, email, password} = req.body;
  if (!name || !email || !passowrd){
    return res.status(400).json({message: "Invalid creadentials"});
  }
  let user = User.getUserByEmail(email)
  if(user){
    res.status(400).json({message: "Email already exsists!"})
  }

  const salt = bcrypt.genSaltSync(12);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const saved = User.saveUser(name, email, password);
  user = User.getUserById(saved.lastInsertRowid);
  res.status(201).json(user);
})


//login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Invalid credentials!" });
  }

  const user = User.getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ message: "Invalid password!" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, "secret_key", {
    expiresIn: "30m",
  });

  res.json({ token: token });
});

router.get("/", (req, res) => {
  res.status(200).json(User.getUsers());
});

router.get("/:id", (req, res) => {
  const user = User.getUserById(+req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  res.status(200).json(user);
});

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  if ((!name || !email, !password)) {
    return res.status(403).json({ message: "Invalid credentials!" });
  }

  const user = User.getUserByEmail(email);
  if (!user) {
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, salt);
    User.saveUser(name, email, hashedPass);

    return res.status(201).json({ message: "User created!" });
  }

  res.status(409).json({ message: "Email already used!" });
});

router.patch("/:id", auth, (req, res) => {
  const id = +req.params.id
  if (id != +req.userId) {
    return res.status(404).json({ message: "Invalid userID" });
  }
  const { name, email, password } = req.body;
  let user = User.getUserById(id);
  let hashedpassword;
  if(password){
    const salt = bcrypt.genSaltSync();
    hashedpassword = bcrypt.hashSync(password,salt)
  }
User.updateUser(
  id,
  name || user.name,
  email || user.email,
  password || hashedpassword
)

});

router.delete("/:id", (req, res) => {
  const user = User.getUserById(+req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  User.deleteUser(user.id);

  return res.status(200).json({ message: "User deleted!" });
});

router.get("/me", auth, (req,res) => {
  const user = User.getUserById(+req.userId);
  delete user.password;
  res.json(user);
})
export default router;