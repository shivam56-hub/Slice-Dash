const express = require("express");

const pizzaController = require("../controllers/pizzaController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, pizzaController.createPizza);

router.get("/", pizzaController.getPizzas);

router.get("/:id", pizzaController.getPizza);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  pizzaController.updatePizza,
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  pizzaController.deletePizza,
);

module.exports = router;
