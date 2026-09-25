const express = require("express");

const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  categoryController.createCategory,
);

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategory);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  categoryController.updateCategory,
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  categoryController.deleteCategory,
);

module.exports = router;
