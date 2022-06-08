import { Router } from "express";
import { getLanguagesList } from "./language.controllers";
const router = Router();

router.get("/", getLanguagesList);

export default router;
