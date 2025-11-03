// User/Alumni Types
export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  location?: string | null;
  graduation_year?: number | null;
  linkedin_url?: string | null;
  personal_website?: string | null;
  current_company?: string | null;
  current_role?: string | null;
  profile_image?: string | null;
  open_to_coffee_chats: boolean;
  open_to_mentorship: boolean;
  available_for_referrals: boolean;
  bio?: string | null;
  is_alumni: boolean;
  profile_visible: boolean;
  profile_completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserCreate {
  email: string;
  password: string;
  full_name: string;
}

export interface UserUpdate {
  email?: string;
  full_name?: string;
  location?: string;
  graduation_year?: number;
  linkedin_url?: string;
  personal_website?: string;
  current_company?: string;
  current_role?: string;
  profile_image?: string;
  open_to_coffee_chats?: boolean;
  open_to_mentorship?: boolean;
  available_for_referrals?: boolean;
  bio?: string;
  is_alumni?: boolean;
  profile_visible?: boolean;
}

// Company Types
export interface Company {
  name: string;
  image_url?: string;
}

export interface CompanyWithEmployees extends Company {
  employee_count?: number;
  current_employees?: User[];
  all_employees?: User[];
}

// Interview Types
export interface Interview {
  id: number;
  user_id: number;
  company_name: string;
  role: string;
  internship: boolean;
  season: string;
  passed: boolean;
  round?: number;
  tips?: string;
  overview?: string;
}

// Employment Types
export interface Employment {
  id: number;
  user_id: number;
  company_name: string;
  start_date: string;
  end_date?: string;
  role: string;
  current: boolean;
}

// Connection Request Types
export interface ConnectionRequest {
  id: number;
  requester_id: number;
  requestee_id: number;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  created_at: string;
  updated_at: string;
  requester?: User;
  requestee?: User;
}

// Auth Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
}

// Filter Types
export interface AlumniFilters {
  search?: string;
  location?: string;
  graduation_year?: number;
  company?: string;
  open_to_coffee_chats?: boolean;
  open_to_mentorship?: boolean;
  available_for_referrals?: boolean;
  is_alumni?: boolean;
}

// Form Types
export interface ProfileFormData {
  full_name: string;
  email: string;
  location?: string;
  graduation_year?: number;
  linkedin_url?: string;
  personal_website?: string;
  current_company?: string;
  current_role?: string;
  bio?: string;
  open_to_coffee_chats: boolean;
  open_to_mentorship: boolean;
  available_for_referrals: boolean;
  profile_visible: boolean;
}