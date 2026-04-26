import { IDish } from "../types/buffet";

export const DISH_CATEGORIES = [
  "European",
  "Indian",
  "Japanese",
  "Chinese",
  "Thai",
  "Myanmar",
  "Italian",
  "Seafood",
  "Mexican",
  "Korean",
  "Middle Eastern",
  "Mediterranean",
  "American",
  "Vegetarian",
  "Dessert",
] as const;

export const DISH_CATALOG: IDish[] = [
  { id: "european-beef-steak", name: "Beef Steak", cuisineCategory: "European", description: "Grilled beef steak with herb butter." },
  { id: "european-roast-chicken", name: "Roast Chicken", cuisineCategory: "European", description: "Classic roasted chicken with pan jus." },
  { id: "european-ratatouille", name: "Ratatouille", cuisineCategory: "European", description: "Slow-cooked Provençal vegetables." },
  { id: "european-shepherds-pie", name: "Shepherd's Pie", cuisineCategory: "European", description: "Minced meat and vegetables topped with mashed potato." },
  { id: "european-potato-gratin", name: "Potato Gratin", cuisineCategory: "European", description: "Layered potatoes baked with cream and cheese." },

  { id: "indian-chapati", name: "Chapati", cuisineCategory: "Indian", description: "Soft whole wheat flatbread." },
  { id: "indian-butter-chicken", name: "Butter Chicken", cuisineCategory: "Indian", description: "Chicken in a creamy tomato curry sauce." },
  { id: "indian-paneer-tikka", name: "Paneer Tikka", cuisineCategory: "Indian", description: "Spiced grilled paneer cubes." },
  { id: "indian-biryani", name: "Biryani", cuisineCategory: "Indian", description: "Fragrant basmati rice with spices and meat or vegetables." },
  { id: "indian-dal-makhani", name: "Dal Makhani", cuisineCategory: "Indian", description: "Slow-cooked black lentils with butter and cream." },

  { id: "japanese-sushi", name: "Sushi", cuisineCategory: "Japanese", description: "Assorted sushi rolls and nigiri." },
  { id: "japanese-tempura", name: "Tempura", cuisineCategory: "Japanese", description: "Lightly battered seafood and vegetables." },
  { id: "japanese-teriyaki-chicken", name: "Teriyaki Chicken", cuisineCategory: "Japanese", description: "Grilled chicken glazed with teriyaki sauce." },
  { id: "japanese-miso-soup", name: "Miso Soup", cuisineCategory: "Japanese", description: "Soybean paste soup with tofu and seaweed." },
  { id: "japanese-yakisoba", name: "Yakisoba", cuisineCategory: "Japanese", description: "Stir-fried noodles with vegetables and sauce." },

  { id: "chinese-peking-duck", name: "Peking Duck", cuisineCategory: "Chinese", description: "Crisp roasted duck with pancakes and hoisin." },
  { id: "chinese-dim-sum", name: "Dim Sum", cuisineCategory: "Chinese", description: "Assorted dumplings and steamed bites." },
  { id: "chinese-kung-pao-chicken", name: "Kung Pao Chicken", cuisineCategory: "Chinese", description: "Chicken stir-fried with peanuts and chili." },
  { id: "chinese-fried-rice", name: "Fried Rice", cuisineCategory: "Chinese", description: "Wok-fried rice with egg and vegetables." },
  { id: "chinese-spring-rolls", name: "Spring Rolls", cuisineCategory: "Chinese", description: "Crisp rolls filled with vegetables." },

  { id: "thai-pad-thai", name: "Pad Thai", cuisineCategory: "Thai", description: "Stir-fried rice noodles with tamarind sauce." },
  { id: "thai-green-curry", name: "Green Curry", cuisineCategory: "Thai", description: "Coconut curry with green chili paste." },
  { id: "thai-tom-yum", name: "Tom Yum Soup", cuisineCategory: "Thai", description: "Hot and sour soup with lemongrass." },
  { id: "thai-papaya-salad", name: "Papaya Salad", cuisineCategory: "Thai", description: "Shredded green papaya salad with lime dressing." },
  { id: "thai-mango-sticky-rice", name: "Mango Sticky Rice", cuisineCategory: "Thai", description: "Sweet coconut sticky rice with mango." },

  { id: "myanmar-mohinga", name: "Mohinga", cuisineCategory: "Myanmar", description: "Rice noodle and fish soup." },
  { id: "myanmar-tea-leaf-salad", name: "Tea Leaf Salad", cuisineCategory: "Myanmar", description: "Fermented tea leaves with crunchy beans and nuts." },
  { id: "myanmar-shan-noodles", name: "Shan Noodles", cuisineCategory: "Myanmar", description: "Rice noodles with tomato meat sauce." },
  { id: "myanmar-coconut-noodles", name: "Coconut Noodles", cuisineCategory: "Myanmar", description: "Noodles in coconut chicken broth." },
  { id: "myanmar-pork-curry", name: "Pork Curry", cuisineCategory: "Myanmar", description: "Rich Myanmar-style pork curry." },

  { id: "italian-lasagna", name: "Lasagna", cuisineCategory: "Italian", description: "Layered pasta with meat sauce and cheese." },
  { id: "italian-margherita-pizza", name: "Margherita Pizza", cuisineCategory: "Italian", description: "Pizza with tomato, mozzarella, and basil." },
  { id: "italian-spaghetti-carbonara", name: "Spaghetti Carbonara", cuisineCategory: "Italian", description: "Pasta with egg, cheese, pancetta, and pepper." },
  { id: "italian-risotto-mushroom", name: "Mushroom Risotto", cuisineCategory: "Italian", description: "Creamy arborio rice with mushrooms." },
  { id: "italian-caprese-salad", name: "Caprese Salad", cuisineCategory: "Italian", description: "Tomato, mozzarella, and basil salad." },

  { id: "seafood-grilled-prawns", name: "Grilled Prawns", cuisineCategory: "Seafood", description: "Char-grilled prawns with garlic butter." },
  { id: "seafood-oyster-bar", name: "Oyster Bar", cuisineCategory: "Seafood", description: "Fresh oysters with classic condiments." },
  { id: "seafood-crab-cakes", name: "Crab Cakes", cuisineCategory: "Seafood", description: "Pan-seared crab cakes with tartar sauce." },
  { id: "seafood-salmon-fillet", name: "Salmon Fillet", cuisineCategory: "Seafood", description: "Roasted salmon with lemon dill sauce." },
  { id: "seafood-paella", name: "Seafood Paella", cuisineCategory: "Seafood", description: "Spanish rice with mixed seafood." },

  { id: "mexican-tacos", name: "Tacos", cuisineCategory: "Mexican", description: "Soft tortillas with seasoned fillings." },
  { id: "mexican-enchiladas", name: "Enchiladas", cuisineCategory: "Mexican", description: "Rolled tortillas baked with chili sauce." },
  { id: "mexican-guacamole", name: "Guacamole", cuisineCategory: "Mexican", description: "Avocado dip with lime and cilantro." },
  { id: "mexican-fajitas", name: "Fajitas", cuisineCategory: "Mexican", description: "Sizzling peppers, onions, and grilled meat." },
  { id: "mexican-churros", name: "Churros", cuisineCategory: "Mexican", description: "Fried dough with cinnamon sugar." },

  { id: "korean-bulgogi", name: "Bulgogi", cuisineCategory: "Korean", description: "Marinated grilled beef." },
  { id: "korean-bibimbap", name: "Bibimbap", cuisineCategory: "Korean", description: "Rice bowl with vegetables, egg, and gochujang." },
  { id: "korean-kimchi", name: "Kimchi", cuisineCategory: "Korean", description: "Fermented spicy cabbage." },
  { id: "korean-japchae", name: "Japchae", cuisineCategory: "Korean", description: "Stir-fried glass noodles with vegetables." },
  { id: "korean-fried-chicken", name: "Korean Fried Chicken", cuisineCategory: "Korean", description: "Crispy chicken with sweet spicy glaze." },

  { id: "middle-eastern-hummus", name: "Hummus", cuisineCategory: "Middle Eastern", description: "Chickpea dip with tahini." },
  { id: "middle-eastern-falafel", name: "Falafel", cuisineCategory: "Middle Eastern", description: "Fried chickpea patties." },
  { id: "middle-eastern-lamb-kebab", name: "Lamb Kebab", cuisineCategory: "Middle Eastern", description: "Grilled spiced lamb skewers." },
  { id: "middle-eastern-shawarma", name: "Shawarma", cuisineCategory: "Middle Eastern", description: "Spiced sliced meat with flatbread." },
  { id: "middle-eastern-baklava", name: "Baklava", cuisineCategory: "Middle Eastern", description: "Layered pastry with nuts and syrup." },

  { id: "mediterranean-greek-salad", name: "Greek Salad", cuisineCategory: "Mediterranean", description: "Tomato, cucumber, olives, and feta." },
  { id: "mediterranean-grilled-lamb", name: "Grilled Lamb", cuisineCategory: "Mediterranean", description: "Herb-marinated grilled lamb." },
  { id: "mediterranean-stuffed-peppers", name: "Stuffed Peppers", cuisineCategory: "Mediterranean", description: "Peppers filled with rice and herbs." },
  { id: "mediterranean-tabouleh", name: "Tabouleh", cuisineCategory: "Mediterranean", description: "Parsley and bulgur salad." },
  { id: "mediterranean-pita-bread", name: "Pita Bread", cuisineCategory: "Mediterranean", description: "Soft round flatbread." },

  { id: "american-bbq-ribs", name: "BBQ Ribs", cuisineCategory: "American", description: "Slow-cooked ribs with barbecue sauce." },
  { id: "american-cheeseburger", name: "Cheeseburger", cuisineCategory: "American", description: "Beef burger with cheese and classic toppings." },
  { id: "american-fried-chicken", name: "Fried Chicken", cuisineCategory: "American", description: "Crispy seasoned fried chicken." },
  { id: "american-mac-and-cheese", name: "Mac and Cheese", cuisineCategory: "American", description: "Macaroni in creamy cheese sauce." },
  { id: "american-caesar-salad", name: "Caesar Salad", cuisineCategory: "American", description: "Romaine salad with Caesar dressing." },

  { id: "vegetarian-grilled-vegetables", name: "Grilled Vegetables", cuisineCategory: "Vegetarian", description: "Seasonal vegetables grilled with herbs." },
  { id: "vegetarian-stuffed-mushrooms", name: "Stuffed Mushrooms", cuisineCategory: "Vegetarian", description: "Mushrooms filled with herbs and cheese." },
  { id: "vegetarian-lentil-curry", name: "Lentil Curry", cuisineCategory: "Vegetarian", description: "Spiced lentil curry." },
  { id: "vegetarian-quinoa-salad", name: "Quinoa Salad", cuisineCategory: "Vegetarian", description: "Quinoa with vegetables and citrus dressing." },
  { id: "vegetarian-vegetable-lasagna", name: "Vegetable Lasagna", cuisineCategory: "Vegetarian", description: "Layered pasta with vegetables and cheese." },

  { id: "dessert-tiramisu", name: "Tiramisu", cuisineCategory: "Dessert", description: "Coffee-soaked layered mascarpone dessert." },
  { id: "dessert-cheesecake", name: "Cheesecake", cuisineCategory: "Dessert", description: "Cream cheese cake with biscuit crust." },
  { id: "dessert-chocolate-mousse", name: "Chocolate Mousse", cuisineCategory: "Dessert", description: "Light whipped chocolate dessert." },
  { id: "dessert-fruit-tart", name: "Fruit Tart", cuisineCategory: "Dessert", description: "Pastry shell with custard and fresh fruit." },
  { id: "dessert-ice-cream-selection", name: "Ice Cream Selection", cuisineCategory: "Dessert", description: "Assorted ice cream flavors." },
];

