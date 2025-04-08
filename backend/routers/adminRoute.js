import express from "express";
const router = express.Router();
import { getAllUsers,getAllGroups ,getAllMessages,getAllGroupsMessages} from "../controllers/adminController.js";

router.get("/users", getAllUsers);
router.get("/groups", getAllGroups);
router.get("/userMessages", getAllMessages);
router.get("/groupMessages", getAllGroupsMessages);

export default router;
