const router = require("express").Router();
const User = require("../models/User");
const verify = require("../middlewares/verifytoken");
const { removeItemFromList, addItemToList } = require("../utilities");

// ADD ITEM TO USER'S LIST
// header: "auth-token" = user's jwt-token
// body: JSON with item_name, category, variation (optional)
router.post("/addToList", verify, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  const userWishList = user.wishList;
  const userList = user.list;
  const item = {
    itemName: req.body.item_name,
    category: req.body.category,
    variation: req.body.variation,
  };

  if (!user)
    return res
      .status(400)
      .send({ error: "Login session has expired. Please log in again." });

  removeItemFromList(userWishList, item);
  addItemToList(userList, item);

  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

// ADD ITEM TO USER'S WISHLIST
// header: "auth-token" = user's jwt-token
// body: JSON with item_name, category, variation (optional)
router.post("/addToWishList", verify, async (req, res) => {
  console.log("1");
  const user = await User.findOne({ _id: req.user._id });
  const item = {
    itemName: req.body.item_name,
    category: req.body.category,
    variation: req.body.variation,
  };

  if (!user)
    return res
      .status(400)
      .send({ error: "Login session has expired. Please log in again." });

  removeItemFromList(user.wishList, item);
  addItemToList(user.list, item);

  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

// DELETE ITEM FROM USER'S LIST
// header: "auth-token" = user's jwt-token
// body: JSON with item_name, category, variation (optional)
// If variation provided, deletes that variation. If not provided, deletes entire item.
router.post("/listDelete", verify, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  const item = {
    itemName: req.body.item_name,
    category: req.body.category,
    variation: req.body.variation,
  };

  if (!user) return res.status(400).send("No user matching this token.");

  removeItemFromList(user.list, item);

  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

// DELETE ITEM FROM USER'S WISH LIST
// header: "auth-token" = user's jwt-token
// body: JSON with item_name, category, variation (optional)
// If variation provided, deletes that variation. If not provided, deletes entire item.
router.post("/wishDelete", verify, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  const item = {
    itemName: req.body.item_name,
    category: req.body.category,
    variation: req.body.variation,
  };

  if (!user)
    return res.status(400).send({ error: "No user matching this token." });

  removeItemFromList(user.wishList, item);

  try {
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

// GET the list of user with given user name.
router.get("/:userName", async (req, res) => {
  const user = await User.findOne({ name: req.params.userName });
  if (!user) return res.status(400).send("No user matching this user name.");

  res.json({
    name: user.name,
    list: user.list,
    wishList: user.wishList,
  });
});

module.exports = router;
