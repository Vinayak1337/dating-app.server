import { Router } from "express";
import {
  deleteFeatured,
  editFeaturedProducts,
  getFeaturedProduct,
  getFeaturedProducts,
  postFeaturedProducts,
} from "./FeaturedProduct_controller";
import { upload } from "../../util/s3-spaces";
import { protect } from "../../util/auth";
const router = Router();

router
  .route("/")
  .get(getFeaturedProducts)
  .post(protect, upload.single("image"), postFeaturedProducts);
router
  .route("/:id")
  .get(getFeaturedProduct)
  .delete(protect, deleteFeatured)
  .patch(protect, upload.single("image"), editFeaturedProducts);

export default router;
