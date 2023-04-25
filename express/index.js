var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const app = express();
app.use(express.json());
const users = [];
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield authenticateUser(username, password);
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.set("Authorization", `Bearer ${token}`).sendStatus(200);
    }
    catch (err) {
        res.status(401).send({ error: err.message });
    }
}));
function authenticateUser(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = users.find((user) => user.username === username);
        if (!user)
            throw new Error("Invalid credentials");
        const passwordMatch = yield bcrypt.compare(password, user.password);
        if (!passwordMatch)
            throw new Error("Invalid credentials");
        return { username: user.username };
    });
}
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        yield createUser(username, password);
        res.send({ message: "User created!" });
    }
    catch (err) {
        res.status(500).send({ error: err.message });
    }
}));
function createUser(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUser = users.find((user) => user.username === username);
        if (existingUser)
            throw new Error("Name taken!");
        const hashedPassword = yield bcrypt.hash(password, 10);
        const newUser = { username, password: hashedPassword };
        users.push(newUser);
        return newUser;
    });
}
app.listen(3000, () => console.log("Server running on port 3000"));
