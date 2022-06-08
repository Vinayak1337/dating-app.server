import { Router } from "express";
import { protect } from "../../util/auth";

import {
  update_WishList,
  view_WishList,
  remove_product,
  add_WishList,
} from "./wishlist_contoller";
const router = Router();
router.post("/update_product", update_WishList);
router.post("/add_product", add_WishList);
router.get("/view_WishList", view_WishList);
// router.patch("/payment_success",paymentSuccess);
router.delete("/remove_product/:id", remove_product);

export default router;
