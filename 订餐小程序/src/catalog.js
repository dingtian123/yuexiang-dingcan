const spicy = {
  name: '辣度',
  required: true,
  multiple: false,
  options: ['不辣', '微辣', '中辣', '重辣'],
}
const avoid = {
  name: '忌口',
  required: false,
  multiple: true,
  options: ['不要葱', '不要蒜', '不要香菜', '不要辣'],
}
const avoidMild = {
  name: '忌口',
  required: false,
  multiple: true,
  options: ['不要葱', '不要蒜', '不要香菜'],
}

function dish(id, categoryId, name, price, description, sales, tone, flavors = []) {
  return { id, kind: 'dish', categoryId, name, price, description, sales, tone, flavors }
}

export const shop = {
  name: '悦享订餐',
  branch: '川味小馆',
  slogan: '现做川菜，米饭可续',
  address: '上海市徐汇区衡山路 88 号',
  phone: '021-64018826',
  phoneHref: 'tel:02164018826',
  hours: '10:00–22:00',
  eta: 32,
  minAmount: 20,
  deliveryFee: 6,
  freeDelivery: 48,
  packEach: 1,
  city: '上海市',
  districts: ['徐汇区', '长宁区', '静安区', '黄浦区', '普陀区', '虹口区', '杨浦区', '浦东新区'],
}

export const categories = [
  { id: 'sign', name: '招牌' },
  { id: 16, name: '蜀味烤鱼' },
  { id: 17, name: '蜀味牛蛙' },
  { id: 18, name: '特色蒸菜' },
  { id: 19, name: '新鲜时蔬' },
  { id: 20, name: '水煮鱼' },
  { id: 12, name: '传统主食' },
  { id: 11, name: '酒水饮料' },
  { id: 21, name: '汤类' },
  { id: 'set', name: '套餐' },
]

export const dishes = [
  dish(46, 11, '王老吉', 6, '怕上火就喝王老吉', 520, 'drink'),
  dish(47, 11, '北冰洋', 4, '还是小时候的味道', 430, 'drink'),
  dish(48, 11, '雪花啤酒', 4, '冰镇更好喝', 210, 'drink'),
  dish(49, 12, '米饭', 2, '精选五常大米，可以续', 980, 'staple'),
  dish(50, 12, '馒头', 1, '优质面粉，松软', 140, 'staple'),
  dish(51, 20, '老坛酸菜鱼', 56, '汤、草鱼、酸菜', 360, 'boil', [spicy, avoid]),
  dish(52, 20, '经典酸菜鮰鱼', 66, '酸菜、江团、鮰鱼', 410, 'boil', [spicy, avoid]),
  dish(53, 20, '蜀味水煮草鱼', 38, '草鱼配鲜汤', 290, 'boil', [spicy, avoid]),
  dish(54, 19, '清炒小油菜', 18, '时令小油菜', 220, 'veg', [avoidMild]),
  dish(55, 19, '蒜蓉娃娃菜', 18, '蒜香娃娃菜', 260, 'veg'),
  dish(56, 19, '清炒西兰花', 18, '西兰花清炒', 180, 'veg', [avoid]),
  dish(57, 19, '炝炒圆白菜', 18, '圆白菜，干香', 150, 'veg', [avoid]),
  dish(58, 18, '清蒸鲈鱼', 98, '鲜鲈鱼，原味清蒸', 96, 'steam'),
  dish(59, 18, '东坡肘子', 138, '慢火扣炖猪肘', 188, 'steam'),
  dish(60, 18, '梅菜扣肉', 58, '猪肉、梅菜', 240, 'steam', [avoid]),
  dish(61, 18, '剁椒鱼头', 66, '鲢鱼头、剁椒', 175, 'steam', [spicy]),
  dish(62, 17, '金汤酸菜牛蛙', 88, '鲜活牛蛙、酸菜', 310, 'frog', [spicy]),
  dish(63, 17, '香锅牛蛙', 88, '牛蛙、莲藕、青笋', 270, 'frog', [spicy]),
  dish(64, 17, '馋嘴牛蛙', 88, '牛蛙、丝瓜、黄豆芽', 198, 'frog', [spicy]),
  dish(65, 16, '草鱼 2 斤', 68, '草鱼、黄豆芽、莲藕', 340, 'fish', [spicy]),
  dish(66, 16, '江团 2 斤', 119, '江团、黄豆芽、莲藕', 126, 'fish', [spicy]),
  dish(67, 16, '鮰鱼 2 斤', 72, '鮰鱼、黄豆芽、莲藕', 154, 'fish', [spicy]),
  dish(68, 21, '鸡蛋汤', 4, '鸡蛋、紫菜', 410, 'soup'),
  dish(69, 21, '平菇豆腐汤', 6, '豆腐、平菇', 188, 'soup'),
]

export const SIGN_IDS = [59, 65, 62, 52]

export const setmeals = [
  {
    id: 101,
    kind: 'setmeal',
    name: '双人烤鱼套餐',
    price: 86,
    tag: '人气',
    description: '草鱼 2 斤、蒜蓉娃娃菜、米饭 ×2、北冰洋 ×2',
    sales: 132,
    tone: 'feast',
    flavors: [],
    items: [
      { name: '草鱼 2 斤', copies: 1 },
      { name: '蒜蓉娃娃菜', copies: 1 },
      { name: '米饭', copies: 2 },
      { name: '北冰洋', copies: 2 },
    ],
  },
  {
    id: 102,
    kind: 'setmeal',
    name: '商务简餐',
    price: 49,
    tag: '商务',
    description: '梅菜扣肉、米饭、鸡蛋汤',
    sales: 268,
    tone: 'steam',
    flavors: [],
    items: [
      { name: '梅菜扣肉', copies: 1 },
      { name: '米饭', copies: 1 },
      { name: '鸡蛋汤', copies: 1 },
    ],
  },
  {
    id: 103,
    kind: 'setmeal',
    name: '家庭分享餐',
    price: 149,
    tag: '人气',
    description: '东坡肘子、清炒西兰花、米饭 ×3、王老吉',
    sales: 74,
    tone: 'feast',
    flavors: [],
    items: [
      { name: '东坡肘子', copies: 1 },
      { name: '清炒西兰花', copies: 1 },
      { name: '米饭', copies: 3 },
      { name: '王老吉', copies: 1 },
    ],
  },
]

export function findProduct(kind, id) {
  const list = kind === 'setmeal' ? setmeals : dishes
  return list.find((item) => item.id === id) || null
}

export function productsIn(categoryId) {
  if (categoryId === 'sign') return SIGN_IDS.map((id) => dishes.find((item) => item.id === id))
  if (categoryId === 'set') return setmeals
  return dishes.filter((item) => item.categoryId === categoryId)
}

export function searchProducts(query) {
  const keyword = query.trim().toLowerCase()
  if (!keyword) return productsIn('sign')
  return [...dishes, ...setmeals].filter((item) => {
    return item.name.toLowerCase().includes(keyword) || item.description.toLowerCase().includes(keyword)
  })
}

export const REMARKS = ['少放辣', '不要香菜', '多要米饭', '放门口', '来电勿敲门']
