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
  {
    id: "european-beef-steak",
    name: "Beef Steak",
    cuisineCategory: "European",
    description: "Grilled beef steak with herb butter.",
  },
  {
    id: "european-roast-chicken",
    name: "Roast Chicken",
    cuisineCategory: "European",
    description: "Classic roasted chicken with pan jus.",
  },
  {
    id: "european-ratatouille",
    name: "Ratatouille",
    cuisineCategory: "European",
    description: "Slow-cooked Provençal vegetables.",
  },
  {
    id: "european-shepherds-pie",
    name: "Shepherd's Pie",
    cuisineCategory: "European",
    description: "Minced meat and vegetables topped with mashed potato.",
  },
  {
    id: "european-potato-gratin",
    name: "Potato Gratin",
    cuisineCategory: "European",
    description: "Layered potatoes baked with cream and cheese.",
  },
  {
    id: "european-beef-wellington",
    name: "Beef Wellington",
    cuisineCategory: "European",
    description: "Beef fillet wrapped with mushroom duxelles and pastry.",
  },
  {
    id: "european-coq-au-vin",
    name: "Coq au Vin",
    cuisineCategory: "European",
    description: "Chicken braised with red wine, mushrooms, and onions.",
  },
  {
    id: "european-fish-and-chips",
    name: "Fish and Chips",
    cuisineCategory: "European",
    description: "Crisp battered fish served with fries.",
  },

  {
    id: "indian-chapati",
    name: "Chapati",
    cuisineCategory: "Indian",
    description: "Soft whole wheat flatbread.",
  },
  {
    id: "indian-butter-chicken",
    name: "Butter Chicken",
    cuisineCategory: "Indian",
    description: "Chicken in a creamy tomato curry sauce.",
  },
  {
    id: "indian-paneer-tikka",
    name: "Paneer Tikka",
    cuisineCategory: "Indian",
    description: "Spiced grilled paneer cubes.",
  },
  {
    id: "indian-biryani",
    name: "Biryani",
    cuisineCategory: "Indian",
    description: "Fragrant basmati rice with spices and meat or vegetables.",
  },
  {
    id: "indian-dal-makhani",
    name: "Dal Makhani",
    cuisineCategory: "Indian",
    description: "Slow-cooked black lentils with butter and cream.",
  },
  {
    id: "indian-tandoori-chicken",
    name: "Tandoori Chicken",
    cuisineCategory: "Indian",
    description: "Yogurt-marinated chicken roasted with tandoori spices.",
  },
  {
    id: "indian-samosa",
    name: "Samosa",
    cuisineCategory: "Indian",
    description: "Crisp pastry filled with spiced potatoes and peas.",
  },
  {
    id: "indian-palak-paneer",
    name: "Palak Paneer",
    cuisineCategory: "Indian",
    description: "Paneer cubes simmered in spinach curry.",
  },

  {
    id: "japanese-sushi",
    name: "Sushi",
    cuisineCategory: "Japanese",
    description: "Assorted sushi rolls and nigiri.",
  },
  {
    id: "japanese-tempura",
    name: "Tempura",
    cuisineCategory: "Japanese",
    description: "Lightly battered seafood and vegetables.",
  },
  {
    id: "japanese-teriyaki-chicken",
    name: "Teriyaki Chicken",
    cuisineCategory: "Japanese",
    description: "Grilled chicken glazed with teriyaki sauce.",
  },
  {
    id: "japanese-miso-soup",
    name: "Miso Soup",
    cuisineCategory: "Japanese",
    description: "Soybean paste soup with tofu and seaweed.",
  },
  {
    id: "japanese-yakisoba",
    name: "Yakisoba",
    cuisineCategory: "Japanese",
    description: "Stir-fried noodles with vegetables and sauce.",
  },
  {
    id: "japanese-ramen",
    name: "Ramen",
    cuisineCategory: "Japanese",
    description: "Noodle soup with rich broth and toppings.",
  },
  {
    id: "japanese-gyoza",
    name: "Gyoza",
    cuisineCategory: "Japanese",
    description: "Pan-fried dumplings with savory filling.",
  },
  {
    id: "japanese-chicken-katsu",
    name: "Chicken Katsu",
    cuisineCategory: "Japanese",
    description: "Crisp breaded chicken cutlet.",
  },

  {
    id: "chinese-peking-duck",
    name: "Peking Duck",
    cuisineCategory: "Chinese",
    description: "Crisp roasted duck with pancakes and hoisin.",
  },
  {
    id: "chinese-dim-sum",
    name: "Dim Sum",
    cuisineCategory: "Chinese",
    description: "Assorted dumplings and steamed bites.",
  },
  {
    id: "chinese-kung-pao-chicken",
    name: "Kung Pao Chicken",
    cuisineCategory: "Chinese",
    description: "Chicken stir-fried with peanuts and chili.",
  },
  {
    id: "chinese-fried-rice",
    name: "Fried Rice",
    cuisineCategory: "Chinese",
    description: "Wok-fried rice with egg and vegetables.",
  },
  {
    id: "chinese-spring-rolls",
    name: "Spring Rolls",
    cuisineCategory: "Chinese",
    description: "Crisp rolls filled with vegetables.",
  },
  {
    id: "chinese-sweet-and-sour-chicken",
    name: "Sweet and Sour Chicken",
    cuisineCategory: "Chinese",
    description: "Crispy chicken tossed in sweet tangy sauce.",
  },
  {
    id: "chinese-mapo-tofu",
    name: "Mapo Tofu",
    cuisineCategory: "Chinese",
    description: "Tofu in spicy Sichuan chili bean sauce.",
  },
  {
    id: "chinese-chow-mein",
    name: "Chow Mein",
    cuisineCategory: "Chinese",
    description: "Stir-fried noodles with vegetables and sauce.",
  },

  {
    id: "thai-pad-thai",
    name: "Pad Thai",
    cuisineCategory: "Thai",
    description: "Stir-fried rice noodles with tamarind sauce.",
  },
  {
    id: "thai-green-curry",
    name: "Green Curry",
    cuisineCategory: "Thai",
    description: "Coconut curry with green chili paste.",
  },
  {
    id: "thai-tom-yum",
    name: "Tom Yum Soup",
    cuisineCategory: "Thai",
    description: "Hot and sour soup with lemongrass.",
  },
  {
    id: "thai-papaya-salad",
    name: "Papaya Salad",
    cuisineCategory: "Thai",
    description: "Shredded green papaya salad with lime dressing.",
  },
  {
    id: "thai-mango-sticky-rice",
    name: "Mango Sticky Rice",
    cuisineCategory: "Thai",
    description: "Sweet coconut sticky rice with mango.",
  },
  {
    id: "thai-red-curry",
    name: "Red Curry",
    cuisineCategory: "Thai",
    description: "Coconut curry with red chili paste and basil.",
  },
  {
    id: "thai-basil-chicken",
    name: "Basil Chicken",
    cuisineCategory: "Thai",
    description: "Stir-fried chicken with Thai basil and chili.",
  },
  {
    id: "thai-satay",
    name: "Chicken Satay",
    cuisineCategory: "Thai",
    description: "Grilled skewers served with peanut sauce.",
  },

  {
    id: "myanmar-mohinga",
    name: "Mohinga",
    cuisineCategory: "Myanmar",
    description: "Rice noodle and fish soup.",
  },
  {
    id: "myanmar-tea-leaf-salad",
    name: "Tea Leaf Salad",
    cuisineCategory: "Myanmar",
    description: "Fermented tea leaves with crunchy beans and nuts.",
  },
  {
    id: "myanmar-shan-noodles",
    name: "Shan Noodles",
    cuisineCategory: "Myanmar",
    description: "Rice noodles with tomato meat sauce.",
  },
  {
    id: "myanmar-coconut-noodles",
    name: "Coconut Noodles",
    cuisineCategory: "Myanmar",
    description: "Noodles in coconut chicken broth.",
  },
  {
    id: "myanmar-pork-curry",
    name: "Pork Curry",
    cuisineCategory: "Myanmar",
    description: "Rich Myanmar-style pork curry.",
  },
  {
    id: "myanmar-nan-gyi-thoke",
    name: "Nan Gyi Thoke",
    cuisineCategory: "Myanmar",
    description: "Thick rice noodle salad with chicken curry dressing.",
  },
  {
    id: "myanmar-ohn-no-khao-swe",
    name: "Ohn No Khao Swe",
    cuisineCategory: "Myanmar",
    description: "Coconut chicken noodle soup.",
  },
  {
    id: "myanmar-mont-lone-yay-paw",
    name: "Mont Lone Yay Paw",
    cuisineCategory: "Myanmar",
    description: "Sweet glutinous rice balls with palm sugar.",
  },

  {
    id: "italian-lasagna",
    name: "Lasagna",
    cuisineCategory: "Italian",
    description: "Layered pasta with meat sauce and cheese.",
  },
  {
    id: "italian-margherita-pizza",
    name: "Margherita Pizza",
    cuisineCategory: "Italian",
    description: "Pizza with tomato, mozzarella, and basil.",
  },
  {
    id: "italian-spaghetti-carbonara",
    name: "Spaghetti Carbonara",
    cuisineCategory: "Italian",
    description: "Pasta with egg, cheese, pancetta, and pepper.",
  },
  {
    id: "italian-risotto-mushroom",
    name: "Mushroom Risotto",
    cuisineCategory: "Italian",
    description: "Creamy arborio rice with mushrooms.",
  },
  {
    id: "italian-caprese-salad",
    name: "Caprese Salad",
    cuisineCategory: "Italian",
    description: "Tomato, mozzarella, and basil salad.",
  },
  {
    id: "italian-fettuccine-alfredo",
    name: "Fettuccine Alfredo",
    cuisineCategory: "Italian",
    description: "Pasta tossed with creamy parmesan sauce.",
  },
  {
    id: "italian-bruschetta",
    name: "Bruschetta",
    cuisineCategory: "Italian",
    description: "Toasted bread with tomato, basil, and olive oil.",
  },
  {
    id: "italian-tiramisu",
    name: "Tiramisu",
    cuisineCategory: "Italian",
    description: "Coffee-soaked layered mascarpone dessert.",
  },

  {
    id: "seafood-grilled-prawns",
    name: "Grilled Prawns",
    cuisineCategory: "Seafood",
    description: "Char-grilled prawns with garlic butter.",
  },
  {
    id: "seafood-oyster-bar",
    name: "Oyster Bar",
    cuisineCategory: "Seafood",
    description: "Fresh oysters with classic condiments.",
  },
  {
    id: "seafood-crab-cakes",
    name: "Crab Cakes",
    cuisineCategory: "Seafood",
    description: "Pan-seared crab cakes with tartar sauce.",
  },
  {
    id: "seafood-salmon-fillet",
    name: "Salmon Fillet",
    cuisineCategory: "Seafood",
    description: "Roasted salmon with lemon dill sauce.",
  },
  {
    id: "seafood-paella",
    name: "Seafood Paella",
    cuisineCategory: "Seafood",
    description: "Spanish rice with mixed seafood.",
  },
  {
    id: "seafood-lobster-thermidor",
    name: "Lobster Thermidor",
    cuisineCategory: "Seafood",
    description: "Lobster baked in creamy mustard sauce.",
  },
  {
    id: "seafood-clam-chowder",
    name: "Clam Chowder",
    cuisineCategory: "Seafood",
    description: "Creamy soup with clams and potatoes.",
  },
  {
    id: "seafood-fish-curry",
    name: "Fish Curry",
    cuisineCategory: "Seafood",
    description: "Fish simmered in aromatic curry sauce.",
  },

  {
    id: "mexican-tacos",
    name: "Tacos",
    cuisineCategory: "Mexican",
    description: "Soft tortillas with seasoned fillings.",
  },
  {
    id: "mexican-enchiladas",
    name: "Enchiladas",
    cuisineCategory: "Mexican",
    description: "Rolled tortillas baked with chili sauce.",
  },
  {
    id: "mexican-guacamole",
    name: "Guacamole",
    cuisineCategory: "Mexican",
    description: "Avocado dip with lime and cilantro.",
  },
  {
    id: "mexican-fajitas",
    name: "Fajitas",
    cuisineCategory: "Mexican",
    description: "Sizzling peppers, onions, and grilled meat.",
  },
  {
    id: "mexican-churros",
    name: "Churros",
    cuisineCategory: "Mexican",
    description: "Fried dough with cinnamon sugar.",
  },
  {
    id: "mexican-quesadillas",
    name: "Quesadillas",
    cuisineCategory: "Mexican",
    description: "Grilled tortillas filled with cheese and vegetables.",
  },
  {
    id: "mexican-nachos",
    name: "Nachos",
    cuisineCategory: "Mexican",
    description: "Tortilla chips topped with cheese and salsa.",
  },
  {
    id: "mexican-tamales",
    name: "Tamales",
    cuisineCategory: "Mexican",
    description: "Steamed masa parcels with savory filling.",
  },

  {
    id: "korean-bulgogi",
    name: "Bulgogi",
    cuisineCategory: "Korean",
    description: "Marinated grilled beef.",
  },
  {
    id: "korean-bibimbap",
    name: "Bibimbap",
    cuisineCategory: "Korean",
    description: "Rice bowl with vegetables, egg, and gochujang.",
  },
  {
    id: "korean-kimchi",
    name: "Kimchi",
    cuisineCategory: "Korean",
    description: "Fermented spicy cabbage.",
  },
  {
    id: "korean-japchae",
    name: "Japchae",
    cuisineCategory: "Korean",
    description: "Stir-fried glass noodles with vegetables.",
  },
  {
    id: "korean-fried-chicken",
    name: "Korean Fried Chicken",
    cuisineCategory: "Korean",
    description: "Crispy chicken with sweet spicy glaze.",
  },
  {
    id: "korean-tteokbokki",
    name: "Tteokbokki",
    cuisineCategory: "Korean",
    description: "Chewy rice cakes in spicy gochujang sauce.",
  },
  {
    id: "korean-kimchi-jjigae",
    name: "Kimchi Jjigae",
    cuisineCategory: "Korean",
    description: "Kimchi stew with tofu and pork.",
  },
  {
    id: "korean-galbi",
    name: "Galbi",
    cuisineCategory: "Korean",
    description: "Marinated grilled beef short ribs.",
  },

  {
    id: "middle-eastern-hummus",
    name: "Hummus",
    cuisineCategory: "Middle Eastern",
    description: "Chickpea dip with tahini.",
  },
  {
    id: "middle-eastern-falafel",
    name: "Falafel",
    cuisineCategory: "Middle Eastern",
    description: "Fried chickpea patties.",
  },
  {
    id: "middle-eastern-lamb-kebab",
    name: "Lamb Kebab",
    cuisineCategory: "Middle Eastern",
    description: "Grilled spiced lamb skewers.",
  },
  {
    id: "middle-eastern-shawarma",
    name: "Shawarma",
    cuisineCategory: "Middle Eastern",
    description: "Spiced sliced meat with flatbread.",
  },
  {
    id: "middle-eastern-baklava",
    name: "Baklava",
    cuisineCategory: "Middle Eastern",
    description: "Layered pastry with nuts and syrup.",
  },
  {
    id: "middle-eastern-baba-ganoush",
    name: "Baba Ganoush",
    cuisineCategory: "Middle Eastern",
    description: "Smoky eggplant dip with tahini.",
  },
  {
    id: "middle-eastern-tabouleh",
    name: "Tabouleh",
    cuisineCategory: "Middle Eastern",
    description: "Parsley and bulgur salad with lemon.",
  },
  {
    id: "middle-eastern-kofta",
    name: "Kofta",
    cuisineCategory: "Middle Eastern",
    description: "Spiced minced meat skewers.",
  },

  {
    id: "mediterranean-greek-salad",
    name: "Greek Salad",
    cuisineCategory: "Mediterranean",
    description: "Tomato, cucumber, olives, and feta.",
  },
  {
    id: "mediterranean-grilled-lamb",
    name: "Grilled Lamb",
    cuisineCategory: "Mediterranean",
    description: "Herb-marinated grilled lamb.",
  },
  {
    id: "mediterranean-stuffed-peppers",
    name: "Stuffed Peppers",
    cuisineCategory: "Mediterranean",
    description: "Peppers filled with rice and herbs.",
  },
  {
    id: "mediterranean-tabouleh",
    name: "Tabouleh",
    cuisineCategory: "Mediterranean",
    description: "Parsley and bulgur salad.",
  },
  {
    id: "mediterranean-pita-bread",
    name: "Pita Bread",
    cuisineCategory: "Mediterranean",
    description: "Soft round flatbread.",
  },
  {
    id: "mediterranean-moussaka",
    name: "Moussaka",
    cuisineCategory: "Mediterranean",
    description: "Layered eggplant casserole with meat sauce.",
  },
  {
    id: "mediterranean-shakshuka",
    name: "Shakshuka",
    cuisineCategory: "Mediterranean",
    description: "Eggs poached in spiced tomato sauce.",
  },
  {
    id: "mediterranean-dolmas",
    name: "Dolmas",
    cuisineCategory: "Mediterranean",
    description: "Grape leaves stuffed with rice and herbs.",
  },

  {
    id: "american-bbq-ribs",
    name: "BBQ Ribs",
    cuisineCategory: "American",
    description: "Slow-cooked ribs with barbecue sauce.",
  },
  {
    id: "american-cheeseburger",
    name: "Cheeseburger",
    cuisineCategory: "American",
    description: "Beef burger with cheese and classic toppings.",
  },
  {
    id: "american-fried-chicken",
    name: "Fried Chicken",
    cuisineCategory: "American",
    description: "Crispy seasoned fried chicken.",
  },
  {
    id: "american-mac-and-cheese",
    name: "Mac and Cheese",
    cuisineCategory: "American",
    description: "Macaroni in creamy cheese sauce.",
  },
  {
    id: "american-caesar-salad",
    name: "Caesar Salad",
    cuisineCategory: "American",
    description: "Romaine salad with Caesar dressing.",
  },
  {
    id: "american-buffalo-wings",
    name: "Buffalo Wings",
    cuisineCategory: "American",
    description: "Chicken wings tossed in spicy buffalo sauce.",
  },
  {
    id: "american-meatloaf",
    name: "Meatloaf",
    cuisineCategory: "American",
    description: "Classic baked ground beef loaf.",
  },
  {
    id: "american-apple-pie",
    name: "Apple Pie",
    cuisineCategory: "American",
    description: "Baked apple filling in flaky pastry crust.",
  },

  {
    id: "vegetarian-grilled-vegetables",
    name: "Grilled Vegetables",
    cuisineCategory: "Vegetarian",
    description: "Seasonal vegetables grilled with herbs.",
  },
  {
    id: "vegetarian-stuffed-mushrooms",
    name: "Stuffed Mushrooms",
    cuisineCategory: "Vegetarian",
    description: "Mushrooms filled with herbs and cheese.",
  },
  {
    id: "vegetarian-lentil-curry",
    name: "Lentil Curry",
    cuisineCategory: "Vegetarian",
    description: "Spiced lentil curry.",
  },
  {
    id: "vegetarian-quinoa-salad",
    name: "Quinoa Salad",
    cuisineCategory: "Vegetarian",
    description: "Quinoa with vegetables and citrus dressing.",
  },
  {
    id: "vegetarian-vegetable-lasagna",
    name: "Vegetable Lasagna",
    cuisineCategory: "Vegetarian",
    description: "Layered pasta with vegetables and cheese.",
  },
  {
    id: "vegetarian-falafel-wrap",
    name: "Falafel Wrap",
    cuisineCategory: "Vegetarian",
    description: "Falafel with salad and tahini in flatbread.",
  },
  {
    id: "vegetarian-eggplant-parmesan",
    name: "Eggplant Parmesan",
    cuisineCategory: "Vegetarian",
    description: "Breaded eggplant baked with tomato sauce and cheese.",
  },
  {
    id: "vegetarian-chickpea-salad",
    name: "Chickpea Salad",
    cuisineCategory: "Vegetarian",
    description: "Chickpeas with fresh herbs and lemon dressing.",
  },

  {
    id: "dessert-tiramisu",
    name: "Tiramisu",
    cuisineCategory: "Dessert",
    description: "Coffee-soaked layered mascarpone dessert.",
  },
  {
    id: "dessert-cheesecake",
    name: "Cheesecake",
    cuisineCategory: "Dessert",
    description: "Cream cheese cake with biscuit crust.",
  },
  {
    id: "dessert-chocolate-mousse",
    name: "Chocolate Mousse",
    cuisineCategory: "Dessert",
    description: "Light whipped chocolate dessert.",
  },
  {
    id: "dessert-fruit-tart",
    name: "Fruit Tart",
    cuisineCategory: "Dessert",
    description: "Pastry shell with custard and fresh fruit.",
  },
  {
    id: "dessert-ice-cream-selection",
    name: "Ice Cream Selection",
    cuisineCategory: "Dessert",
    description: "Assorted ice cream flavors.",
  },
  {
    id: "dessert-brownies",
    name: "Chocolate Brownies",
    cuisineCategory: "Dessert",
    description: "Rich chocolate squares with a soft center.",
  },
  {
    id: "dessert-panna-cotta",
    name: "Panna Cotta",
    cuisineCategory: "Dessert",
    description: "Creamy Italian set dessert with fruit sauce.",
  },
  {
    id: "dessert-creme-brulee",
    name: "Crème Brûlée",
    cuisineCategory: "Dessert",
    description: "Custard topped with caramelized sugar.",
  },
];

