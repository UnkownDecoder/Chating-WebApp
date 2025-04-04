import express from "express";
import { ProtectRoute } from "../middleware/auth.middleware.js";
import {createGroup, getGroups, sendGroupMessage, getGroupMessage,} from "../controllers/groupController.js" ;
import Group from "../models/group.model.js";
import upload  from "../library/multer.js";

const router = express.Router();


router.post( "/create", ProtectRoute,upload.single("profileImage"),createGroup);

router.get("/my-groups", ProtectRoute,getGroups);

router.post("/send/:groupId", ProtectRoute, upload.single("file"),sendGroupMessage);

router.get("/messages/:groupId", ProtectRoute, getGroupMessage);

export default router;
