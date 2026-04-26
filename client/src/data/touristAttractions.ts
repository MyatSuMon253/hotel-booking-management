import type { TouristAttraction } from "@/types/attraction";

export const TOURIST_ATTRACTIONS_SOURCE_URL =
  "https://www.trip.com/travel-guide/attraction/yangon-488/tourist-attractions/";

export const touristAttractions: TouristAttraction[] = [
  {
    id: "shwedagon-pagoda",
    rank: 1,
    name: "Shwedagon Pagoda",
    imageUrl: "https://ak-d.tripcdn.com/images/100613000000tfnjm1E58.jpg",
    category: "Historic building",
    location: "Kyauktada",
    distanceFromDowntown: "187 m from downtown",
    rating: 4.8,
    reviewCount: 801,
    openingNote: "Opens at 4:00 AM",
    highlights: [
      "Yangon's most recognizable golden pagoda and a major Buddhist landmark.",
      "Popular for night views, quiet walks, and city photography.",
    ],
    tripUrl:
      "https://www.trip.com/travel-guide/attraction/kyauktada/shwedagon-pagoda-85452?curr=USD&locale=en-XX&scene=gsDestination",
  },
  {
    id: "yangon-chinatown",
    rank: 2,
    name: "Yangon Chinatown",
    imageUrl: "https://ak-d.tripcdn.com/images/0102712000rgz2p292BA1.jpg",
    category: "Night view",
    location: "Kyauktada",
    distanceFromDowntown: "3 km from downtown",
    rating: 4.5,
    reviewCount: 225,
    isFreeEntry: true,
    highlights: [
      "A busy commercial area centered around street food, fruit stalls, and local shops.",
      "Known for Chinese temples, festival atmosphere, and evening market activity.",
    ],
    tripUrl:
      "https://www.trip.com/travel-guide/attraction/kyauktada/yangon-chinatown-85814?curr=USD&locale=en-XX&scene=gsDestination",
  },
  {
    id: "bogyoke-aung-san-market",
    rank: 3,
    name: "Bogyoke Aung San Market",
    imageUrl: "https://ak-d.tripcdn.com/images/0105j12000f6sdmshECDE.jpg",
    category: "Market",
    location: "Kyauktada",
    distanceFromDowntown: "2.3 km from downtown",
    rating: 4.5,
    reviewCount: 249,
    isFreeEntry: true,
    highlights: [
      "Well-known market for jewelry, jade, wood carvings, fabrics, and souvenirs.",
      "A practical stop for guests who want a short shopping visit in central Yangon.",
    ],
    tripUrl:
      "https://www.trip.com/travel-guide/attraction/kyauktada/bogyoke-aung-san-market-85459?curr=USD&locale=en-XX&scene=gsDestination",
  },
  {
    id: "sule-pagoda",
    rank: 4,
    name: "Sule Pagoda",
    imageUrl: "https://ak-d.tripcdn.com/images/100i1c000001dmzvpED1C.jpg",
    category: "Historic building",
    location: "Kyauktada",
    distanceFromDowntown: "3 km from downtown",
    rating: 4.6,
    reviewCount: 253,
    openingNote: "Opens at 6:00 AM",
    highlights: [
      "A central downtown pagoda surrounded by colonial-era streets and city traffic.",
      "Often visited for a quick cultural stop while exploring downtown Yangon.",
    ],
    tripUrl:
      "https://www.trip.com/travel-guide/attraction/kyauktada/sule-pagoda-85476?curr=USD&locale=en-XX&scene=gsDestination",
  },
  {
    id: "peoples-park",
    rank: 5,
    name: "People's Park",
    imageUrl:
      "https://ak-d.tripcdn.com/images/fd/tg/g1/M06/FC/24/CghzflW7H_iATdynAAA-FlXAIeA738.jpg",
    category: "Park",
    location: "Yangon",
    distanceFromDowntown: "1.1 km from downtown",
    highlights: [
      "Open green space near major city landmarks.",
      "Good for a relaxed walk between sightseeing stops.",
    ],
    tripUrl:
      "https://www.trip.com/travel-guide/attraction/yangon/people-s-park-151913277?curr=USD&locale=en-XX&scene=gsDestination",
  },
  {
    id: "yangon-zoo",
    rank: 6,
    name: "Yangon Zoo",
    imageUrl: "https://ak-d.tripcdn.com/images/0HJ3012000h9yf9oi0544.jpg",
    category: "Zoo",
    location: "Botataung",
    distanceFromDowntown: "1.1 km from downtown",
    rating: 5,
    reviewCount: 1,
    openingNote: "Opens at 8:00 AM",
    highlights: [
      "A family-friendly stop close to the city center.",
      "Best suited for guests traveling with children or planning a slower day.",
    ],
    tripUrl:
      "https://www.trip.com/travel-guide/attraction/botataung/yangon-zoo-129757564?curr=USD&locale=en-XX&scene=gsDestination",
  },
  {
    id: "thakhin-mya-park",
    rank: 7,
    name: "Thakhin Mya Park",
    imageUrl: "https://ak-d.tripcdn.com/images/0HJ6112000itlbzg460C1.jpg",
    category: "Park",
    location: "Yangon",
    distanceFromDowntown: "2.7 km from downtown",
    openingNote: "Opens at 6:00 AM",
    highlights: [
      "Local park option for casual walking and fresh air.",
      "A simple nearby stop for guests who prefer outdoor spaces.",
    ],
    tripUrl:
      "https://www.trip.com/travel-guide/attraction/yangon/thakhin-mya-park-144607844?curr=USD&locale=en-XX&scene=gsDestination",
  },
  {
    id: "kandawgyi-natural-garden",
    rank: 8,
    name: "Kandawgyi Natural Garden",
    imageUrl: "https://ak-d.tripcdn.com/images/0HJ1c12000h0dtqljCB7B.jpg",
    category: "Garden",
    location: "Yangon",
    distanceFromDowntown: "921 m from downtown",
    reviewCount: 1444,
    openingNote: "Opens at 6:00 AM",
    highlights: [
      "Popular lake and garden area close to central Yangon.",
      "Useful for morning walks, open-air views, and a calmer break from downtown.",
    ],
    tripUrl:
      "https://www.trip.com/travel-guide/attraction/yangon/kandawgyi-natural-garden-138047788?curr=USD&locale=en-XX&scene=gsDestination",
  },
  {
    id: "chaukhtatgyi-buddha-temple",
    rank: 9,
    name: "Chaukhtatgyi Buddha Temple",
    imageUrl: "https://ak-d.tripcdn.com/images/10081f000001gqhjr9257.jpg",
    category: "Historic building",
    location: "Yangon",
    distanceFromDowntown: "2 km from downtown",
    rating: 4.7,
    reviewCount: 160,
    highlights: [
      "Known for its large reclining Buddha image and quiet temple setting.",
      "Guests should dress respectfully before entering the temple area.",
    ],
    tripUrl:
      "https://www.trip.com/travel-guide/attraction/yangon/chaukhtatgyi-buddha-temple-85458?curr=USD&locale=en-XX&scene=gsDestination",
  },
  {
    id: "the-secretariat-yangon",
    rank: 10,
    name: "The Secretariat Yangon",
    imageUrl: "https://ak-d.tripcdn.com/images/1me15224x8uqk4frz5BC3.jpg",
    category: "Historic building",
    location: "Botataung",
    distanceFromDowntown: "3.2 km from downtown",
    rating: 4,
    reviewCount: 1,
    openingNote: "Opens at 9:00 AM",
    highlights: [
      "Colonial-era complex connected with Myanmar's modern political history.",
      "A strong choice for guests interested in heritage architecture and guided visits.",
    ],
    tripUrl:
      "https://www.trip.com/travel-guide/attraction/botataung/the-secretariat-yangon-39896017?curr=USD&locale=en-XX&scene=gsDestination",
  },
];
