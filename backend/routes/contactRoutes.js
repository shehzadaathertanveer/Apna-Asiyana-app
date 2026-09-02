const express = require("express");
const { authenticatingLogin, authorizedRoles } = require("../middleware/auth");
const {
  sendMessage,
  getAllMessages,
  readMessage, 
} = require("../controllers/contactController");

const router = express.Router();

// Public route for form submission
router.post("/contact", sendMessage);

//------------dmin--------------------
router.get(
  "/admin/messages",
  authenticatingLogin,
  authorizedRoles("admin"),
  getAllMessages,
);

router.patch(
  "/admin/messages/:id/read",
  authenticatingLogin,
  authorizedRoles("admin"),
  readMessage,
);

module.exports = router;
