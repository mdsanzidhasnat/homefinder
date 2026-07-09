import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const AGENTS = [
  {
    name: "Rafiq Hasan",
    email: "rafiq@bdhomefinder.com",
    phone: "+880 1711-111111",
    agency_name: "Rafiq Real Estate",
  },
  {
    name: "Farzana Akhter",
    email: "farzana@bdhomefinder.com",
    phone: "+880 1711-222222",
    agency_name: "Akhter Properties Ltd.",
  },
  {
    name: "Kamal Hossain",
    email: "kamal@bdhomefinder.com",
    phone: "+880 1711-333333",
    agency_name: "Kamal Housing",
  },
  {
    name: "Shahin Alam",
    email: "shahin@bdhomefinder.com",
    phone: "+880 1711-444444",
    agency_name: "Shahin Developers",
  },
  {
    name: "Nasrin Sultana",
    email: "nasrin@bdhomefinder.com",
    phone: "+880 1711-555555",
    agency_name: "Nasrin Properties",
  },
];

const LISTINGS = [
  {
    title_bn: "গুলশান ২-এ ৩ বেডরুমের আধুনিক ফ্ল্যাট",
    title_en: "Modern 3BR Apartment in Gulshan 2",
    description_bn:
      "গুলশান ২-এর প্রাণকেন্দ্রে অবস্থিত একটি অত্যাধুনিক ৩ বেডরুমের ফ্ল্যাট। প্রশস্ত ব্যালকনি, সেন্ট্রালি এয়ার কন্ডিশন্ড, এবং সম্পূর্ণ সজ্জিত রান্নাঘর। নিরাপত্তা ব্যবস্থা এবং জেনারেটর ব্যাকআপ সহ।",
    description_en:
      "A state-of-the-art 3-bedroom apartment in the heart of Gulshan 2. Spacious balcony, centrally air-conditioned, and fully equipped kitchen. Security system and generator backup included.",
    type: "apartment",
    purpose: "sale",
    price: 45000000,
    area: 1500,
    area_unit: "sqft",
    bedrooms: 3,
    bathrooms: 3,
    floor_number: 8,
    total_floors: 15,
    facing_direction: "south",
    amenities: ["Gas line", "Lift", "Generator", "Parking", "Security", "Community facilities"],
    division: "dhaka",
    district: "dhaka",
    area_name: "gulshan",
    lat: 23.7925,
    lng: 90.4078,
  },
  {
    title_bn: "ধানমন্ডি ২৭-এ ছোট পরিবারের জন্য ২ বেডরুমের ফ্ল্যাট",
    title_en: "Cozy 2BR Flat in Dhanmondi 27 for Small Family",
    description_bn:
      "ধানমন্ডি ২৭-এর শান্ত এলাকায় অবস্থিত ২ বেডরুমের ফ্ল্যাট। সব ধরনের সুযোগ-সুবিধা সহ, বিদ্যালয় ও বাজারের কাছাকাছি।",
    description_en:
      "A 2-bedroom flat located in the quiet area of Dhanmondi 27. Equipped with all amenities, close to schools and markets.",
    type: "apartment",
    purpose: "sale",
    price: 28000000,
    area: 1100,
    area_unit: "sqft",
    bedrooms: 2,
    bathrooms: 2,
    floor_number: 4,
    total_floors: 8,
    facing_direction: "east",
    amenities: ["Gas line", "Lift", "Generator", "Parking", "Security"],
    division: "dhaka",
    district: "dhaka",
    area_name: "dhanmondi",
    lat: 23.7465,
    lng: 90.3755,
  },
  {
    title_bn: "উত্তরা সেক্টর-১০-এ ৪ বেডরুমের বিলাসবহুল অ্যাপার্টমেন্ট",
    title_en: "Luxurious 4BR Apartment in Uttara Sector 10",
    description_bn:
      "উত্তরা সেক্টর-১০-এর একটি অভিজাত এলাকায় ৪ বেডরুমের অ্যাপার্টমেন্ট। রয়েছে সিপি, জিম, সুইমিং পুল এবং বাচ্চাদের খেলার জায়গা।",
    description_en:
      "A 4-bedroom apartment in an upscale area of Uttara Sector 10. Features include clubhouse, gym, swimming pool, and children's play area.",
    type: "apartment",
    purpose: "sale",
    price: 65000000,
    area: 2000,
    area_unit: "sqft",
    bedrooms: 4,
    bathrooms: 4,
    floor_number: 12,
    total_floors: 18,
    facing_direction: "north",
    amenities: ["Gas line", "Lift", "Generator", "Parking", "Security", "Community facilities"],
    division: "dhaka",
    district: "dhaka",
    area_name: "uttara",
    lat: 23.8759,
    lng: 90.3795,
  },
  {
    title_bn: "বসুন্ধরা আবাসিক এলাকায় ৫ কাঠার প্লট",
    title_en: "5 Katha Residential Plot in Bashundhara R/A",
    description_bn:
      "বসুন্ধরা আবাসিক এলাকায় ৫ কাঠার একটি সুন্দর প্লট। গেটেড সম্প্রদায়, ২৪/৭ নিরাপত্তা এবং কেন্দ্রীয় পার্কের কাছাকাছি।",
    description_en:
      "A beautiful 5 Katha plot in Bashundhara Residential Area. Gated community, 24/7 security, and close to central park.",
    type: "land",
    purpose: "sale",
    price: 75000000,
    area: 5,
    area_unit: "katha",
    bedrooms: 0,
    bathrooms: 0,
    facing_direction: "south",
    amenities: ["Security", "Community facilities"],
    division: "dhaka",
    district: "dhaka",
    area_name: "bashundhara",
    lat: 23.8147,
    lng: 90.4261,
  },
  {
    title_bn: "মিরপুর ১২-এ ২ বেডরুমের ফ্ল্যাট ভাড়া",
    title_en: "2BR Flat for Rent in Mirpur 12",
    description_bn:
      "মিরপুর ১২-এ অবস্থিত ২ বেডরুমের ফ্ল্যাট ভাড়া দেওয়া হবে। সব ধরনের মৌলিক সুবিধা সহ, পরিবারের জন্য উপযোগী।",
    description_en:
      "2-bedroom flat available for rent in Mirpur 12. Equipped with all basic amenities, suitable for families.",
    type: "apartment",
    purpose: "rent",
    price: 25000,
    area: 850,
    area_unit: "sqft",
    bedrooms: 2,
    bathrooms: 1,
    floor_number: 3,
    total_floors: 6,
    facing_direction: "west",
    amenities: ["Gas line", "Generator", "Parking", "Security"],
    division: "dhaka",
    district: "dhaka",
    area_name: "mirpur",
    lat: 23.7873,
    lng: 90.3525,
  },
  {
    title_bn: "বনানী বাণিজ্যিক এলাকায় অফিস স্পেস",
    title_en: "Office Space in Banani Commercial Area",
    description_bn:
      "বনানীর প্রধান বাণিজ্যিক এলাকায় ১২০০ বর্গফুটের অফিস স্পেস। সম্পূর্ণ সাজানো, পার্কিং ও ক্যান্টিন সুবিধা সহ।",
    description_en:
      "1200 sqft office space in Banani prime commercial area. Fully furnished with parking and cafeteria facilities.",
    type: "office",
    purpose: "rent",
    price: 85000,
    area: 1200,
    area_unit: "sqft",
    bedrooms: 0,
    bathrooms: 2,
    floor_number: 6,
    total_floors: 12,
    facing_direction: "north",
    amenities: ["Lift", "Generator", "Parking", "Security"],
    division: "dhaka",
    district: "dhaka",
    area_name: "banani",
    lat: 23.7937,
    lng: 90.4065,
  },
  {
    title_bn: "আগ্রাবাদে ৩ বেডরুমের আধুনিক অ্যাপার্টমেন্ট",
    title_en: "Modern 3BR Apartment in Agrabad",
    description_bn:
      "চট্টগ্রামের আগ্রাবাদ এলাকায় নির্মাণাধীন একটি আধুনিক ৩ বেডরুমের অ্যাপার্টমেন্ট। উন্নতমানের ফিনিশিং এবং নগরের সেরা দৃশ্য।",
    description_en:
      "A modern 3-bedroom apartment under construction in Agrabad, Chattogram. Premium finishing and stunning city views.",
    type: "apartment",
    purpose: "sale",
    price: 35000000,
    area: 1400,
    area_unit: "sqft",
    bedrooms: 3,
    bathrooms: 2,
    floor_number: 7,
    total_floors: 14,
    facing_direction: "south",
    amenities: ["Gas line", "Lift", "Generator", "Parking", "Security"],
    division: "chattogram",
    district: "chattogram",
    area_name: "agrabad",
    lat: 22.3245,
    lng: 91.8002,
  },
  {
    title_bn: "খুলশীতে ২ বেডরুমের ফ্ল্যাট",
    title_en: "2BR Flat in Khulshi",
    description_bn:
      "চট্টগ্রামের খুলশী এলাকায় পরিবারের জন্য আদর্শ ২ বেডরুমের ফ্ল্যাট। সবুজ পরিবেশ এবং সহজ যোগাযোগ ব্যবস্থা।",
    description_en:
      "Ideal 2-bedroom flat for family in Khulshi, Chattogram. Green environment and easy communication.",
    type: "apartment",
    purpose: "sale",
    price: 22000000,
    area: 1000,
    area_unit: "sqft",
    bedrooms: 2,
    bathrooms: 2,
    floor_number: 5,
    total_floors: 10,
    facing_direction: "east",
    amenities: ["Gas line", "Lift", "Generator", "Parking"],
    division: "chattogram",
    district: "chattogram",
    area_name: "khulshi",
    lat: 22.3478,
    lng: 91.7975,
  },
  {
    title_bn: "হালিশহরে দোকান স্পেস ভাড়া",
    title_en: "Shop Space for Rent in Halishahar",
    description_bn:
      "হালিশহর বাজারে ৪০০ বর্গফুটের দোকান স্পেস ভাড়া দেওয়া হবে। উচ্চ ট্রাফিক এলাকা, ব্যবসার জন্য উপযুক্ত।",
    description_en:
      "400 sqft shop space for rent at Halishahar Market. High traffic area, suitable for business.",
    type: "shop",
    purpose: "rent",
    price: 30000,
    area: 400,
    area_unit: "sqft",
    bedrooms: 0,
    bathrooms: 1,
    facing_direction: "north",
    amenities: ["Generator", "Parking", "Security"],
    division: "chattogram",
    district: "chattogram",
    area_name: "halishahar",
    lat: 22.3485,
    lng: 91.7702,
  },
  {
    title_bn: "সিলেট সদরে ৩ বেডরুমের স্বতন্ত্র বাড়ি",
    title_en: "3BR Independent House in Sylhet Sadar",
    description_bn:
      "সিলেট সদরের শান্ত আবাসিক এলাকায় ৩ বেডরুমের স্বতন্ত্র বাড়ি। প্রশস্ত বারান্দা এবং বাগান সহ।",
    description_en:
      "3-bedroom independent house in a quiet residential area of Sylhet Sadar. Spacious veranda and garden included.",
    type: "house",
    purpose: "sale",
    price: 30000000,
    area: 3,
    area_unit: "katha",
    bedrooms: 3,
    bathrooms: 3,
    floor_number: 2,
    total_floors: 2,
    facing_direction: "south",
    amenities: ["Gas line", "Generator", "Parking", "Security"],
    division: "sylhet",
    district: "sylhet",
    area_name: "sylhet-sadar",
    lat: 24.897,
    lng: 91.871,
  },
  {
    title_bn: "খুলনা সদরে বাণিজ্যিক স্থান",
    title_en: "Commercial Space in Khulna Sadar",
    description_bn:
      "খুলনা সদরের প্রধান সড়কের পাশে ২৫০০ বর্গফুটের বাণিজ্যিক স্থান। শোরুম বা অফিসের জন্য উপযুক্ত।",
    description_en:
      "2500 sqft commercial space on main road in Khulna Sadar. Suitable for showroom or office.",
    type: "commercial",
    purpose: "sale",
    price: 40000000,
    area: 2500,
    area_unit: "sqft",
    bedrooms: 0,
    bathrooms: 2,
    facing_direction: "west",
    amenities: ["Gas line", "Lift", "Generator", "Parking", "Security"],
    division: "khulna",
    district: "khulna",
    area_name: "khulna-sadar",
    lat: 22.848,
    lng: 89.542,
  },
  {
    title_bn: "রাজশাহী বোয়ালিয়ায় ২ কাঠার প্লট",
    title_en: "2 Katha Plot in Boalia, Rajshahi",
    description_bn:
      "রাজশাহীর বোয়ালিয়া এলাকায় ২ কাঠার আবাসিক প্লট। নগরের সুবিধার কাছাকাছি এবং শান্ত পরিবেশ।",
    description_en:
      "2 Katha residential plot in Boalia, Rajshahi. Close to city amenities with peaceful environment.",
    type: "land",
    purpose: "sale",
    price: 12000000,
    area: 2,
    area_unit: "katha",
    bedrooms: 0,
    bathrooms: 0,
    facing_direction: "north",
    amenities: ["Community facilities"],
    division: "rajshahi",
    district: "rajshahi",
    area_name: "boalia",
    lat: 24.3764,
    lng: 88.6066,
  },
  {
    title_bn: "মতিঝিলে অফিস স্পেস ভাড়া",
    title_en: "Office Space for Rent in Motijheel",
    description_bn:
      "ঢাকার মতিঝিল বাণিজ্যিক এলাকায় ৮০০ বর্গফুটের অফিস স্পেস ভাড়া। নগরের কেন্দ্রস্থলে অবস্থিত।",
    description_en:
      "800 sqft office space for rent in Motijheel commercial area, Dhaka. Located in the city center.",
    type: "office",
    purpose: "rent",
    price: 60000,
    area: 800,
    area_unit: "sqft",
    bedrooms: 0,
    bathrooms: 1,
    floor_number: 9,
    total_floors: 20,
    facing_direction: "east",
    amenities: ["Lift", "Generator", "Parking", "Security"],
    division: "dhaka",
    district: "dhaka",
    area_name: "motijheel",
    lat: 23.7301,
    lng: 90.4178,
  },
  {
    title_bn: "মোহাম্মদপুরে ১ বেডরুমের ফ্ল্যাট ভাড়া",
    title_en: "1BR Flat for Rent in Mohammadpur",
    description_bn:
      "মোহাম্মদপুরের শান্ত এলাকায় বachelor/ছোট পরিবারের জন্য ১ বেডরুমের ফ্ল্যাট। বাজার ও পরিবহনের কাছাকাছি।",
    description_en:
      "1-bedroom flat for rent in quiet Mohammadpur area for bachelor/small family. Close to market and transport.",
    type: "apartment",
    purpose: "rent",
    price: 15000,
    area: 600,
    area_unit: "sqft",
    bedrooms: 1,
    bathrooms: 1,
    floor_number: 2,
    total_floors: 5,
    facing_direction: "east",
    amenities: ["Gas line", "Generator", "Security"],
    division: "dhaka",
    district: "dhaka",
    area_name: "mohammadpur",
    lat: 23.7658,
    lng: 90.3585,
  },
  {
    title_bn: "পুরান ঢাকায় কারখানা/গোডাউন",
    title_en: "Warehouse in Old Dhaka",
    description_bn:
      "পুরান ঢাকায় ৩০০০ বর্গফুটের গোডাউন/কারখানা স্পেস। বড় গাড়ি প্রবেশের সুবিধা সহ।",
    description_en:
      "3000 sqft warehouse/factory space in Old Dhaka. With large vehicle access.",
    type: "warehouse",
    purpose: "rent",
    price: 100000,
    area: 3000,
    area_unit: "sqft",
    bedrooms: 0,
    bathrooms: 1,
    facing_direction: "north",
    amenities: ["Generator", "Parking", "Security"],
    division: "dhaka",
    district: "dhaka",
    area_name: "old-dhaka",
    lat: 23.7125,
    lng: 90.4045,
  },
  {
    title_bn: "নাসিরাবাদে ৪ বেডরুমের বাড়ি",
    title_en: "4BR House in Nasirabad",
    description_bn:
      "চট্টগ্রামের নাসিরাবাদ এলাকায় ৪ বেডরুমের স্বতন্ত্র বাড়ি। ছাদ বাগান এবং গ্যারেজ সহ।",
    description_en:
      "4-bedroom independent house in Nasirabad, Chattogram. With rooftop garden and garage.",
    type: "house",
    purpose: "sale",
    price: 55000000,
    area: 4,
    area_unit: "katha",
    bedrooms: 4,
    bathrooms: 4,
    floor_number: 2,
    total_floors: 3,
    facing_direction: "south",
    amenities: ["Gas line", "Generator", "Parking", "Security"],
    division: "chattogram",
    district: "chattogram",
    area_name: "nasirabad",
    lat: 22.3501,
    lng: 91.8103,
  },
  {
    title_bn: "চান্দগাঁওয়ে জমি বিক্রয়",
    title_en: "Land for Sale in Chandgaon",
    description_bn:
      "চট্টগ্রামের চান্দগাঁওয়ে ৫ ডেসিমেল আবাসিক জমি। রাস্তা ও ড্রেনেজ সুবিধা সহ।",
    description_en:
      "5 decimal residential land in Chandgaon, Chattogram. With road and drainage facilities.",
    type: "land",
    purpose: "sale",
    price: 8000000,
    area: 5,
    area_unit: "decimal",
    bedrooms: 0,
    bathrooms: 0,
    facing_direction: "east",
    amenities: [],
    division: "chattogram",
    district: "chattogram",
    area_name: "chandgaon",
    lat: 22.3712,
    lng: 91.8185,
  },
  {
    title_bn: "টঙ্গীতে ৩ বেডরুমের ফ্ল্যাট",
    title_en: "3BR Flat in Tongi",
    description_bn:
      "টঙ্গীতে সাশ্রয়ী মূল্যে ৩ বেডরুমের ফ্ল্যাট। পরিবারের জন্য উপযোগী, সব মৌলিক সুবিধা সহ।",
    description_en:
      "Affordable 3-bedroom flat in Tongi. Suitable for families with all basic amenities.",
    type: "apartment",
    purpose: "sale",
    price: 15000000,
    area: 1200,
    area_unit: "sqft",
    bedrooms: 3,
    bathrooms: 2,
    floor_number: 4,
    total_floors: 8,
    facing_direction: "west",
    amenities: ["Gas line", "Generator", "Parking"],
    division: "dhaka",
    district: "gazipur",
    area_name: "tongi",
    lat: 23.8912,
    lng: 90.4028,
  },
  {
    title_bn: "সোনাডাঙ্গায় দোকান স্পেস",
    title_en: "Shop Space in Sonadanga",
    description_bn:
      "খুলনার সোনাডাঙ্গা বাজারে ৩০০ বর্গফুটের দোকান স্পেস। ভালো ব্যবসার অবস্থান।",
    description_en:
      "300 sqft shop space at Sonadanga Market, Khulna. Good business location.",
    type: "shop",
    purpose: "rent",
    price: 20000,
    area: 300,
    area_unit: "sqft",
    bedrooms: 0,
    bathrooms: 1,
    facing_direction: "south",
    amenities: ["Generator", "Security"],
    division: "khulna",
    district: "khulna",
    area_name: "sonadanga",
    lat: 22.8178,
    lng: 89.5555,
  },
  {
    title_bn: "বরিশাল সদরে ২ বেডরুমের ফ্ল্যাট",
    title_en: "2BR Flat in Barisal Sadar",
    description_bn:
      "বরিশাল সদরের শান্ত এলাকায় ২ বেডরুমের ফ্ল্যাট। পরিবারের জন্য আদর্শ।",
    description_en:
      "2-bedroom flat in a quiet area of Barisal Sadar. Ideal for families.",
    type: "apartment",
    purpose: "sale",
    price: 12000000,
    area: 900,
    area_unit: "sqft",
    bedrooms: 2,
    bathrooms: 1,
    floor_number: 3,
    total_floors: 6,
    facing_direction: "east",
    amenities: ["Gas line", "Generator", "Parking"],
    division: "barisal",
    district: "barisal",
    area_name: "barisal-sadar",
    lat: 22.703,
    lng: 90.355,
  },
  {
    title_bn: "রংপুর সদরে ৩ বেডরুমের বাড়ি",
    title_en: "3BR House in Rangpur Sadar",
    description_bn:
      "রংপুর সদরে ৩ বেডরুমের স্বতন্ত্র বাড়ি। বড় উঠান এবং ২ কাঠা জমি সহ।",
    description_en:
      "3-bedroom independent house in Rangpur Sadar. With large courtyard and 2 Katha land.",
    type: "house",
    purpose: "sale",
    price: 20000000,
    area: 2,
    area_unit: "katha",
    bedrooms: 3,
    bathrooms: 2,
    floor_number: 1,
    total_floors: 2,
    facing_direction: "south",
    amenities: ["Gas line", "Parking", "Security"],
    division: "rangpur",
    district: "rangpur",
    area_name: "rangpur-sadar",
    lat: 25.745,
    lng: 89.277,
  },
  {
    title_bn: "ময়মনসিংহ সদরে অফিস স্পেস",
    title_en: "Office Space in Mymensingh Sadar",
    description_bn:
      "ময়মনসিংহ সদরে ৫০০ বর্গফুটের অফিস স্পেস। শহরের প্রধান এলাকায় অবস্থিত।",
    description_en:
      "500 sqft office space in Mymensingh Sadar. Located in the prime area of the city.",
    type: "office",
    purpose: "rent",
    price: 25000,
    area: 500,
    area_unit: "sqft",
    bedrooms: 0,
    bathrooms: 1,
    floor_number: 2,
    total_floors: 4,
    facing_direction: "north",
    amenities: ["Generator", "Parking"],
    division: "mymensingh",
    district: "mymensingh",
    area_name: "mymensingh-sadar",
    lat: 24.755,
    lng: 90.409,
  },
  {
    title_bn: "গুলশানে বিলাসবহুল পেন্টহাউস",
    title_en: "Luxury Penthouse in Gulshan",
    description_bn:
      "গুলশানের সবচেয়ে উঁচু ভবনের ২০ তলায় বিলাসবহুল পেন্টহাউস। ৩৬০ ডিগ্রি শহরের দৃশ্য।",
    description_en:
      "Luxury penthouse on the 20th floor of the tallest building in Gulshan. 360-degree city view.",
    type: "apartment",
    purpose: "sale",
    price: 120000000,
    area: 3500,
    area_unit: "sqft",
    bedrooms: 5,
    bathrooms: 5,
    floor_number: 20,
    total_floors: 22,
    facing_direction: "north",
    amenities: ["Gas line", "Lift", "Generator", "Parking", "Security", "Community facilities"],
    division: "dhaka",
    district: "dhaka",
    area_name: "gulshan",
    lat: 23.7935,
    lng: 90.4088,
  },
  {
    title_bn: "ধানমন্ডিতে ১ কাঠার প্লট",
    title_en: "1 Katha Plot in Dhanmondi",
    description_bn:
      "ধানমন্ডি লেকের কাছাকাছি ১ কাঠার আবাসিক প্লট। খুবই চাহিদাসম্পন্ন এলাকা।",
    description_en:
      "1 Katha residential plot near Dhanmondi Lake. Highly sought-after location.",
    type: "land",
    purpose: "sale",
    price: 35000000,
    area: 1,
    area_unit: "katha",
    bedrooms: 0,
    bathrooms: 0,
    facing_direction: "south",
    amenities: ["Security"],
    division: "dhaka",
    district: "dhaka",
    area_name: "dhanmondi",
    lat: 23.7455,
    lng: 90.3765,
  },
  {
    title_bn: "উত্তরায় ৩ বেডরুমের ফ্ল্যাট ভাড়া",
    title_en: "3BR Flat for Rent in Uttara",
    description_bn:
      "উত্তরা সেক্টর-৪-এ ৩ বেডরুমের ফ্ল্যাট ভাড়া। সব ধরনের আধুনিক সুবিধা সহ।",
    description_en:
      "3-bedroom flat for rent in Uttara Sector 4. With all modern amenities.",
    type: "apartment",
    purpose: "rent",
    price: 45000,
    area: 1300,
    area_unit: "sqft",
    bedrooms: 3,
    bathrooms: 2,
    floor_number: 6,
    total_floors: 12,
    facing_direction: "south",
    amenities: ["Gas line", "Lift", "Generator", "Parking", "Security"],
    division: "dhaka",
    district: "dhaka",
    area_name: "uttara",
    lat: 23.8769,
    lng: 90.3805,
  },
  {
    title_bn: "খুলশীতে বাণিজ্যিক ভবন",
    title_en: "Commercial Building in Khulshi",
    description_bn:
      "চট্টগ্রামের খুলশীতে ৬ তলা বাণিজ্যিক ভবন। প্রতিটি তলা ১০০০ বর্গফুট।",
    description_en:
      "6-story commercial building in Khulshi, Chattogram. Each floor is 1000 sqft.",
    type: "commercial",
    purpose: "sale",
    price: 80000000,
    area: 6000,
    area_unit: "sqft",
    bedrooms: 0,
    bathrooms: 6,
    floor_number: 6,
    total_floors: 6,
    facing_direction: "east",
    amenities: ["Lift", "Generator", "Parking", "Security"],
    division: "chattogram",
    district: "chattogram",
    area_name: "khulshi",
    lat: 22.3488,
    lng: 91.7985,
  },
  {
    title_bn: "জৈন্তাপুরে ১০ বিঘা কৃষি জমি",
    title_en: "10 Bigha Agricultural Land in Jaintiapur",
    description_bn:
      "সিলেটের জৈন্তাপুরে ১০ বিঘা কৃষি জমি। পানি সেচ ব্যবস্থা সহ।",
    description_en:
      "10 Bigha agricultural land in Jaintiapur, Sylhet. With irrigation system.",
    type: "land",
    purpose: "sale",
    price: 25000000,
    area: 10,
    area_unit: "bigha",
    bedrooms: 0,
    bathrooms: 0,
    facing_direction: "north",
    amenities: [],
    division: "sylhet",
    district: "sylhet",
    area_name: "jaintiapur",
    lat: 24.9833,
    lng: 92.1167,
  },
  {
    title_bn: "কালিয়াকৈরে কারখানা ভবন",
    title_en: "Factory Building in Kaliakair",
    description_bn:
      "গাজীপুরের কালিয়াকৈরে ৫০০০ বর্গফুটের কারখানা ভবন। শিল্প এলাকায় অবস্থিত।",
    description_en:
      "5000 sqft factory building in Kaliakair, Gazipur. Located in industrial area.",
    type: "warehouse",
    purpose: "sale",
    price: 35000000,
    area: 5000,
    area_unit: "sqft",
    bedrooms: 0,
    bathrooms: 3,
    facing_direction: "south",
    amenities: ["Generator", "Parking", "Security"],
    division: "dhaka",
    district: "gazipur",
    area_name: "kaliakair",
    lat: 24.0245,
    lng: 90.2184,
  },
  {
    title_bn: "মুক্তাগাছায় ২ বেডরুমের বাড়ি",
    title_en: "2BR House in Muktagacha",
    description_bn:
      "ময়মনসিংহের মুক্তাগাছায় ২ বেডরুমের স্বতন্ত্র বাড়ি। শান্ত গ্রামীণ পরিবেশ।",
    description_en:
      "2-bedroom independent house in Muktagacha, Mymensingh. Peaceful rural environment.",
    type: "house",
    purpose: "sale",
    price: 8000000,
    area: 10,
    area_unit: "decimal",
    bedrooms: 2,
    bathrooms: 1,
    floor_number: 1,
    total_floors: 1,
    facing_direction: "east",
    amenities: ["Gas line"],
    division: "mymensingh",
    district: "mymensingh",
    area_name: "muktagacha",
    lat: 24.76,
    lng: 90.27,
  },
  {
    title_bn: "ফতুল্লায় ২ কাঠা জমি সহ বাড়ি",
    title_en: "House with 2 Katha Land in Fatullah",
    description_bn:
      "নারায়ণগঞ্জের ফতুল্লায় ২ কাঠা জমির উপর ৩ বেডরুমের বাড়ি। নারায়ণগঞ্জ শহরের কাছাকাছি।",
    description_en:
      "3-bedroom house on 2 Katha land in Fatullah, Narayanganj. Close to Narayanganj city.",
    type: "house",
    purpose: "sale",
    price: 25000000,
    area: 2,
    area_unit: "katha",
    bedrooms: 3,
    bathrooms: 2,
    floor_number: 2,
    total_floors: 2,
    facing_direction: "west",
    amenities: ["Gas line", "Generator", "Parking"],
    division: "dhaka",
    district: "narayanganj",
    area_name: "fatullah",
    lat: 23.6424,
    lng: 90.4888,
  },
  {
    title_bn: "খালিশপুরে ২ বেডরুমের ফ্ল্যাট",
    title_en: "2BR Flat in Khalishpur",
    description_bn:
      "খুলনার খালিশপুরে পরিবারের জন্য ২ বেডরুমের আরামদায়ক ফ্ল্যাট।",
    description_en:
      "Comfortable 2-bedroom flat for family in Khalishpur, Khulna.",
    type: "apartment",
    purpose: "rent",
    price: 18000,
    area: 750,
    area_unit: "sqft",
    bedrooms: 2,
    bathrooms: 1,
    floor_number: 1,
    total_floors: 4,
    facing_direction: "north",
    amenities: ["Gas line", "Generator"],
    division: "khulna",
    district: "khulna",
    area_name: "khalishpur",
    lat: 22.8694,
    lng: 89.5216,
  },
];

