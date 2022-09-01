const express = require('express');
const router = express.Router();
const multer = require('multer');
const {Product} = require('../models/Product');


//=================================
//             Product
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

router.post('/', (req, res) => {
  // 받아온 정보를 DB에 넣어준다.
  const product = new Product(req.body)

  product.save((err) => {
    if(err) return res.status(400).json({success: false, err})
    return res.status(200).json({success: true})
  })
})

router.post('/product_by_id', (req, res) => {
  // 받아온 정보를 DB에 넣어준다.
  const product = new Product(req.body)

  product.save((err) => {
    if(err) return res.status(400).json({success: false, err})
    return res.status(200).json({success: true})
  })
})

router.patch('/edit/:productId', (req, res) => {
  const {productId} = req.params
  const Body = req.body
  
  Product.findOne({ _id: productId }, (err, product) => {
    if(err) return res.status(400).json({success: false});
    
    product.title= Body.title
    product.description= Body.description
    product.price= Body.price
    product.region= Body.region
    product.image= Body.image
    
    product.save((err, next) => {
      if(err) return res.status(400).json({success: false})
      return res.status(200).json({ success: true, next })
    })
  })
})

router.delete('/:productId', (req, res, next) => {
  const {productId} = req.params
  
  Product.findOneAndDelete({_id: productId}).exec((err, doc) => {
    if(err) return res.status(400).json({success: false, err})
    return res.status(200).json({ success: true, doc })
  })
})

router.patch('/sold', (req, res) => {
  const productId = req.body.productId

  Product.findOne({_id: productId}).exec((err, product) => {
    if(err) return res.status(400).json({success: false, err})

    product.sold= 1
    product.save((err, product) => {
      if(err) return res.status(400).json({success: false})
      return res.status(200).json({ success: true, product })
    })
  })
})

router.post('/sellingProduct', (req, res) => {
  const userId = req.body.userId
  
  Product.find({writer: userId})
    .exec((err, productInfo) => {
      if (err) return res.status(400).json({success: false, err})
      return res.status(200).json({success: true, productInfo})
    })
})

router.post('/products', (req, res) => {

  // product collection에 들어있는 모든 상품 점보 가져오기
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.serachTerm

  let findArgs = {};

  for(let key in req.body.filters) {
    if(req.body.filters[key].length > 0) {
      if(key === 'price') {
        findArgs[key] = {
          // Greater then equal  0보다 크거나 같고
          $gte: req.body.filters[key][0], 
          // Less then equal     1보다 작거나 같은
          $lte: req.body.filters[key][1]  
        }
      }
      else if(key === 'sold') {
        findArgs[key] = req.body.filters[key]
      }
       else {
        findArgs[key] = req.body.filters[key]
      }
    }
  }
    //검색을 했다면 검색한 결과를 도출, 아니면 기존 제품 출력
    if(term) {
      Product.find(findArgs)
      .find({$text: {$search: term}})
      .populate("writer")
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if(err) return res.status(400).json({success: false, err})
        return res.status(200).json({
          success: true, productInfo,
          postSize: productInfo.length 
        })
      })
    } else {
      Product.find(findArgs)
      .populate("writer")
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if(err) return res.status(400).json({success: false, err})
        return res.status(200).json({
          success: true, productInfo,
          postSize: productInfo.length 
        })
      })
    }
  }  
)

router.get('/product_by_id', (req, res) => {

  let type = req.query.type
  let productId = req.query.id

  // productId를 이용해서 DB에서 상품 정보를 가져온다.
  Product.find({ _id: productId })
    .populate('writer')
    .exec((err, product) => {
      if(err) return res.status(400).send(err)
      return res.status(200).send({success: true, product})
    })
})


module.exports = router;