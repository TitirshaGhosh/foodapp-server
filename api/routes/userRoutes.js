const express = require("express");
const router = express.Router();
const verifytoken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

const userController = require("../controllers/userController");
// router.get("/",  userController.getAllUsers);
router.get("/", verifytoken, verifyAdmin, userController.getAllUsers);
router.post("/", userController.createUser);
// router.delete("/:id", verifytoken,userController.deleteUser);
router.delete("/:id", verifytoken, verifyAdmin, userController.deleteUser);
// router.get("/admin/:email",verifytoken, userController.getAdmin);
router.get("/admin/:email", verifytoken, userController.getAdmin);
// router.patch("/admin/:id",verifytoken, userController.makeAdmin);
router.patch("/admin/:id", verifytoken, verifyAdmin, userController.makeAdmin);

router.patch("/:id", userController.updateUser);


module.exports = router;