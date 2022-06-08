import { Router } from "express";
import { protect } from "../../util/auth";
import {
  addShipping,
  updateShipping,
  deleteShipping,
  getShipping,
  getShippingById,
} from "./shipping_controller";
const router = Router();

router.route("/add_Shipping").post(addShipping);
router.route("/update_Shipping/:id").patch(updateShipping);
router.route("/delete_Shipping/:id").delete(deleteShipping);
router.route("/view_Shipping").get(getShipping);
router.route("/view_Shipping/:id").get(getShippingById);
export default router;
