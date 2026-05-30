// Destinations Data - Nepal Travel Experiences
const destinations = [
    {
        id: 1,
        name: "Mustang Trek",
        category: "trekking",
        description: "Experience the ancient kingdom of Mustang with dramatic landscapes and Tibetan culture.",
        longDescription: "Trek through arid landscapes reminiscent of Tibet, visit ancient cave dwellings, explore Lo Manthang—the walled capital, and witness Buddhist culture unchanged for centuries.",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
        price: 45000,
        rating: 4.8,
        duration: "10-12 days",
        difficulty: "Challenging",
        highlights: [
            "Explore ancient walled city of Lo Manthang",
            "Visit 15th-century monasteries",
            "Experience authentic Tibetan culture",
            "Trek through dramatic desert landscapes"
        ],
        addons: {
            hotel: ["Budget Teahouse (Free)", "Standard Lodge (+NPR 8,000)", "Premium Lodge (+NPR 15,000)"],
            transport: ["Shared Jeep (Free)", "Private Jeep (+NPR 25,000)"],
            guide: ["Local Guide (Free)", "Expert Guide (+NPR 12,000)"]
        }
    },
    {
        id: 2,
        name: "Pokhara Paradise",
        category: "relaxation",
        description: "Relax by serene Phewa Lake with stunning views of the Annapurna range.",
        longDescription: "Nestled in the lap of the Himalayas, Pokhara is Nepal's adventure capital. Enjoy paragliding over the valley, explore the tranquil Phewa Lake by boat.",
        image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=80",
        price: 18000,
        rating: 4.9,
        duration: "3-4 days",
        difficulty: "Easy",
        highlights: [
            "Boat ride on crystal-clear Phewa Lake",
            "Sunrise view from Sarangkot",
            "Visit World Peace Pagoda",
            "Optional paragliding adventure"
        ],
        addons: {
            hotel: ["Budget Hotel (Free)", "3-Star Lake View (+NPR 5,000)", "5-Star Resort (+NPR 18,000)"],
            activities: ["Sightseeing Only (Free)", "Paragliding Package (+NPR 8,500)", "Full Adventure (+NPR 15,000)"]
        }
    },
    {
        id: 3,
        name: "Everest Base Camp",
        category: "trekking",
        description: "Stand at the foot of the world's highest mountain with breathtaking Himalayan vistas.",
        longDescription: "Journey through the Khumbu region, home to the legendary Sherpa people. Trek through rhododendron forests and cross suspension bridges.",
        image: "https://plus.unsplash.com/premium_photo-1697729996368-5b5c7843113e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: 95000,
        rating: 5.0,
        duration: "14 days",
        difficulty: "Challenging",
        highlights: [
            "Reach Everest Base Camp at 5,364m",
            "Sunrise from Kala Patthar viewpoint",
            "Visit Tengboche Monastery",
            "Experience Sherpa culture"
        ],
        addons: {
            hotel: ["Standard Teahouse (Free)", "Comfort Teahouse (+NPR 15,000)"],
            porter: ["No Porter (Free)", "Shared Porter (+NPR 18,000)", "Personal Porter (+NPR 35,000)"]
        }
    },
    {
        id: 4,
        name: "Kathmandu Heritage",
        category: "cultural",
        description: "Dive into Nepal's rich history. Explore UNESCO World Heritage Sites and ancient temples.",
        longDescription: "Kathmandu Valley is home to seven UNESCO World Heritage Sites. Explore Pashupatinath Temple, Boudhanath Stupa, and medieval courtyards.",
        image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&q=80",
        price: 12000,
        rating: 4.7,
        duration: "3 days",
        difficulty: "Easy",
        highlights: [
            "Visit 3 UNESCO World Heritage Sites",
            "Explore Patan Durbar Square",
            "Evening prayers at Pashupatinath",
            "Traditional Newari food tour"
        ],
        addons: {
            hotel: ["Budget Hotel (Free)", "Boutique Heritage (+NPR 6,000)", "5-Star Luxury (+NPR 12,000)"],
            guide: ["Self-Guided (Free)", "Heritage Guide (+NPR 4,500)"]
        }
    },
    {
        id: 5,
        name: "Annapurna Circuit",
        category: "trekking",
        description: "One of the world's greatest treks circling the magnificent Annapurna massif.",
        longDescription: "Journey from subtropical forests to alpine meadows. Cross the challenging Thorong La Pass at 5,416m and experience 8 climate zones.",
        image: "https://images.unsplash.com/photo-1676479034967-c7d85fac5859?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: 75000,
        rating: 4.9,
        duration: "15-18 days",
        difficulty: "Challenging",
        highlights: [
            "Cross Thorong La Pass (5,416m)",
            "Visit sacred Muktinath temple",
            "Experience 8 climate zones",
            "Relax in natural hot springs"
        ],
        addons: {
            hotel: ["Basic Teahouse (Free)", "Comfort Lodge (+NPR 12,000)"],
            support: ["Guide Only (+NPR 22,000)", "Guide + Porter (+NPR 38,000)"]
        }
    },
    {
        id: 6,
        name: "Chitwan Safari",
        category: "adventure",
        description: "Spot Bengal tigers and one-horned rhinos in Nepal's premier wildlife reserve.",
        longDescription: "Chitwan National Park is a UNESCO World Heritage Site. Enjoy jungle safaris on elephant-back, canoe down the Rapti River.",
        image: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80",
        price: 28000,
        rating: 4.6,
        duration: "3-4 days",
        difficulty: "Easy",
        highlights: [
            "Jungle safari to spot rhinos and tigers",
            "Canoe ride on Rapti River",
            "Visit authentic Tharu village",
            "Bird watching (500+ species)"
        ],
        addons: {
            hotel: ["Standard Resort (Free)", "Premium Eco-Lodge (+NPR 9,000)", "Luxury Safari (+NPR 20,000)"],
            safari: ["Standard Package (Free)", "Extended Safari (+NPR 8,000)"]
        }
    },
    {
        id: 7,
        name: "Langtang Valley",
        category: "trekking",
        description: "Trek through pristine forests and traditional Tamang villages with spectacular mountain views.",
        longDescription: "Trek through rhododendron and bamboo forests, visit ancient Buddhist monasteries, experience Tamang culture.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        price: 38000,
        rating: 4.7,
        duration: "7-9 days",
        difficulty: "Moderate",
        highlights: [
            "Hike to Kyanjin Gompa monastery",
            "Optional climb to Tserko Ri viewpoint",
            "Experience Tamang culture and hospitality",
            "Trek through rhododendron forests"
        ],
        addons: {
            hotel: ["Basic Teahouse (Free)", "Comfort Lodge (+NPR 6,000)"],
            guide: ["Local Guide (Free)", "Expert Guide (+NPR 9,000)"]
        }
    },
    {
        id: 8,
        name: "Lumbini Pilgrimage",
        category: "cultural",
        description: "Visit the birthplace of Lord Buddha, one of the world's most important spiritual pilgrimage sites.",
        longDescription: "Explore the sacred Maya Devi Temple, walk through peaceful monastery zones, meditate in tranquil gardens.",
        image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
        price: 15000,
        rating: 4.8,
        duration: "2-3 days",
        difficulty: "Easy",
        highlights: [
            "Visit Maya Devi Temple - Buddha's birthplace",
            "Explore international monastery zone",
            "See ancient Ashoka Pillar",
            "Meditation sessions in sacred gardens"
        ],
        addons: {
            hotel: ["Budget Hotel (Free)", "Monastery Guesthouse (+NPR 3,500)", "Premium Hotel (+NPR 8,000)"],
            guide: ["Self-Guided (Free)", "Spiritual Guide (+NPR 3,000)"]
        }
    }
];

// Budget ranges
const budgetRanges = {
    budget: { min: 0, max: 30000 },
    mid: { min: 30000, max: 60000 },
    high: { min: 60000, max: 100000 },
    luxury: { min: 100000, max: Infinity }
};
