import { Router } from "express";
import * as User from "../data/user.js";
import bcrypt from "bcrypt";

const router = Router();

const users = User.getUsers();

router.get("/", (req, res) => {
    res.status(200).json(users);
});

router.get("/:id", (req, res) => {
  const user = User.getUsers(+req.params.id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

router.post("/login", (req,res)=> {
  const {name,  email, password } = req.body;
  if (!email || !password, !name) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const user = User.getUserByEmail(email);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  if (!bcrypt.compareSync(password, name, user.password)) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  res.json(user);
})
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Invalid data" });
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const saved = User.saveUser(email, name ,hashedPassword);
    const user = User.getUserById(saved.lastInsertRowid);
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

router.put("/:id", (req, res) => {
  const id = +req.params.id;
  let user = users.find(e => e.id == id)
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const {email,password, name} = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: "email or password or name is missing" });
  }
  const index = users.indexOf(user);
  users = { ...users, name, email, password};
  users[index] = user;
  return res.status(200).json(user);
});
router.delete("/:id", (req, res) => {
  const id = +req.params.id;
  const user = users.filter((e) => e.id == id)
  User.deleteUser(user)
  res.status(200).json(message = "Customer deleted!")
});

router.use((err, req, res, next) => {
  if (err) res.status(500).json({ error: err.message });
});

export default router;
