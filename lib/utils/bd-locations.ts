export interface LocationOption {
  value: string;
  label_bn: string;
  label_en: string;
  districts: DistrictOption[];
}

export interface DistrictOption {
  value: string;
  label_bn: string;
  label_en: string;
  areas: AreaOption[];
  lat: number;
  lng: number;
}

export interface AreaOption {
  value: string;
  label_bn: string;
  label_en: string;
  lat: number;
  lng: number;
}

export const BD_LOCATIONS: LocationOption[] = [
  {
    value: "dhaka",
    label_bn: "ঢাকা",
    label_en: "Dhaka",
    districts: [
      {
        value: "dhaka",
        label_bn: "ঢাকা",
        label_en: "Dhaka",
        lat: 23.8103,
        lng: 90.4125,
        areas: [
          { value: "gulshan", label_bn: "গুলশান", label_en: "Gulshan", lat: 23.7925, lng: 90.4078 },
          { value: "dhanmondi", label_bn: "ধানমন্ডি", label_en: "Dhanmondi", lat: 23.7465, lng: 90.3755 },
          { value: "bashundhara", label_bn: "বসুন্ধরা", label_en: "Bashundhara", lat: 23.8147, lng: 90.4261 },
          { value: "uttara", label_bn: "উত্তরা", label_en: "Uttara", lat: 23.8759, lng: 90.3795 },
          { value: "mirpur", label_bn: "মিরপুর", label_en: "Mirpur", lat: 23.7873, lng: 90.3525 },
          { value: "banani", label_bn: "বনানী", label_en: "Banani", lat: 23.7937, lng: 90.4065 },
          { value: "motijheel", label_bn: "মতিঝিল", label_en: "Motijheel", lat: 23.7301, lng: 90.4178 },
          { value: "mohammadpur", label_bn: "মোহাম্মদপুর", label_en: "Mohammadpur", lat: 23.7658, lng: 90.3585 },
          { value: "old-dhaka", label_bn: "পুরান ঢাকা", label_en: "Old Dhaka", lat: 23.7125, lng: 90.4045 },
        ],
      },
      {
        value: "gazipur",
        label_bn: "গাজীপুর",
        label_en: "Gazipur",
        lat: 23.9988,
        lng: 90.4227,
        areas: [
          { value: "tongi", label_bn: "টঙ্গী", label_en: "Tongi", lat: 23.8912, lng: 90.4028 },
          { value: "kaliakair", label_bn: "কালিয়াকৈর", label_en: "Kaliakair", lat: 24.0245, lng: 90.2184 },
        ],
      },
      {
        value: "narayanganj",
        label_bn: "নারায়ণগঞ্জ",
        label_en: "Narayanganj",
        lat: 23.6213,
        lng: 90.4950,
        areas: [
          { value: "fatullah", label_bn: "ফতুল্লা", label_en: "Fatullah", lat: 23.6424, lng: 90.4888 },
        ],
      },
    ],
  },
  {
    value: "chattogram",
    label_bn: "চট্টগ্রাম",
    label_en: "Chattogram",
    districts: [
      {
        value: "chattogram",
        label_bn: "চট্টগ্রাম",
        label_en: "Chattogram",
        lat: 22.3569,
        lng: 91.7832,
        areas: [
          { value: "agrabad", label_bn: "আগ্রাবাদ", label_en: "Agrabad", lat: 22.3245, lng: 91.8002 },
          { value: "khulshi", label_bn: "খুলশী", label_en: "Khulshi", lat: 22.3478, lng: 91.7975 },
          { value: "halishahar", label_bn: "হালিশহর", label_en: "Halishahar", lat: 22.3485, lng: 91.7702 },
          { value: "nasirabad", label_bn: "নাসিরাবাদ", label_en: "Nasirabad", lat: 22.3501, lng: 91.8103 },
          { value: "chandgaon", label_bn: "চান্দগাঁও", label_en: "Chandgaon", lat: 22.3712, lng: 91.8185 },
        ],
      },
      {
        value: "cox-bazar",
        label_bn: "কক্সবাজার",
        label_en: "Cox's Bazar",
        lat: 21.4272,
        lng: 92.0058,
        areas: [
          { value: "cox-town", label_bn: "কক্সবাজার সদর", label_en: "Cox's Bazar Sadar", lat: 21.4500, lng: 91.9800 },
        ],
      },
    ],
  },
  {
    value: "sylhet",
    label_bn: "সিলেট",
    label_en: "Sylhet",
    districts: [
      {
        value: "sylhet",
        label_bn: "সিলেট",
        label_en: "Sylhet",
        lat: 24.8949,
        lng: 91.8687,
        areas: [
          { value: "sylhet-sadar", label_bn: "সিলেট সদর", label_en: "Sylhet Sadar", lat: 24.8970, lng: 91.8710 },
          { value: "jaintiapur", label_bn: "জৈন্তাপুর", label_en: "Jaintiapur", lat: 24.9833, lng: 92.1167 },
          { value: "gopalganj-bazar", label_bn: "গোপালগঞ্জ বাজার", label_en: "Gopalganj Bazar", lat: 24.8694, lng: 91.9186 },
        ],
      },
    ],
  },
  {
    value: "khulna",
    label_bn: "খুলনা",
    label_en: "Khulna",
    districts: [
      {
        value: "khulna",
        label_bn: "খুলনা",
        label_en: "Khulna",
        lat: 22.8456,
        lng: 89.5403,
        areas: [
          { value: "khulna-sadar", label_bn: "খুলনা সদর", label_en: "Khulna Sadar", lat: 22.8480, lng: 89.5420 },
          { value: "sonadanga", label_bn: "সোনাডাঙ্গা", label_en: "Sonadanga", lat: 22.8178, lng: 89.5555 },
          { value: "khalishpur", label_bn: "খালিশপুর", label_en: "Khalishpur", lat: 22.8694, lng: 89.5216 },
        ],
      },
    ],
  },
  {
    value: "rajshahi",
    label_bn: "রাজশাহী",
    label_en: "Rajshahi",
    districts: [
      {
        value: "rajshahi",
        label_bn: "রাজশাহী",
        label_en: "Rajshahi",
        lat: 24.3745,
        lng: 88.6042,
        areas: [
          { value: "boalia", label_bn: "বোয়ালিয়া", label_en: "Boalia", lat: 24.3764, lng: 88.6066 },
          { value: "motihar", label_bn: "মতিহার", label_en: "Motihar", lat: 24.3733, lng: 88.6123 },
          { value: "shah-makhdum", label_bn: "শাহ মখদুম", label_en: "Shah Makhdum", lat: 24.3922, lng: 88.6573 },
        ],
      },
    ],
  },
  {
    value: "barisal",
    label_bn: "বরিশাল",
    label_en: "Barisal",
    districts: [
      {
        value: "barisal",
        label_bn: "বরিশাল",
        label_en: "Barisal",
        lat: 22.7010,
        lng: 90.3535,
        areas: [
          { value: "barisal-sadar", label_bn: "বরিশাল সদর", label_en: "Barisal Sadar", lat: 22.7030, lng: 90.3550 },
          { value: "airport-road", label_bn: "এয়ারপোর্ট রোড", label_en: "Airport Road", lat: 22.7350, lng: 90.3300 },
        ],
      },
    ],
  },
  {
    value: "rangpur",
    label_bn: "রংপুর",
    label_en: "Rangpur",
    districts: [
      {
        value: "rangpur",
        label_bn: "রংপুর",
        label_en: "Rangpur",
        lat: 25.7439,
        lng: 89.2752,
        areas: [
          { value: "rangpur-sadar", label_bn: "রংপুর সদর", label_en: "Rangpur Sadar", lat: 25.7450, lng: 89.2770 },
          { value: "kakina", label_bn: "কাকিনা", label_en: "Kakina", lat: 25.8700, lng: 89.3200 },
        ],
      },
    ],
  },
  {
    value: "mymensingh",
    label_bn: "ময়মনসিংহ",
    label_en: "Mymensingh",
    districts: [
      {
        value: "mymensingh",
        label_bn: "ময়মনসিংহ",
        label_en: "Mymensingh",
        lat: 24.7539,
        lng: 90.4073,
        areas: [
          { value: "mymensingh-sadar", label_bn: "ময়মনসিংহ সদর", label_en: "Mymensingh Sadar", lat: 24.7550, lng: 90.4090 },
          { value: "muktagacha", label_bn: "মুক্তাগাছা", label_en: "Muktagacha", lat: 24.7600, lng: 90.2700 },
        ],
      },
    ],
  },
];

export function getDivisions() {
  return BD_LOCATIONS;
}

export function getDistricts(divisionValue: string) {
  const division = BD_LOCATIONS.find((d) => d.value === divisionValue);
  return division?.districts || [];
}

export function getAreas(divisionValue: string, districtValue: string) {
  const division = BD_LOCATIONS.find((d) => d.value === divisionValue);
  const district = division?.districts.find((d) => d.value === districtValue);
  return district?.areas || [];
}

export function getLocationLabel(
  divisionValue: string,
  districtValue: string,
  areaValue: string,
  locale: string
): string {
  const division = BD_LOCATIONS.find((d) => d.value === divisionValue);
  const district = division?.districts.find((d) => d.value === districtValue);
  const area = district?.areas.find((a) => a.value === areaValue);
  if (locale === "bn") {
    return [area?.label_bn, district?.label_bn, division?.label_bn]
      .filter(Boolean)
      .join(", ");
  }
  return [area?.label_en, district?.label_en, division?.label_en]
    .filter(Boolean)
    .join(", ");
}
