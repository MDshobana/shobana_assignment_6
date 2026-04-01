import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import db from "./employeeInfo.json" with { type: "json" };

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))   //middleware
app.use(cookieParser())  //middleware


app.use(cors({
    origin: [
      "http://localhost:5173",
      "https://shobana-assignment-6.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }));


app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});


const router = express.Router();

router.get('/health', (req, res) => res.json({ ok: true }));



// app.get('/api/health', (req, res) => res.json({ ok: true }));

const users = [
    {
        username: "shobana",
        password: "1234",
        id: 1,
    },
]

router.post('/login', (req, res) => {
    const user = users.find((usr) => usr.username === req.body.username);

    if (user) {
        if (user.password === req.body.password) {
            const token = jwt.sign({ userID: user.id }, "secret", { expiresIn: "1h" });
            return res.status(200).json({ accessToken: token, user: { id: user.id, username: user.username } });
        } else {
            res.status(401).send({ message: "access denied" })
        }
    } else {
        res.status(401).send({ message: "access denied" })
    }
});


function checkToken(req, res, next) {
    const authHeader = req.headers["authorization"] || "";

    const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;

    if (token) {
        jwt.verify(token, "secret", (err, decoded) => {
            if (err) {
                res.status(401).send({ message: "Access denied" });
                return;
            } else {
                req.userID = decoded.userID
                next()
            }
        })
    } else {
        res.status(401).send({ message: "Access denied" });
    }

}

router.get('/employee/:id', checkToken, (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" })

    const employee = db.employees.find((emp) => emp.id === id);
    console.log(employee);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ employee });
});


router.get("/attendance", checkToken, (req, res) => {
    const employeeId = Number(req.query.employeeId);
    if (Number.isNaN(employeeId)) {
        return res.status(400).json({ message: "employeeId is required" });
    }
    const attendance = db.attendance.filter((a) => a.employeeId === employeeId);
    res.json(attendance);
});


router.get("/tasks", checkToken, (req, res) => {
    const employeeId = Number(req.query.employeeId);
    if (Number.isNaN(employeeId)) {
        return res.status(400).json({ message: "employeeId is required" });
    }
    const tasks = db.tasks.filter((t) => t.employeeId === employeeId);
    res.json(tasks);
});






app.use("/api", router);


const PORT = process.env.PORT || 5000;


const server = app.listen(PORT, () => {
    console.log(`server started on http://localhost:${PORT}`);
});
