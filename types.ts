export interface Pizza {
  id: number;
  name: string;
  price: number;
  description: string;
  emoji: string;
  tags: string[];
}

export interface CartItem {
  pizzaId: number;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  address: string;
  city: string;
  status: 'preparing' | 'on-the-way' | 'delivered';
}

export interface User {
  username: string;
  points: number;
  orderHistory: Order[];
}

export const PIZZAS: Pizza[] = [
  {
    id: 1,
    name: "Margherita",
    price: 12,
    description: "Classic tomato sauce, fresh mozzarella, and aromatic basil.",
    emoji: "🍕",
    tags: ["vegetarian", "cheese"]
  },
  {
    id: 2,
    name: "Pepperoni",
    price: 14,
    description: "Zesty pepperoni slices with melted mozzarella on a crispy crust.",
    emoji: "🌶️",
    tags: ["spicy", "meat"]
  },
  {
    id: 3,
    name: "Veggie Supreme",
    price: 15,
    description: "Loaded with bell peppers, onions, mushrooms, and black olives.",
    emoji: "🥦",
    tags: ["vegetarian", "vegan-option"]
  },
  {
    id: 4,
    name: "BBQ Chicken",
    price: 16,
    description: "Grilled chicken, tangy BBQ sauce, and red onions.",
    emoji: "🍗",
    tags: ["meat", "savory"]
  },
  {
    id: 5,
    name: "Hawaiian",
    price: 14,
    description: "The classic sweet and savory mix of ham and pineapple.",
    emoji: "🍍",
    tags: ["meat", "sweet-savory"]
  },
  {
    id: 6,
    name: "Meat Lovers",
    price: 18,
    description: "A hearty feast of pepperoni, sausage, ham, and crispy bacon.",
    emoji: "🥩",
    tags: ["meat", "spicy"]
  },
  {
    id: 7,
    name: "Truffle Mushroom",
    price: 17,
    description: "Wild mushrooms drizzled with luxurious truffle oil and white sauce.",
    emoji: "🍄",
    tags: ["vegetarian", "gourmet"]
  },
  {
    id: 8,
    name: "Spicy Inferno",
    price: 16,
    description: "Jalapenos, chili flakes, and spicy salami for the brave.",
    emoji: "🔥",
    tags: ["spicy", "meat"]
  }
];
