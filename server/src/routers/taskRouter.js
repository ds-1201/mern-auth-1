const router = require("express").Router();
// const Task = require("../models/task");
const auth = require("./../middleware/auth");
const User = require("../models/user");

// router.post("/", async (req, res) => {
//     try {
//         const body = req.body;

//     }
//     catch (err) {
//         console.error(err);
//         res.status(500).send();
//       }
// })

router.get("/info", auth, async (req, res) => {
  try {
    const _id = req.user;
    const user = await User.findOne({ _id: _id });
    console.log(user);
    res.json({
      name: user.fName + " " + user.lName,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;
