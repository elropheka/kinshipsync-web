import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Removed Link
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errorUtils';
import { doc, getDoc, Timestamp, collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../../services/firebaseConfig'; // Adjust path as necessary
import type { Vendor, VendorCategory } from '../../types/vendorTypes'; // Use type-only import
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // For avatar display
// Removed Briefcase, added DollarSign
import { Mail, Phone, Globe, MapPin, Star, Info, ListChecks, ClockIcon, ExternalLink, DollarSign } from 'lucide-react'; 

const VendorDetailPage: React.FC = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [categories, setCategories] = useState<VendorCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vendorId) {
      setError('Vendor ID is missing.');
      setLoading(false);
      return;
    }

    const fetchVendorData = async () => {
      setLoading(true);
      setError(null);
      try {
        const vendorDocRef = doc(firestore, 'vendors', vendorId);
        const vendorDocSnap = await getDoc(vendorDocRef);

        if (vendorDocSnap.exists()) {
          const rawData = vendorDocSnap.data();
          const vendorData = rawData as Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'> & {
            createdAt?: Timestamp | string;
            updatedAt?: Timestamp | string;
          };
          
          const fetchedVendor: Vendor = {
            id: vendorDocSnap.id,
            name: vendorData.name,
            description: vendorData.description,
            categoryIds: vendorData.categoryIds || [],
            contactEmail: vendorData.contactEmail,
            phoneNumber: vendorData.phoneNumber,
            websiteUrl: vendorData.websiteUrl,
            address: vendorData.address,
            logoUrl: vendorData.logoUrl,
            averageRating: vendorData.averageRating,
            numberOfReviews: vendorData.numberOfReviews,
            isFeatured: vendorData.isFeatured,
            servicesOffered: vendorData.servicesOffered || [],
            pricingInfo: vendorData.pricingInfo,
            operatingHours: vendorData.operatingHours,
            createdAt: vendorData.createdAt instanceof Timestamp ? vendorData.createdAt.toDate().toISOString() : String(vendorData.createdAt || ''),
            updatedAt: vendorData.updatedAt instanceof Timestamp ? vendorData.updatedAt.toDate().toISOString() : String(vendorData.updatedAt || ''),
          };
          setVendor(fetchedVendor);

          // Fetch category names if categoryIds exist
          if (fetchedVendor.categoryIds && fetchedVendor.categoryIds.length > 0) {
            const categoriesCol = collection(firestore, 'vendorCategories');
            // Firestore 'in' query limit is 10. If more, need multiple queries or different approach.
            // For simplicity, assuming categoryIds.length <= 10 or handle chunking if necessary.
            const MAX_IDS_PER_QUERY = 10;
            const categoryChunks = [];
            for (let i = 0; i < fetchedVendor.categoryIds.length; i += MAX_IDS_PER_QUERY) {
                categoryChunks.push(fetchedVendor.categoryIds.slice(i, i + MAX_IDS_PER_QUERY));
            }
            
            const fetchedCategories: VendorCategory[] = [];
            for (const chunk of categoryChunks) {
                if (chunk.length > 0) {
                    const categoryQuery = query(categoriesCol, where('id', 'in', chunk));
                    const categorySnap = await getDocs(categoryQuery);
                    categorySnap.forEach(catDoc => {
                        fetchedCategories.push({ id: catDoc.id, ...catDoc.data() } as VendorCategory);
                    });
                }
            }
            setCategories(fetchedCategories);
          }

        } else {
          setError('Vendor not found.');
        }
      } catch (err) {
        console.error("Error fetching vendor data:", err);
        setError('Failed to fetch vendor data.');
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [vendorId]);

  if (loading) {
    return <div className="p-6 text-center">Loading vendor details...</div>;
  }

  if (error) {
    toast.error(getErrorMessage(error));
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Unable to load vendor details. Please try again.</p>
      </div>
    );
  }

  if (!vendor) {
    return <div className="p-6 text-center">No vendor data found.</div>;
  }
  
  const getAvatarFallback = (name?: string | null) => {
    if (name) {
      const initials = name.split(' ').map((n) => n[0]).join('');
      return initials.toUpperCase() || 'V';
    }
    return 'V';
  };

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-10">
      <div className="bg-background shadow-xl rounded-lg">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start mb-6">
                          <Avatar className="w-24 h-24 md:w-32 md:h-32 text-4xl md:text-5xl mb-4 md:mb-0 md:mr-8 border-2 border-border">
              <AvatarImage src={vendor.logoUrl} alt={vendor.name} />
              <AvatarFallback>{getAvatarFallback(vendor.name)}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{vendor.name}</h1>
              {categories.length > 0 && (
                <p className="text-md text-primary mt-1">
                  {categories.map(cat => cat.name).join(', ')}
                </p>
              )}
              {vendor.averageRating && vendor.numberOfReviews ? (
                <div className="flex items-center justify-center md:justify-start mt-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" /> 
                  <span>{vendor.averageRating.toFixed(1)} ({vendor.numberOfReviews} reviews)</span>
                </div>
              ) : (
                 <div className="flex items-center justify-center md:justify-start mt-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-muted-foreground mr-1" /> 
                  <span>No reviews yet</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
            {vendor.contactEmail && (
              <div className="flex items-center text-foreground">
                <Mail className="w-4 h-4 mr-2 text-primary" />
                <a href={`mailto:${vendor.contactEmail}`} className="hover:underline">{vendor.contactEmail}</a>
              </div>
            )}
            {vendor.phoneNumber && (
              <div className="flex items-center text-foreground">
                <Phone className="w-4 h-4 mr-2 text-primary" />
                <span>{vendor.phoneNumber}</span>
              </div>
            )}
            {vendor.websiteUrl && (
              <div className="flex items-center text-foreground sm:col-span-2">
                <Globe className="w-4 h-4 mr-2 text-primary" />
                <a href={vendor.websiteUrl.startsWith('http') ? vendor.websiteUrl : `//${vendor.websiteUrl}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {vendor.websiteUrl} <ExternalLink className="inline w-3 h-3 ml-1" />
                </a>
              </div>
            )}
            {vendor.address && (
              <div className="flex items-start text-foreground sm:col-span-2">
                <MapPin className="w-4 h-4 mr-2 mt-1 text-primary flex-shrink-0" />
                <div>
                  {vendor.address.street && <div>{vendor.address.street}</div>}
                  <div>
                    {vendor.address.city && <span>{vendor.address.city}, </span>}
                    {vendor.address.state && <span>{vendor.address.state} </span>}
                    {vendor.address.postalCode && <span>{vendor.address.postalCode}</span>}
                  </div>
                  {vendor.address.country && <div>{vendor.address.country}</div>}
                </div>
              </div>
            )}
          </div>
          
          {/* About Section */}
          {vendor.description && (
            <div className="mb-6 pt-4 border-t border-border">
              <h2 className="text-xl font-semibold text-foreground mb-2 flex items-center">
                <Info className="w-5 h-5 mr-2" /> About {vendor.name}
              </h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{vendor.description}</p>
            </div>
          )}

          {/* Services Offered */}
          {vendor.servicesOffered && vendor.servicesOffered.length > 0 && (
            <div className="mb-6 pt-4 border-t border-border">
              <h2 className="text-xl font-semibold text-foreground mb-2 flex items-center">
                <ListChecks className="w-5 h-5 mr-2" /> Services Offered
              </h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                {vendor.servicesOffered.map((service, index) => <li key={index}>{service}</li>)}
              </ul>
            </div>
          )}

          {/* Pricing & Hours */}
          {(vendor.pricingInfo || vendor.operatingHours) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pt-4 border-t border-border">
              {vendor.pricingInfo && (
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-1 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" /> Pricing
                  </h3>
                  <p className="text-sm text-muted-foreground">{vendor.pricingInfo}</p>
                </div>
              )}
              {vendor.operatingHours && (
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-1 flex items-center">
                    <ClockIcon className="w-5 h-5 mr-2" /> Operating Hours
                  </h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{vendor.operatingHours}</p>
                </div>
              )}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default VendorDetailPage;
