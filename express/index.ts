import express, { Application, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv/config";


interface User {
  username: string;
  password: string;
}

const app: Application = express();
app.use(express.json());


const users: User[] = [];

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await authenticateUser(username, password);
    const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: "1h" });
    res.set("Authorization", `Bearer ${token}`).sendStatus(200);
  } catch (err: any) {
    res.status(401).send({ error: err.message });
  }
});

async function authenticateUser(username: string, password: string): Promise<{ username: string }> {
  const user = users.find((user) => user.username === username);
  if (!user) throw new Error("Invalid credentials");

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new Error("Invalid credentials");

  return { username: user.username };
}

app.post("/signup", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    await createUser(username, password);
    res.send({ message: "User created!" });
  } catch (err: any) {
    res.status(500).send({ error: err.message });
  }
});

async function createUser(username: string, password: string): Promise<User> {
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) throw new Error("Name taken!");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = { username, password: hashedPassword };
  users.push(newUser);
  return newUser;
}

app.listen(3000, () => console.log("Server running on port 3000"));
