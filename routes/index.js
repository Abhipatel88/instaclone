var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");

const passport = require("passport");
const localStrategy = require("passport-local");
const upload = require("./multer");
passport.use(new localStrategy(userModel.authenticate())); // is line se banda login ho raha hai
router.get("/", function (req, res) {
  res.render("index", { footer: false });
});

router.get("/login", function (req, res) {
  res.render("login", { footer: false });
});

router.get("/feed", isLoggedIn,async function (req, res) {
  const posts =await postModel.find().populate("user");
  

  res.render("feed", { footer: true });
});

router.get("/profile", isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user }).populate("posts")
  res.render("profile", { footer: true, user });
});

router.get("/search", isLoggedIn, function (req, res) {
  res.render("search", { footer: true });
});
router.get("/upload", isLoggedIn, function (req, res) {
  res.render("upload", { footer: true, user });
});

router.get("/edit", isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render("edit", { footer: true , user });
});
router.post("/register", (req, res, next) => {
  const userdata = new userModel({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
  });

  userModel
    .register(userdata, req.body.password) // abtak apna user ban gaya hai lekin abhi ovo logged-in nahi rahega iske liye hume passport use karna hoga
    .then(function (registereduser) {
      // it return pormises
      passport.authenticate("local")(req, res, function () {
        // lis line se user ki process hogi login ke liye passport ko use karne se apna user logged-in rahega hamsa ke liye
        res.redirect("/profile");
      });
    });
});

router.post(
  "/login",
  passport.authenticate("local", {
    // passport.authenticate("local", mean username and password ke base pe login karo
    successRedirect: "/profile", //  successRedirect:"/profile" mean jo data sahi ho to profile pe redirct karo
    failureRedirect: "/login", // failureRedirect:"/login" mean galat data ho to login pe hi rakho
  }),
  function (req, res) {}
);

router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  //  isLoggedIn iska matalb hai ki ye jaha bhi laga hoga us jagah hum sidha login ke bina nahi ja sakte hai is hum feed pe laga ye ge to bina login ke hum enter nahi kar skate
  if (req.isAuthenticated()) return next();
  else {
    res.redirect("/login");
  }
}

router.post("/update", upload.single("image"), async (req, res) => {
  const user = await userModel.findOneAndUpdate(
    { username: req.session.passport.user },
    { username: req.body.username, name: req.body.name, bio: req.body.bio },
    { new: true }
  ); // ye line ks mstlab hai ki hame vo user milta hai jiska hum profile update kar rahe hai
  // if (req.file>0) {
    user.profileImage = rew.file.filename;
  
  await user.save();
  res.redirect("/profile");
});


router.post("/upload",isLoggedIn,upload.single("image"),async (req,rea)=>{
   const user = await userModel.findOne({username:req.session.passport.user})
   const post =   await postModel.create({
    picture:req.file.filename,
    user:user._id,
    caption:req.body.caption
   })
   user.post.push(post._id);
   await user.save()
   res.redirect("/feed")

})
module.exports = router;
