import { WishList } from "./wishlist_model.";
const add_WishList = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  WishList.findOne({ user: req.user._id }).exec((error, wishList) => {
    if (error) return res.status(400).json({ error });
    if (wishList) {
      const product = req.body.product;
      const item = wishList.WishListItems.find((c) => c.product == product);
      let condition, update;
      if (item) {
        condition = { user: req.user._id, "WishListItems.product": product };
        update = {
          $inc: {
            "WishListItems.$.quantity": 1,
          },
        };
      } else {
        condition = { user: req.user._id };
        update = {
          $push: {
            WishListItems: { product: product },
          },
        };
      }
      WishList.findOneAndUpdate(condition, update, { new: true }).exec(
        (error, wishList) => {
          if (error) return res.status(500).json({ error });
          if (wishList) {
            return res.status(200).json({ status: "Ok", data: wishList });
          }
        }
      );
    } else {
      //if WishList not exist then create a new WishList
      const wishList = new WishList({
        user: req.user._id,
        WishListItems: req.body,
      });
      wishList.save((error, wishList) => {
        if (error) return res.status(500).json({ error });
        if (wishList) {
          return res.status(201).json({
            data: wishList,
            message: "Item added Successfully",
            status: "Ok",
          });
        }
      });
    }
  });
};
const update_WishList = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  const product = req.body.product;
  let update;
  if (req.body.update === "add") {
    update = {
      $inc: {
        "WishListItems.$.quantity": 1,
      },
    };
  } else {
    try {
      const wishList = await WishList.findOne({ user: req.user._id });
      const item = wishList.WishListItems.find((c) => c.product == product);
      if (item.quantity === 1) {
        try {
          const wishList = await WishList.updateOne(
            { user: req.user._id },
            {
              $pull: {
                WishListItems: {
                  product: product,
                },
              },
            }
          );
          res.status(202).json({ message: "Deleted Successfully", wishList });
        } catch (error) {
          return res.status(400).json({ mesage: error });
        }
      } else {
        update = {
          $inc: {
            "WishListItems.$.quantity": -1,
          },
        };
      }
    } catch (error) {
      return res.status(400).json({ mesage: error });
    }
  }
  try {
    const wishList = await WishList.findOneAndUpdate(
      { user: req.user._id, "WishListItems.product": product },
      update,
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Updated Successfully", WishList: wishList });
  } catch (error) {
    return res.status(400).json({ mesage: error });
  }
};

// const paymentSuccess = async (req, res) => {
//   const { status } = req.query;
//   if(status === "true"){
//     const WishList = await WishList.findOneAndUpdate(
//       { user: req.user._id, "WishListItems.product": product },
//       update,
//       { new: true }
//     );
//     return res
//       .status(200)
//       .json({ message: "Updated Successfully", WishList: WishList });
//   }
// };

const view_WishList = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  const wishList = await WishList.findOne({ user: req.user._id }).populate(
    "WishListItems.product",
    "price featuredImage image sale_price title"
  );
  res.status(200).json(wishList);
};

const remove_product = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  const productId = req.params.id;
  const wishList = await WishList.findOne({ user: req.user._id });
  const product = wishList.WishListItems.find((c) => c.product == productId);
  if (!product) return res.status(400).json({ message: "Product Not Found" });
  if (productId) {
    WishList.updateOne(
      { user: req.user._id },
      {
        $pull: {
          WishListItems: {
            product: productId,
          },
        },
      }
    ).exec((error, wishList) => {
      if (error) return res.status(500).json({ error });
      if (wishList) {
        res.status(200).json({ status: "ok", message: "Deleted Successfully" });
      }
    });
  }
};

export { add_WishList, update_WishList, view_WishList, remove_product };
