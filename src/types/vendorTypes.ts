export interface VendorCategory {
  id: string;
  name: string;
  slug: string; // for URL routing, e.g., "photographers", "caterers"
  description?: string;
  iconUrl?: string; // Optional icon for the category
  parentCategoryId?: string; // For sub-categories
}

export interface Vendor {
  id: string; // This will typically be the Firebase Auth UID of the vendor user
  name: string;
  name_lowercase?: string; // For case-insensitive search
  description: string;
  // categories field might be complex if it stores full VendorCategory objects.
  // For Firestore, it's often better to store an array of category IDs (string[])
  // and then fetch category details separately if needed, or denormalize basic category info.
  // Let's assume categoryIds for now for easier Firestore storage.
  categoryIds?: string[]; 
  contactEmail?: string; // Should ideally be the auth email, but can be a separate business email
  phoneNumber?: string;
  websiteUrl?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    latitude?: number; // For map features
    longitude?: number; // For map features
  };
  logoUrl?: string; // URL to vendor's logo
  
  // These fields are usually calculated or managed by reviews/admin actions
  averageRating?: number; 
  numberOfReviews?: number;
  isFeatured?: boolean; // Can be set by admin

  // Vendor-managed content
  servicesOffered?: string[]; // List of specific services as text
  pricingInfo?: string; // e.g., "Starts at $X", "Packages available", "Per hour rate: $Y"
  operatingHours?: string; // e.g., "Mon-Fri: 9am-5pm", "By appointment only"

  // Timestamps
  createdAt: string; // ISO 8601 string, from Firestore Timestamp
  updatedAt: string; // ISO 8601 string, from Firestore Timestamp

  // Fields for event planner interaction (might not be directly editable by vendor in their profile)
  // associatedEventIds?: string[]; 
  // notesForEventPlanner?: string;
}

// For creating a new Vendor profile (e.g., during onboarding)
// Some fields are omitted as they are set by system or later actions.
export interface CreateVendorProfilePayload extends Omit<Vendor, 
  'id' | 
  'averageRating' | 
  'numberOfReviews' | 
  'isFeatured' | 
  'createdAt' | 
  'updatedAt'
  // 'categoryIds' might be handled differently, e.g. selected from a list of existing categories
> {
  // Explicitly define fields expected from form, matching Vendor but without system-set ones.
  // This helps ensure the form data aligns with what we want to save.
  name: string;
  description: string;
  categoryIds?: string[]; // Or perhaps category slugs/names that get converted to IDs
  contactEmail?: string;
  phoneNumber?: string;
  websiteUrl?: string;
  address?: Vendor['address']; // Reuse the address sub-type
  logoUrl?: string;
  servicesOffered?: string[];
  pricingInfo?: string;
  operatingHours?: string;
}

// For updating an existing Vendor profile. All fields are partial.
export type UpdateVendorProfilePayload = Partial<CreateVendorProfilePayload>;


// The following types (VendorReview, VendorSearchParams) are related but might live in their own files
// or be refined as those features are built. For now, including them for completeness from mobile.

export interface VendorReview {
  id: string;
  vendorId: string;
  userId: string; // User who wrote the review
  rating: number; // e.g., 1-5
  comment?: string;
  reviewDate: string; // ISO 8601
}

export type CreateVendorReviewPayload = Omit<VendorReview, 'id' | 'reviewDate' | 'userId'>;

export interface VendorSearchParams {
  categorySlug?: string;
  location?: string; // e.g., city or postal code
  keyword?: string;
  minRating?: number;
  sortBy?: 'rating' | 'name' | 'featured' | 'newest';
  page?: number;
  limit?: number;
}
