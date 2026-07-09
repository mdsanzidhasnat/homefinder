export type ListingPurpose = "sale" | "rent";
export type PropertyType =
  | "apartment"
  | "house"
  | "land"
  | "commercial"
  | "office"
  | "shop"
  | "warehouse";
export type ListingStatus = "available" | "negotiation" | "sold" | "rented";
export type UserRole = "buyer" | "agent";
export type FacingDirection = "south" | "north" | "east" | "west";
export type AreaUnit = "sqft" | "katha" | "bigha" | "decimal";

export interface Location {
  division: string;
  district: string;
  area: string;
  lat: number;
  lng: number;
}

export interface PropertyImage {
  id: string;
  url: string;
  alt_bn?: string;
  alt_en?: string;
  is_primary: boolean;
}

export interface Property {
  id: string;
  title_bn: string;
  title_en: string;
  description_bn: string;
  description_en: string;
  type: PropertyType;
  purpose: ListingPurpose;
  price: number;
  area: number;
  area_unit: AreaUnit;
  bedrooms: number;
  bathrooms: number;
  floor_number?: number;
  total_floors?: number;
  facing_direction?: FacingDirection;
  amenities: string[];
  location: Location;
  images: PropertyImage[];
  status: ListingStatus;
  agent_id: string;
  agent_name: string;
  agent_phone: string;
  agent_email: string;
  agent_avatar?: string;
  posted_date: string;
  views: number;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  agency_name?: string;
  agency_logo?: string;
  bio_bn?: string;
  bio_en?: string;
  role: "agent";
  total_listings: number;
  active_listings: number;
  joined_date: string;
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  agency_name?: string;
  agency_logo?: string;
  bio_bn?: string;
  bio_en?: string;
  created_at: string;
}

export interface Inquiry {
  id: string;
  property_id: string;
  property_title: string;
  sender_id: string;
  sender_name: string;
  sender_email: string;
  sender_phone: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
  property?: Property;
}

export interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  filters: SearchFilters;
  notify: boolean;
  created_at: string;
}

export interface SearchFilters {
  purpose?: ListingPurpose;
  type?: PropertyType;
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  areaMin?: number;
  areaMax?: number;
  division?: string;
  district?: string;
  area?: string;
  amenities?: string[];
  sort?: "newest" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
}
