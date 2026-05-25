// Destinations Data - Nepal Travel Experiences
const destinations = [
    {
        id: 1,
        name: "Mustang Trek",
        category: "trekking",
        description: "Experience the ancient kingdom of Mustang with its dramatic landscapes, Tibetan culture, and centuries-old monasteries. This trek takes you through one of the most remote and restricted areas of Nepal.",
        longDescription: "The Mustang Trek is a journey through a region that time forgot. Once a separate kingdom, Upper Mustang was forbidden to outsiders until 1992. Trek through arid landscapes reminiscent of Tibet, visit ancient cave dwellings, explore Lo Manthang—the walled capital, and witness Buddhist culture unchanged for centuries. This moderate to challenging trek reaches altitudes of 3,800m and requires a special permit.",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
        rating: 4.8,
        basePrice: 45000,
        minTravelers: 2,
        duration: "10-12 days",
        difficulty: "Moderate to Challenging",
        highlights: [
            "Explore the ancient walled city of Lo Manthang",
            "Visit 15th-century monasteries and cave dwellings",
            "Experience authentic Tibetan Buddhist culture",
            "Trek through dramatic desert-like landscapes",
            "Witness the unique Upper Mustang ecosystem"
        ],
        addons: [
            {
                id: "hotel_mustang",
                type: "hotel",
                label: "Accommodation Tier",
                options: [
                    { value: "budget", label: "Budget Teahouse", price: 0 },
                    { value: "standard", label: "Standard Lodge", price: 8000 },
                    { value: "premium", label: "Premium Lodge", price: 15000 }
                ]
            },
            {
                id: "transport_mustang",
                type: "transport",
                label: "Transportation",
                options: [
                    { value: "shared", label: "Shared Jeep", price: 0 },
                    { value: "private", label: "Private Jeep (per group)", price: 25000, perGroup: true }
                ]
            },
            {
                id: "guide_mustang",
                type: "guide",
                label: "Guide Service",
                options: [
                    { value: "basic", label: "Local Guide", price: 0 },
                    { value: "expert", label: "Expert Trekking Guide", price: 12000 }
                ]
            }
        ]
    },
    {
        id: 2,
        name: "Pokhara Paradise",
        category: "relaxation",
        description: "Relax by the serene Phewa Lake with stunning views of the Annapurna range. Perfect for those seeking tranquility with adventure options nearby.",
        longDescription: "Nestled in the lap of the Himalayas, Pokhara is Nepal's adventure capital and a haven for relaxation. Wake up to magnificent views of Machhapuchhre (Fishtail Mountain), explore the tranquil Phewa Lake by boat, visit the World Peace Pagoda, and enjoy paragliding over the valley. With its laid-back atmosphere, lakeside cafes, and proximity to trekking routes, Pokhara offers the perfect blend of relaxation and adventure.",
        image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=80",
        rating: 4.9,
        basePrice: 18000,
        minTravelers: 1,
        duration: "3-4 days",
        difficulty: "Easy",
        highlights: [
            "Boat ride on the crystal-clear Phewa Lake",
            "Sunrise view from Sarangkot viewpoint",
            "Visit the World Peace Pagoda",
            "Optional paragliding adventure",
            "Explore Davis Falls and Gupteshwor Cave"
        ],
        addons: [
            {
                id: "hotel_pokhara",
                type: "hotel",
                label: "Hotel Category",
                options: [
                    { value: "budget", label: "Lakeside Budget Hotel", price: 0 },
                    { value: "standard", label: "3-Star Lake View", price: 5000 },
                    { value: "premium", label: "5-Star Luxury Resort", price: 18000 }
                ]
            },
            {
                id: "activities_pokhara",
                type: "activities",
                label: "Activities Package",
                options: [
                    { value: "basic", label: "Sightseeing Only", price: 0 },
                    { value: "adventure", label: "Paragliding + Boating", price: 8500 },
                    { value: "complete", label: "Full Adventure Package", price: 15000 }
                ]
            }
        ]
    },
    {
        id: 3,
        name: "Everest Base Camp",
        category: "trekking",
        description: "Stand at the foot of the world's highest mountain. This iconic trek takes you through Sherpa villages, ancient monasteries, and breathtaking Himalayan vistas.",
        longDescription: "The Everest Base Camp trek is the adventure of a lifetime. Journey through the Khumbu region, home to the legendary Sherpa people. Trek through rhododendron forests, cross suspension bridges over roaring rivers, and acclimatize in Namche Bazaar. Visit the famous Tengboche Monastery, witness sunrise over Everest from Kala Patthar (5,545m), and finally stand at Everest Base Camp (5,364m). This challenging trek requires good fitness and proper acclimatization.",
        image: "https://images.unsplash.com/photo-1571173138057-f618f6b8b4d5?w=800&q=80",
        rating: 5.0,
        basePrice: 95000,
        minTravelers: 1,
        duration: "14 days",
        difficulty: "Challenging",
        highlights: [
            "Reach Everest Base Camp at 5,364m",
            "Sunrise from Kala Patthar viewpoint",
            "Visit Tengboche Monastery",
            "Experience Sherpa culture in Namche Bazaar",
            "Fly into Lukla - one of the world's most scenic airports"
        ],
        addons: [
            {
                id: "hotel_ebc",
                type: "hotel",
                label: "Accommodation",
                options: [
                    { value: "teahouse", label: "Standard Teahouse", price: 0 },
                    { value: "comfort", label: "Comfort Teahouse", price: 15000 }
                ]
            },
            {
                id: "porter_ebc",
                type: "porter",
                label: "Porter Service",
                options: [
                    { value: "none", label: "No Porter", price: 0 },
                    { value: "shared", label: "Shared Porter (2 people)", price: 18000 },
                    { value: "personal", label: "Personal Porter", price: 35000 }
                ]
            }
        ]
    },
    {
        id: 4,
        name: "Kathmandu Heritage",
        category: "cultural",
        description: "Dive into the rich history of Nepal's capital. Explore UNESCO World Heritage Sites, ancient temples, and bustling bazaars.",
        longDescription: "Kathmandu Valley is home to seven UNESCO World Heritage Sites. Explore the sacred Pashupatinath Temple, marvel at the massive stupa of Boudhanath, wander through the medieval courtyards of Patan Durbar Square, and visit the hilltop temple of Swayambhunath (Monkey Temple). Experience the vibrant chaos of Thamel, taste authentic Newari cuisine, and discover why Kathmandu is called the 'City of Temples'. Perfect for culture enthusiasts and history buffs.",
        image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&q=80",
        rating: 4.7,
        basePrice: 12000,
        minTravelers: 1,
        duration: "3 days",
        difficulty: "Easy",
        highlights: [
            "Visit 3 UNESCO World Heritage Sites",
            "Explore Patan Durbar Square's ancient architecture",
            "Witness evening prayers at Pashupatinath",
            "Shop for authentic handicrafts in Thamel",
            "Traditional Newari food tour"
        ],
        addons: [
            {
                id: "hotel_ktm",
                type: "hotel",
                label: "Hotel Type",
                options: [
                    { value: "budget", label: "Budget Hotel", price: 0 },
                    { value: "boutique", label: "Boutique Heritage Hotel", price: 6000 },
                    { value: "luxury", label: "5-Star Luxury", price: 12000 }
                ]
            },
            {
                id: "guide_ktm",
                type: "guide",
                label: "Guide Service",
                options: [
                    { value: "none", label: "Self-Guided", price: 0 },
                    { value: "cultural", label: "Cultural Heritage Guide", price: 4500 }
                ]
            }
        ]
    },
    {
        id: 5,
        name: "Annapurna Circuit",
        category: "trekking",
        description: "One of the world's greatest treks, circling the Annapurna massif through diverse landscapes and cultures.",
        longDescription: "The Annapurna Circuit is renowned as one of the world's most spectacular treks. Journey from subtropical forests to alpine meadows, cross the challenging Thorong La Pass at 5,416m, and circle the entire Annapurna massif. Experience diverse cultures from Hindu lowlands to Tibetan-influenced high valleys, visit the sacred Muktinath temple, and soak in natural hot springs at Tatopani. This 15-20 day adventure showcases Nepal's incredible diversity in terrain, climate, and culture.",
        image: "https://images.unsplash.com/photo-1583511655826-05700b666e24?w=800&q=80",
        rating: 4.9,
        basePrice: 75000,
        minTravelers: 1,
        duration: "15-18 days",
        difficulty: "Challenging",
        highlights: [
            "Cross Thorong La Pass (5,416m)",
            "Visit the sacred Muktinath temple",
            "Experience 8 climate zones",
            "Stay in diverse ethnic communities",
            "Relax in natural hot springs at Tatopani"
        ],
        addons: [
            {
                id: "hotel_annapurna",
                type: "hotel",
                label: "Accommodation",
                options: [
                    { value: "basic", label: "Basic Teahouse", price: 0 },
                    { value: "comfort", label: "Comfort Lodge", price: 12000 }
                ]
            },
            {
                id: "guide_annapurna",
                type: "guide",
                label: "Support Team",
                options: [
                    { value: "guide", label: "Guide Only", price: 22000 },
                    { value: "full", label: "Guide + Porter", price: 38000 }
                ]
            }
        ]
    },
    {
        id: 6,
        name: "Chitwan Safari",
        category: "adventure",
        description: "Spot Bengal tigers, one-horned rhinos, and exotic birds in Nepal's premier wildlife reserve.",
        longDescription: "Chitwan National Park is Nepal's first national park and a UNESCO World Heritage Site. Home to endangered species including Bengal tigers and one-horned rhinoceros, Chitwan offers an incredible wildlife experience. Enjoy jungle safaris on elephant-back or in open jeeps, canoe down the Rapti River spotting gharial crocodiles, visit a Tharu village to learn about indigenous culture, and watch traditional stick dances. This lowland tropical adventure contrasts beautifully with Nepal's mountain regions.",
        image: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80",
        rating: 4.6,
        basePrice: 28000,
        minTravelers: 2,
        duration: "3-4 days",
        difficulty: "Easy",
        highlights: [
            "Jungle safari to spot rhinos and tigers",
            "Canoe ride on Rapti River",
            "Visit authentic Tharu village",
            "Bird watching (500+ species)",
            "Traditional Tharu cultural performance"
        ],
        addons: [
            {
                id: "hotel_chitwan",
                type: "hotel",
                label: "Resort Category",
                options: [
                    { value: "standard", label: "Standard Jungle Resort", price: 0 },
                    { value: "premium", label: "Premium Eco-Lodge", price: 9000 },
                    { value: "luxury", label: "Luxury Safari Resort", price: 20000 }
                ]
            },
            {
                id: "safari_chitwan",
                type: "safari",
                label: "Safari Package",
                options: [
                    { value: "basic", label: "Standard Package", price: 0 },
                    { value: "extended", label: "Extended Safari Package", price: 8000 }
                ]
            }
        ]
    },
    {
        id: 7,
        name: "Langtang Valley",
        category: "trekking",
        description: "Trek through pristine forests and traditional Tamang villages with spectacular mountain views.",
        longDescription: "The Langtang Valley trek offers stunning Himalayan scenery closer to Kathmandu than other major trekking regions. Severely affected by the 2015 earthquake, the valley has rebuilt and welcomes trekkers warmly. Trek through rhododendron and bamboo forests, visit ancient Buddhist monasteries, experience Tamang culture, and reach Kyanjin Gompa (3,870m) with panoramic views of Langtang Lirung. Optional climb to Tserko Ri (4,984m) for incredible sunrise views. This moderate trek perfectly combines natural beauty with cultural immersion.",
        image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=80",
        rating: 4.7,
        basePrice: 38000,
        minTravelers: 1,
        duration: "7-9 days",
        difficulty: "Moderate",
        highlights: [
            "Hike to Kyanjin Gompa monastery",
            "Optional climb to Tserko Ri viewpoint",
            "Experience Tamang culture and hospitality",
            "Trek through rhododendron forests",
            "Visit artisanal cheese factory"
        ],
        addons: [
            {
                id: "hotel_langtang",
                type: "hotel",
                label: "Accommodation",
                options: [
                    { value: "basic", label: "Basic Teahouse", price: 0 },
                    { value: "comfort", label: "Comfort Lodge", price: 6000 }
                ]
            },
            {
                id: "guide_langtang",
                type: "guide",
                label: "Guide Service",
                options: [
                    { value: "local", label: "Local Guide", price: 0 },
                    { value: "expert", label: "Expert Guide", price: 9000 }
                ]
            }
        ]
    },
    {
        id: 8,
        name: "Lumbini Pilgrimage",
        category: "cultural",
        description: "Visit the birthplace of Lord Buddha, a sacred pilgrimage site with beautiful monasteries and gardens.",
        longDescription: "Lumbini, the birthplace of Siddhartha Gautama (Lord Buddha), is one of the most important spiritual sites in the world. Explore the sacred Maya Devi Temple marking the exact birthplace, walk through the peaceful monastery zone featuring temples from different Buddhist nations, visit the Ashoka Pillar erected in 249 BCE, and meditate in the tranquil gardens. This UNESCO World Heritage Site offers a profound spiritual experience and insight into Buddhist culture and history.",
        image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
        rating: 4.8,
        basePrice: 15000,
        minTravelers: 1,
        duration: "2-3 days",
        difficulty: "Easy",
        highlights: [
            "Visit Maya Devi Temple - Buddha's birthplace",
            "Explore international monastery zone",
            "See the ancient Ashoka Pillar",
            "Meditation sessions in sacred gardens",
            "Lumbini Museum and Cultural Center"
        ],
        addons: [
            {
                id: "hotel_lumbini",
                type: "hotel",
                label: "Hotel Type",
                options: [
                    { value: "budget", label: "Budget Hotel", price: 0 },
                    { value: "monastery", label: "Monastery Guest House", price: 3500 },
                    { value: "premium", label: "Premium Hotel", price: 8000 }
                ]
            },
            {
                id: "guide_lumbini",
                type: "guide",
                label: "Guide Service",
                options: [
                    { value: "none", label: "Self-Guided", price: 0 },
                    { value: "spiritual", label: "Spiritual Guide", price: 3000 }
                ]
            }
        ]
    }
];

// Budget ranges for filtering
const budgetRanges = {
    budget: { min: 0, max: 30000 },
    mid: { min: 30000, max: 60000 },
    high: { min: 60000, max: 100000 },
    luxury: { min: 100000, max: Infinity }
};