export const getDishCatalog = () => DISH_CATALOG;

export const getDishByCatalogId = (dishId: string) => {
  return DISH_CATALOG.find((dish) => dish.id === dishId);
};

export const getDishesByCatalogIds = (dishIds: string[]) => {
  return dishIds
    .map((dishId) => getDishByCatalogId(dishId))
    .filter((dish): dish is IDish => Boolean(dish));
};

export const validateDishSelection = ({
  dishIds,
  cuisineCategory,
}: {
  dishIds: string[];
  cuisineCategory: string;
}) => {
  const categoryExists = DISH_CATEGORIES.some(
    (category) => category.toLowerCase() === cuisineCategory.toLowerCase(),
  );
  if (!categoryExists) {
    throw new Error(`Unknown cuisine category: ${cuisineCategory}`);
  }

  if (dishIds.length === 0) {
    throw new Error("Select at least one included dish.");
  }

  const uniqueDishIds = Array.from(new Set(dishIds));
  if (uniqueDishIds.length !== dishIds.length) {
    throw new Error("Included dishes cannot contain duplicates.");
  }

  const invalidDishId = uniqueDishIds.find((dishId) => !getDishByCatalogId(dishId));
  if (invalidDishId) {
    throw new Error(`Unknown dish selected: ${invalidDishId}`);
  }

  const mismatchedDish = uniqueDishIds
    .map((dishId) => getDishByCatalogId(dishId))
    .find(
      (dish) =>
        dish &&
        dish.cuisineCategory.toLowerCase() !== cuisineCategory.toLowerCase(),
    );

  if (mismatchedDish) {
    throw new Error(
      `${mismatchedDish.name} does not belong to ${cuisineCategory}.`,
    );
  }

  return uniqueDishIds;
};
