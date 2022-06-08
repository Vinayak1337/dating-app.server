import { Router } from "express";
import { protect } from "../../util/auth";
import {
  deleteOrderAll,
  getAllOrders,
  getOrderById,
  getuserOrders,
  makeOrder,
  updateOrder,
  getAllProcessingOrders,
  getAllDispatchedOrders,
  getAllDeliveredOrders,
  getAllCancelledOrders,
  getAllReturnedOrders,
  updateOrderStatus,
  getUserOrderAdmin,
} from "./Order_controller";

const router = Router();

router.route("/user_order").get(protect, getuserOrders);
router.route("/admin/user_order/:id").get(protect, getUserOrderAdmin);
router.route("/").get(getAllOrders);
router.route("/processing").get(getAllProcessingOrders);
router.route("/dispatched").get(getAllDispatchedOrders);
router.route("/delivered").get(getAllDeliveredOrders);
router.route("/cancelled").get(getAllCancelledOrders);
router.route("/returned").get(getAllReturnedOrders);
router.route("/:id").get(getOrderById);
router.route("/delete").delete(deleteOrderAll);
router.route("/add_order").post(protect, makeOrder);
router.route("/update_order/:id").patch(updateOrder);
router.route("/update_orderStatus").patch(updateOrderStatus);

export default router;