const THE_MEAL_DB_DISH_IMAGES: Record<string, string> = {
  "japanese-sushi":
    "https://www.themealdb.com/images/media/meals/g046bb1663960946.jpg",
};

const THE_MEAL_DB_SEARCH_ALIASES: Record<string, string> = {
  "american-cheeseburger": "Big Mac",
  "american-fried-chicken": "Kentucky Fried Chicken",
  "american-mac-and-cheese": "Mac and Cheese",
  "chinese-sweet-and-sour-chicken": "Sweet and Sour Pork",
  "italian-lasagna": "Lasagne",
  "japanese-teriyaki-chicken": "Teriyaki Chicken Casserole",
  "mexican-tacos": "Beef Tacos",
  "seafood-paella": "Seafood fideuà",
};

type MealDbSearchResponse = {
  meals?: Array<{
    strMeal?: string;
    strMealThumb?: string;
  }> | null;
};

const mealDbImageCache = new Map<string, string | null>();

const normalizeMealName = (value: string) => {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
};

const mealMatchesDish = (mealName: string, dishName: string) => {
  const meal = normalizeMealName(mealName);
  const dish = normalizeMealName(dishName);
  const importantWords = dish
    .split(" ")
    .filter(
      (word) => word.length > 2 && !["and", "with", "the"].includes(word),
    );

  return (
    meal === dish ||
    meal.includes(dish) ||
    importantWords.every((word) => meal.includes(word))
  );
};

