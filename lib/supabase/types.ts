export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          role: "buyer" | "agent";
          agency_name: string | null;
          agency_logo: string | null;
          bio_bn: string | null;
          bio_en: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          role: "buyer" | "agent";
          agency_name?: string | null;
          agency_logo?: string | null;
          bio_bn?: string | null;
          bio_en?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "buyer" | "agent";
          agency_name?: string | null;
          agency_logo?: string | null;
          bio_bn?: string | null;
          bio_en?: string | null;
          created_at?: string;
        };
      };
      listings: {
        Row: {
          id: string;
          title_bn: string;
          title_en: string;
          description_bn: string;
          description_en: string;
          type: string;
          purpose: string;
          price: number;
          area: number;
          area_unit: string;
          bedrooms: number;
          bathrooms: number;
          floor_number: number | null;
          total_floors: number | null;
          facing_direction: string | null;
          amenities: string[];
          division: string;
          district: string;
          area_name: string;
          lat: number;
          lng: number;
          status: string;
          agent_id: string;
          agent_name: string;
          agent_phone: string;
          agent_email: string;
          agent_avatar: string | null;
          images: { id: string; url: string; alt_bn?: string; alt_en?: string; is_primary: boolean }[];
          posted_date: string;
          views: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title_bn: string;
          title_en: string;
          description_bn: string;
          description_en: string;
          type: string;
          purpose: string;
          price: number;
          area: number;
          area_unit: string;
          bedrooms: number;
          bathrooms: number;
          floor_number?: number | null;
          total_floors?: number | null;
          facing_direction?: string | null;
          amenities?: string[];
          division: string;
          district: string;
          area_name: string;
          lat: number;
          lng: number;
          status?: string;
          agent_id: string;
          agent_name: string;
          agent_phone: string;
          agent_email: string;
          agent_avatar?: string | null;
          images?: { id: string; url: string; alt_bn?: string; alt_en?: string; is_primary: boolean }[];
          posted_date?: string;
          views?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title_bn?: string;
          title_en?: string;
          description_bn?: string;
          description_en?: string;
          type?: string;
          purpose?: string;
          price?: number;
          area?: number;
          area_unit?: string;
          bedrooms?: number;
          bathrooms?: number;
          floor_number?: number | null;
          total_floors?: number | null;
          facing_direction?: string | null;
          amenities?: string[];
          division?: string;
          district?: string;
          area_name?: string;
          lat?: number;
          lng?: number;
          status?: string;
          agent_id?: string;
          agent_name?: string;
          agent_phone?: string;
          agent_email?: string;
          agent_avatar?: string | null;
          images?: { id: string; url: string; alt_bn?: string; alt_en?: string; is_primary: boolean }[];
          posted_date?: string;
          views?: number;
          created_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          property_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          property_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          property_id?: string;
          created_at?: string;
        };
      };
      inquiries: {
        Row: {
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
        };
        Insert: {
          id?: string;
          property_id: string;
          property_title: string;
          sender_id?: string;
          sender_name: string;
          sender_email: string;
          sender_phone: string;
          message: string;
          created_at?: string;
          is_read?: boolean;
        };
        Update: {
          id?: string;
          property_id?: string;
          property_title?: string;
          sender_id?: string;
          sender_name?: string;
          sender_email?: string;
          sender_phone?: string;
          message?: string;
          created_at?: string;
          is_read?: boolean;
        };
      };
      saved_searches: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          filters: Record<string, unknown>;
          notify: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          filters?: Record<string, unknown>;
          notify?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          filters?: Record<string, unknown>;
          notify?: boolean;
          created_at?: string;
        };
      };
    };
  };
};
