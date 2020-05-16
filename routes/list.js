const router = require("express").Router();
const User = require("../models/User");
const verify = require("../middlewares/verifytoken");

// ADD ITEM TO USER'S LIST
// header: "auth-token" = user's jwt-token
// body: JSON with item_name, category, variation (optional)
router.post("/add", verify, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) return res.status(400).send("No user matching this token.");

  const matchingIndex = user.list.findIndex(
    (ele) => ele.item_name === req.body.item_name
  );

  if (matchingIndex !== -1) {
    if (!req.body.variation)
      return res.status(400).send("Item already exists.");
    if (user.list[matchingIndex].variations.includes(req.body.variation))
      return res.status(400).send("Variation already exists");
    user.list[matchingIndex].variations.push(req.body.variation);
  } else {
    user.list.push({
      item_name: req.body.item_name,
      category: req.body.category,
      variations: req.body.variation ? [req.body.variation] : [],
    });
  }

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
router.post("/delete", verify, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) return res.status(400).send("No user matching this token.");

  const matchingIndex = user.list.findIndex(
    (ele) => ele.item_name === req.body.item_name
  );

  if (matchingIndex === -1)
    return res.status(400).send("Cannot delete item that is not in the list.");

  if (!req.body.variation) user.list.splice(matchingIndex, 1);
  else {
    const delIndex = user.list[matchingIndex].variations.indexOf(
      req.body.variation
    );
    if (delIndex === -1)
      return res
        .status(400)
        .send("Cannot delete variation that is not in the list");

    user.list[matchingIndex].variations.splice(delIndex, 1);
  }

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
  });
});

module.exports = router;
