import { Router } from "express";
import { protect } from "../../util/auth";
import {
  addPage,
  updatePage,
  deletePage,
  getPages,
  getPage,
  getPageByUrl,
} from "./page_controller";

const router = Router();

router.route("/add_page").post(protect, addPage);
router.route("/update_page/:id").patch(protect, updatePage);
router.route("/delete_page/:id").delete(protect, deletePage);
router.route("/view_page/:id").get(getPage);
router.route("/view_page").get(getPages);
router.route("/view_pageByUrl").post(getPageByUrl);
export default router;
