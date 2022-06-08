import { Router } from "express";
import { protect } from "../../util/auth";
import { upload } from "../../util/s3-spaces";
import {
  add_category,
  view_category,
  view,
  update_category,
  delete_category,
  deleteAll,
} from "./Category_controller";

const router = Router();

router.route("/").get(view).post(protect, upload.single("image"), add_category);
router.route("/all").delete(protect, deleteAll);
router
  .route("/:id")
  .get(view_category)
  .patch(protect, upload.single("image"), update_category)
  .delete(protect, delete_category);

export default router;
