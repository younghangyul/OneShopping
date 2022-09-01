const region = [
  {
    "_id": 1,
    "name": "남성의류"
  },
  {
    "_id": 2,
    "name": "여성의류"
  },
  {
    "_id": 3,
    "name": "도서"
  },
  {
    "_id": 4,
    "name": "디지털/가전"
  },
  {
    "_id": 5,
    "name": "스포츠/레저"
  },
  {
    "_id": 6,
    "name": "생활용품"
  },
  {
    "_id": 7,
    "name": "식료품"
  },
  {
    "_id": 8,
    "name": "뷰티/미용"
  },
  {
    "_id": 9,
    "name": "문구류"
  },
  {
    "_id": 10,
    "name": "액세서리"
  },
  {
    "_id": 11,
    "name": "티켓"
  },
  {
    "_id": 12,
    "name": "기타"
  }
]

const sold = [
  {
    '_id': 0,
    'name': '전체상품',
    'sold': []
  },
  {
    '_id': 1,
    'name': '판매중',
    'sold': [0]
  },
  {
    '_id': 2,
    'name': '판매완료',
    'sold': [1]
  }
]

const price = [
  {
    "_id": 0,
    "name": "Any",
    "array": []
  },
  {
    "_id": 1,
    "name": "0원 - 1만원",
    "array": [0, 10000]
  },
  {
    "_id": 2,
    "name": "1만원 - 5만원",
    "array": [10001, 50000]
  },
  {
    "_id": 3,
    "name": "5만원 - 10만원",
    "array": [50001, 100000]
  },
  {
    "_id": 4,
    "name": "10만원 - 30만원",
    "array": [100001, 300000]
  },
  {
    "_id": 5,
    "name": "30만원 이상",
    "array": [300001, 11111111]
  }
]

export {
  region,
  price,
  sold
}