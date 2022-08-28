const region = [
  {
    "_id": 1,
    "name": "신촌"
  },
  {
    "_id": 2,
    "name": "모시래"
  },
  {
    "_id": 3,
    "name": "단월"
  },
  {
    "_id": 4,
    "name": "기숙사-모시래"
  },
  {
    "_id": 5,
    "name": "기숙사-해오름"
  }
]

const sold = [
  {
    '_id': 1,
    'name': '판매완료'
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