import { Router } from "express";
import {
  addCoupon,
  getCoupon,
  getCoupons,
  deleteCoupon,
  editCoupon,
} from "./Coupon_controller";
import { protect } from "../../util/auth.js";

const router = Router();

router.route("/").get(getCoupons);
router
  .route("/:id")
  .get(getCoupon)
  .delete(protect, deleteCoupon)
  .patch(protect, editCoupon);
router.route("/add").post(protect, addCoupon);

export default router;
