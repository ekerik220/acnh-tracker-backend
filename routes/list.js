const router = require("express").Router();
const User = require("../models/User");
const verify = require("./verifytoken");

// ADD ITEM TO USER'S LIST
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
  user.save((err, doc) => {
    if (err) return res.status(400).send(err);
    else res.send(doc);
  });
});

module.exports = router;
