const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("./db/mongoose");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://127.0.0.1:3000"], credentials: true }));

app.get("/test", (req, res) => {
  res.send("This is working :)");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server started on port ", port);
});

// set up routes

app.use("/auth", require("./routers/userRouter"));
app.use("/user", require("./routers/taskRouter"));
