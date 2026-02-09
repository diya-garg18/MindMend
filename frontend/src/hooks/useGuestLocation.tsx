import { useState, useEffect } from 'react';

interface LocationData {
  country: string;
  countryCode: string;
  city: string;
}

const defaultLocation: LocationData = {
  country: 'United States',
  countryCode: 'US',
  city: 'Unknown',
};

export function useGuestLocation() {
  const [location, setLocation] = useState<LocationData>(defaultLocation);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Use ipapi.co for IP-based geolocation
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          setLocation({
            country: data.country_name || defaultLocation.country,
            countryCode: data.country_code || defaultLocation.countryCode,
            city: data.city || defaultLocation.city,
          });
        }
      } catch (error) {
        console.log('Location detection failed, using default');
        // Keep default location on error
      } finally {
        setIsLoading(false);
      }
    };

    detectLocation();
  }, []);

  return { location, isLoading };
}

// Emergency contacts by country
export const emergencyContactsByCountry: Record<string, { name: string; number: string; description: string }[]> = {
  US: [
    { name: 'Suicide & Crisis Lifeline', number: '988', description: 'Call or text 24/7' },
    { name: 'Crisis Text Line', number: '741741', description: 'Text HOME' },
  ],
  IN: [
    { name: 'iCall', number: '9152987821', description: 'Psychosocial Helpline' },
    { name: 'Vandrevala Foundation', number: '1860-2662-345', description: '24/7 Support' },
    { name: 'NIMHANS', number: '080-46110007', description: 'Mental Health Support' },
  ],
  GB: [
    { name: 'Samaritans', number: '116 123', description: '24/7 Support' },
    { name: 'CALM', number: '0800 58 58 58', description: 'For men, 5pm-midnight' },
  ],
  AU: [
    { name: 'Lifeline', number: '13 11 14', description: '24/7 Crisis Support' },
    { name: 'Beyond Blue', number: '1300 22 4636', description: 'Anxiety & Depression' },
  ],
  CA: [
    { name: 'Canada Suicide Prevention', number: '1-833-456-4566', description: '24/7 Support' },
    { name: 'Crisis Text Line', number: '686868', description: 'Text CONNECT' },
  ],
};

export function getEmergencyContacts(countryCode: string) {
  return emergencyContactsByCountry[countryCode] || emergencyContactsByCountry['US'];
}
