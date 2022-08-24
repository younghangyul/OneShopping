const express = require('express');
const router = express.Router();
const multer = require('multer');
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");
const { response } = require('express');


//=================================
//             User
//=================================

const storage = multer.diskStorage({  
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const upload = multer({ storage: storage }).single('file')

router.post('/image', (req, res) => {
  // 가져온 이미지 저장
  upload(req, res, err => {
    if(err) {
      return req.json({success: false, err})
    }
    return res.json({success: true, filePath: res.req.file.path , fileName: res.req.file.filename})
  })
})

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    });
});


router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/user", (req, res) => {
  // users 콜렉션에 있는 유저 정보 가져오기
  User.findOne({ _id: req.body.userId })
    .exec((err, userInfo) => {
      if(err) return res.status(400).json({success: false, err})
      return res.status(200).json({success: true, userInfo})
    })
});

router.patch("/profile", (req, res) => {

  const Body = req.body
  const userId = req.body.userId

  User.findOne({_id: userId}, (err, user) => {
    if(err) return res.status(400).json({success: false});

    user.images= Body.images;
    
    user.save((err, next) => {
      if(err) return res.status(400).json({success: false})
      return res.status(200).json({ success: true, next })
    })
  })
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

module.exports = router;
