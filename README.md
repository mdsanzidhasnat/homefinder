# BD Home Finder

A production-quality real estate marketplace web application for Bangladesh, built with Next.js 14+, TypeScript, Tailwind CSS, and Supabase.

## Features

- Bilingual (Bangla + English) with next-intl internationalization
- Property search with advanced filters (location, price, type, amenities)
- Map view integration via Leaflet + OpenStreetMap
- Role-based dashboards (Buyer/Renter + Agent/Owner)
- Multi-step listing creation wizard for agents
- Property favorites, saved searches, and inquiry system
- Bangladeshi-specific features: Lakh/Crore price formatting, Katha/Bigha/Decimal area units
- Responsive design (mobile-first, all breakpoints)
- Accessibility (WCAG AA, semantic HTML, keyboard navigation)

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 with custom design tokens
- **UI Components:** Custom shadcn/ui-style components (Radix UI primitives)
- **Internationalization:** next-intl (bn + en)
- **Backend:** Supabase (Auth, PostgreSQL, Storage)
- **State Management:** Zustand (filters, favorites, auth)
- **Forms:** react-hook-form + zod validation
- **Maps:** Leaflet + React-Leaflet (fallback: OpenStreetMap)
- **Charts:** Recharts (dashboard analytics)
- **Icons:** lucide-react

## Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase project (free tier works)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

Optional:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox token for enhanced maps (falls back to OpenStreetMap) |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase Tables

Run the following SQL in your Supabase SQL editor to create the required tables:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('buyer', 'agent')),
  agency_name TEXT,
  agency_logo TEXT,
  bio_bn TEXT,
  bio_en TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Listings table
CREATE TABLE listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_bn TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_bn TEXT NOT NULL,
  description_en TEXT NOT NULL,
  type TEXT NOT NULL,
  purpose TEXT NOT NULL,
  price NUMERIC NOT NULL,
  area NUMERIC NOT NULL,
  area_unit TEXT NOT NULL,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  floor_number INTEGER,
  total_floors INTEGER,
  facing_direction TEXT,
  amenities TEXT[] DEFAULT '{}',
  division TEXT NOT NULL,
  district TEXT NOT NULL,
  area_name TEXT NOT NULL,
  lat NUMERIC,
  lng NUMERIC,
  status TEXT DEFAULT 'available',
  agent_id UUID NOT NULL,
  agent_name TEXT NOT NULL,
  agent_phone TEXT,
  agent_email TEXT,
  agent_avatar TEXT,
  images JSONB DEFAULT '[]',
  posted_date TIMESTAMPTZ DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites table
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  property_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Inquiries table
CREATE TABLE inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  property_title TEXT NOT NULL,
  sender_id UUID,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);

-- Saved searches table
CREATE TABLE saved_searches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  filters JSONB DEFAULT '{}',
  notify BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Listings are viewable by everyone" ON listings FOR SELECT USING (true);
CREATE POLICY "Agents can insert their own listings" ON listings FOR INSERT WITH CHECK (auth.uid() = agent_id);
CREATE POLICY "Agents can update their own listings" ON listings FOR UPDATE USING (auth.uid() = agent_id);
CREATE POLICY "Agents can delete their own listings" ON listings FOR DELETE USING (auth.uid() = agent_id);

CREATE POLICY "Users can view their own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Agents can view inquiries for their listings" ON inquiries FOR SELECT USING (true);
```

### 3. Run the seed script (optional but recommended)

```bash
npx tsx scripts/seed.ts
```

This creates 5 demo agent accounts and 30+ realistic Bangladesh property listings.

> **Demo agent credentials:** Each agent's email (e.g., `rafiq@bdhomefinder.com`) with password `password123`

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app defaults to Bangla (bn). Switch to English via the language toggle in the navbar.

## Project Structure

```
app/
  [locale]/                    # Localized routes (bn, en)
    (marketing)/               # Home, About, Contact
    search/                    # Search results with filters + map
    property/[id]/             # Property detail page
    agents/                    # Agent directory
    agents/[id]/               # Agent profile
    auth/                      # Login, Register, Forgot Password
    dashboard/                 # Role-aware dashboard
components/
  ui/                          # Base UI components (button, card, etc.)
  shared/                      # Navbar, Footer, PropertyCard, etc.
  dashboard/                   # Dashboard-specific components
  search/                      # Search page components
  property/                    # Property detail components
  agents/                      # Agents page components
  auth/                        # Auth page components
lib/
  supabase/                    # Supabase client (browser + server)
  validators/                  # Zod schemas
  utils/                       # Helpers (area converter, price formatter, etc.)
messages/                      # next-intl JSON files (bn.json, en.json)
types/                         # TypeScript type definitions
scripts/                       # Seed script
```

## Key Features

### Localization
- Full Bangla (bn) and English (en) support via next-intl
- Bangladeshi price formatting (৳, Lakh, Crore)
- BD area units (Sqft, Katha, Bigha, Decimal)
- Bengali font support (Hind Siliguri)

### Bangladesh-Specific Data
- 8 divisions with real districts and areas
- Property types relevant to BD market
- BD phone number validation (+880 format)
- Facing direction (important in BD property buying)

### Dashboard
- **Buyer dashboard:** Saved properties, saved searches, inquiry history, profile settings
- **Agent dashboard:** Overview stats, listings management, multi-step creation wizard, inquiries inbox, profile settings
- Role-based sidebar navigation
- Route protection via middleware

## License

Private — All rights reserved.
# homefinder
