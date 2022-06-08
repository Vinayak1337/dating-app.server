import { Router } from "express";
import { protect } from "../../util/auth";

import {
  update_cart,
  view_cart,
  remove_product,
  add_cart,
  paymentSuccess,
} from "./cart_contoller";
const router = Router();
router.post("/update_product", update_cart);
router.post("/add_product", add_cart);
router.get("/view_cart", view_cart);
router.patch("/payment_success", paymentSuccess);
router.delete("/remove_product/:id", remove_product);

export default router;
