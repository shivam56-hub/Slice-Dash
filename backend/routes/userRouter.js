const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


router.post("/",userController.createUser);
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  userController.getUsers
);
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  userController.getUser
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  userController.updateUser
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  userController.deleteUser
);

router.post("/login",userController.userLogin);
router.get("/profile",authMiddleware, userController.getProfile);


module.exports = router;