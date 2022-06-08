import { Shipping } from "./shipping_model";
export const addShipping = async (req, res) => {
  // if (!req.user) {
  //   return res.status(400).json({ message: "User Not Found" });
  // }
  console.log(req.body);
  const shipping = new Shipping({
    name: req.body.name,
    description: req.body.description,
    rate: req.body.rate,
    country: req.body.country,
    state: req.body.state,
    status: req.body.status,
  });
  try {
    const data = await shipping.save();
    res.status(201).json({ message: "Success", data: data });
  } catch (error) {
    res.status(500).json({ message: error.message, message: "failed" });
  }
};
export const updateShipping = async (req, res) => {
  // if (!req.user) {
  //   return res.status(400).json({ message: "User Not Found" });
  // }
  const id = req.params.id;
  const queryObj = req.body;

  try {
    const data = await Shipping.findByIdAndUpdate(id, queryObj, {
      new: true,
    });
    res.status(200).json({ message: "Success", data: data });
  } catch (error) {
    res.status(500).json({ message: error.message, message: "failed" });
  }
};
export const deleteShipping = async (req, res) => {
  // if (!req.user) {
  //   return res.status(400).json({ message: "User Not Found" });
  // }
  const id = req.params.id;
  try {
    const data = await Shipping.findByIdAndDelete(id);
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ message: error.message, message: "failed" });
  }
};
export const getShipping = async (req, res) => {
  // if (!req.user) {
  //   return res.status(400).json({ message: "User Not Found" });
  // }

  try {
    const data = await Shipping.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Success", Shipping: data });
  } catch (error) {
    res.status(500).json({ message: error.message, message: "failed" });
  }
};
export const getShippingById = async (req, res) => {
  // if (!req.user) {
  //   return res.status(400).json({ message: "User Not Found" });
  // }

  try {
    const data = await Shipping.findById(req.params.id);
    res.status(200).json({ message: "Success", Shipping: data });
  } catch (error) {
    res.status(500).json({ message: error.message, message: "failed" });
  }
};
getShippingById;
