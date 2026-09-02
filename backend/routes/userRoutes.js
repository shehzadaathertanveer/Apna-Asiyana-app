const express = require("express");
const upload = require("../middleware/multer");
const {
  registerNewUSer,
  userLogin,
  logoutUser,
  getUserDetailsForUser,
  forgotPasswordSendMailCode,
  resetUserPasswordFromLink,
  updateUserData,
  UpdatesUserPassword,
  deleteUserAccount,
  getMyFavorites,
  toggleFavorite,
  getAllUsers,
  getUserDetailsAdmin,
  deleteUserAdmin,
  changeUserRole,
} = require("../controllers/userController");
const { authenticatingLogin, authorizedRoles } = require("../middleware/auth");

const router = express.Router();

// routes ------------------------ user ------------------------------------

router.route("/register").post(upload.single("avatar"), registerNewUSer);
router.route("/login").post(userLogin);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPasswordSendMailCode);
router.route("/password/reset/:token").put(resetUserPasswordFromLink);

// ---------------protected user routes -------------------

router.route("/me").get(authenticatingLogin, getUserDetailsForUser);
router
  .route("/me/update")
  .put(authenticatingLogin, upload.single("avatar"), updateUserData);
router
  .route("/me/update/password")
  .put(authenticatingLogin, UpdatesUserPassword);
router.route("/me/delete").delete(authenticatingLogin, deleteUserAccount);
router
  .route("/me/favorites")
  .get(authenticatingLogin, getMyFavorites)
  .put(authenticatingLogin, toggleFavorite);

//------------------------------------admin-------------------------------------

router
  .route("/admin/users")
  .get(authenticatingLogin, authorizedRoles("admin"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(authenticatingLogin, authorizedRoles("admin"), getUserDetailsAdmin)
  .put(authenticatingLogin, authorizedRoles("admin"), changeUserRole)
  .delete(authenticatingLogin, authorizedRoles("admin"), deleteUserAdmin);

module.exports = router;
