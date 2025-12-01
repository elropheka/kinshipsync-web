import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countries } from '@/lib/countries';
import type { VendorProfileFormData } from '@/pages/admin/RegisterVendor';

// Removed form prop, will use useFormContext
const VendorStep2Form: React.FC = () => {
  const { control, watch, setValue } = useFormContext<VendorProfileFormData>(); // Use context
  const initialPhoneNumber = watch('phoneNumber') || "";

  const [selectedPhoneCountryCode, setSelectedPhoneCountryCode] = useState<string>(() => {
    let matchingCountry = null;
    if (initialPhoneNumber) {
      // Iterate to find the longest matching calling code prefix
      for (const c of countries) {
        if (initialPhoneNumber.startsWith(c.callingCode)) {
          if (!matchingCountry || c.callingCode.length > matchingCountry.callingCode.length) {
            matchingCountry = c;
          }
        }
      }
    }
    return matchingCountry?.code || "US"; // Default to US country code
  });
  
  const [nationalPhoneNumber, setNationalPhoneNumber] = useState<string>(() => {
    // This initializer runs with the selectedPhoneCountryCode from its own initializer.
    // We need to re-evaluate based on initialPhoneNumber and the *derived* initial selectedPhoneCountryCode.
    let derivedInitialSelectedCode = "US";
    let matchingCountryForInit = null;
    if (initialPhoneNumber) {
      for (const c of countries) {
        if (initialPhoneNumber.startsWith(c.callingCode)) {
           if (!matchingCountryForInit || c.callingCode.length > matchingCountryForInit.callingCode.length) {
            matchingCountryForInit = c;
          }
        }
      }
    }
    derivedInitialSelectedCode = matchingCountryForInit?.code || "US";

    const countryEntry = countries.find(c => c.code === derivedInitialSelectedCode);
    const callingCode = countryEntry?.callingCode || "";

    if (callingCode && initialPhoneNumber.startsWith(callingCode)) {
      return initialPhoneNumber.substring(callingCode.length);
    }
    return initialPhoneNumber.replace(/^\+/,'').replace(/\D/g, ''); // Fallback: remove leading + and non-digits
  });

  useEffect(() => {
    const countryEntry = countries.find(c => c.code === selectedPhoneCountryCode);
    const callingCode = countryEntry?.callingCode || "";
    setValue('phoneNumber', callingCode + nationalPhoneNumber.replace(/\D/g, ''), { shouldValidate: true, shouldDirty: true });
  }, [selectedPhoneCountryCode, nationalPhoneNumber, setValue]);

  return (
    <div className="space-y-8">
      <FormField
        control={control}
        name="contactEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="contact@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="phoneNumber" // This field in react-hook-form stores the combined number
        render={() => ( // Removed unused `field`
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <div className="flex items-center space-x-2">
              <Select
                value={selectedPhoneCountryCode} // This is country.code e.g. "US"
                onValueChange={(newCountryIsoCode) => {
                  setSelectedPhoneCountryCode(newCountryIsoCode);
                  // When country code changes, we might want to clear nationalPhoneNumber
                  // or attempt to re-format if the old number was for a different country.
                  // For simplicity, user will re-enter national part.
                  // setNationalPhoneNumber(""); // Optional: clear national number input
                }}
              >
                <FormControl>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Country Code" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}> 
                      {country.name} ({country.callingCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="1234567890"
                  value={nationalPhoneNumber}
                  onChange={(e) => {
                    const newNationalNumber = e.target.value.replace(/\D/g, ''); // Allow only digits
                    setNationalPhoneNumber(newNationalNumber);
                    // field.onChange is handled by useEffect
                  }}
                  className="flex-1"
                />
              </FormControl>
            </div>
            <FormDescription>
              Select country code and enter phone number.
            </FormDescription>
            <FormMessage /> {/* This will show validation messages for the combined phoneNumber field */}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="websiteUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website URL (Optional)</FormLabel>
            <FormControl>
              <Input type="url" placeholder="https://yourwebsite.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <h3 className="text-lg font-medium border-b pb-2">Address</h3>
      <FormField
        control={control}
        name="address.street"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="address.city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="address.state"
        render={({ field }) => (
          <FormItem>
            <FormLabel>State/Province</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="address.postalCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Postal Code</FormLabel>
            <FormControl><Input placeholder="e.g. 90210" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="address.country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.name}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default VendorStep2Form;