const fetchMealDbImageUrl = async (dish: IDish) => {
  const staticImageUrl = dish.imageUrl ?? THE_MEAL_DB_DISH_IMAGES[dish.id];
  if (staticImageUrl) return staticImageUrl;

  if (mealDbImageCache.has(dish.id)) {
    return mealDbImageCache.get(dish.id) ?? undefined;
  }

  const searchTerm = THE_MEAL_DB_SEARCH_ALIASES[dish.id] ?? dish.name;

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
        searchTerm,
      )}`,
    );
    const payload = (await response.json()) as MealDbSearchResponse;
    const meal = payload.meals?.find(
      (meal) =>
        meal.strMeal &&
        meal.strMealThumb &&
        mealMatchesDish(meal.strMeal, searchTerm),
    );
    const imageUrl = meal?.strMealThumb ?? null;
    mealDbImageCache.set(dish.id, imageUrl);
    return imageUrl ?? undefined;
  } catch {
    mealDbImageCache.set(dish.id, null);
    return undefined;
  }
};

const withDishImage = async (dish: IDish): Promise<IDish> => ({
  ...dish,
  imageUrl: await fetchMealDbImageUrl(dish),
});

export const getDishCatalog = async () =>
  Promise.all(DISH_CATALOG.map(withDishImage));

export const getDishByCatalogId = (dishId: string) => {
  return DISH_CATALOG.find((dish) => dish.id === dishId);
};

export const getDishWithImageByCatalogId = async (dishId: string) => {
  const dish = getDishByCatalogId(dishId);
  return dish ? withDishImage(dish) : undefined;
};

export const getDishesByCatalogIds = async (dishIds: string[]) => {
  const dishes = dishIds
    .map((dishId) => getDishByCatalogId(dishId))
    .filter((dish): dish is IDish => Boolean(dish));
  return Promise.all(dishes.map(withDishImage));
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

  const invalidDishId = uniqueDishIds.find(
    (dishId) => !getDishByCatalogId(dishId),
  );
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