async function seed() {
  console.log("Starting seed...\n");

  for (const agent of AGENTS) {
    const { data: existing } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("email", agent.email)
      .maybeSingle();

    if (!existing) {
      const { data: authUser, error: authError } = await supabase.auth.signUp(
        {
          email: agent.email,
          password: "password123",
          options: { data: { name: agent.name } },
        }
      );

      if (authError) {
        console.error(`Auth error for ${agent.name}:`, authError.message);
        continue;
      }

      if (authUser.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          user_id: authUser.user.id,
          name: agent.name,
          email: agent.email,
          phone: agent.phone,
          role: "agent",
          agency_name: agent.agency_name,
        });

        if (profileError) {
          console.error(`Profile error for ${agent.name}:`, profileError.message);
          continue;
        }
      }
      console.log(`Created agent: ${agent.name}`);
    } else {
      console.log(`Agent already exists: ${agent.name}`);
    }
  }

  console.log("\nCreating listings...\n");

  const { data: agents } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "agent");

  if (!agents || agents.length === 0) {
    console.error("No agents found to assign listings");
    return;
  }

  for (let i = 0; i < LISTINGS.length; i++) {
    const listing = LISTINGS[i];
    const agent = agents[i % agents.length];

    const listingData = {
      title_bn: listing.title_bn,
      title_en: listing.title_en,
      description_bn: listing.description_bn,
      description_en: listing.description_en,
      type: listing.type,
      purpose: listing.purpose,
      price: listing.price,
      area: listing.area,
      area_unit: listing.area_unit,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      floor_number: listing.floor_number || null,
      total_floors: listing.total_floors || null,
      facing_direction: listing.facing_direction || null,
      amenities: listing.amenities,
      division: listing.division,
      district: listing.district,
      area_name: listing.area_name,
      lat: listing.lat,
      lng: listing.lng,
      status: "available",
      agent_id: agent.user_id,
      agent_name: agent.name,
      agent_phone: agent.phone || "",
      agent_email: agent.email,
      images: [],
      views: Math.floor(Math.random() * 500) + 50,
      posted_date: new Date(
        Date.now() - Math.floor(Math.random() * 90) * 86400000
      ).toISOString(),
    };

    const { error } = await supabase.from("listings").insert(listingData);
    if (error) {
      console.error(`Error creating listing "${listing.title_en}":`, error.message);
    } else {
      console.log(`Created listing (${i + 1}/${LISTINGS.length}): ${listing.title_en}`);
    }
  }

  console.log("\nSeed complete!");
}

seed().catch(console.error);
