import { Cart } from "./cart_model";
const add_cart = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  Cart.findOne({ user: req.user._id }).exec((error, cart) => {
    if (error) return res.status(400).json({ error });
    if (cart) {
      const product = req.body.product;
      const item = cart.cartItems.find((c) => c.product == product);
      let condition, update;
      if (item) {
        condition = { user: req.user._id, "cartItems.product": product };
        update = {
          $inc: {
            "cartItems.$.quantity": 1,
          },
        };
      } else {
        condition = { user: req.user._id };
        update = {
          $push: {
            cartItems: { product: product },
          },
        };
      }
      Cart.findOneAndUpdate(condition, update, { new: true }).exec(
        (error, cart) => {
          if (error) return res.status(500).json({ error });
          if (cart) {
            return res.status(200).json({ status: "Ok", data: cart });
          }
        }
      );
    } else {
      //if cart not exist then create a new cart
      const cart = new Cart({
        user: req.user._id,
        cartItems: req.body,
      });
      cart.save((error, cart) => {
        if (error) return res.status(500).json({ error });
        if (cart) {
          return res.status(201).json({
            data: cart,
            message: "Item added Successfully",
            status: "Ok",
          });
        }
      });
    }
  });
};
const update_cart = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  const product = req.body.product;
  let update;
  if (req.body.update === "add") {
    update = {
      $inc: {
        "cartItems.$.quantity": 1,
      },
    };
  } else {
    try {
      const cart = await Cart.findOne({ user: req.user._id });
      const item = cart.cartItems.find((c) => c.product == product);
      if (item.quantity === 1) {
        try {
          const cart = await Cart.updateOne(
            { user: req.user._id },
            {
              $pull: {
                cartItems: {
                  product: product,
                },
              },
            }
          );
          res.status(202).json({ message: "Deleted Successfully", cart });
        } catch (error) {
          return res.status(400).json({ mesage: error });
        }
      } else {
        update = {
          $inc: {
            "cartItems.$.quantity": -1,
          },
        };
      }
    } catch (error) {
      return res.status(400).json({ mesage: error });
    }
  }
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id, "cartItems.product": product },
      update,
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Updated Successfully", cart: cart });
  } catch (error) {
    return res.status(400).json({ mesage: error });
  }
};

const paymentSuccess = async (req, res) => {
  const { status } = req.query;
  if (status === "true") {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id, "cartItems.product": product },
      update,
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Updated Successfully", cart: cart });
  }
};

const view_cart = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "cartItems.product",
    "price featuredImage image sale_price title"
  );
  res.status(200).json(cart);
};

const remove_product = async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  const productId = req.params.id;
  const cart = await Cart.findOne({ user: req.user._id });
  const product = cart.cartItems.find((c) => c.product == productId);
  if (!product) return res.status(400).json({ message: "Product Not Found" });
  if (productId) {
    Cart.updateOne(
      { user: req.user._id },
      {
        $pull: {
          cartItems: {
            product: productId,
          },
        },
      }
    ).exec((error, cart) => {
      if (error) return res.status(500).json({ error });
      if (cart) {
        res.status(200).json({ status: "ok", message: "Deleted Successfully" });
      }
    });
  }
};

export { add_cart, update_cart, view_cart, remove_product, paymentSuccess };
