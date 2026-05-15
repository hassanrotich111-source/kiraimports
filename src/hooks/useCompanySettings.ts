import { useState, useEffect } from 'react';
import { getCompanySettings } from '../services/api';

export interface CompanySettings {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  instagram: string;
  tiktok: string;
  facebook: string;
}

const defaultSettings: CompanySettings = {
  phone: '+254792821836',
  whatsapp: '+254792821836',
  email: 'kiraimports6@gmail.com',
  address: 'Nairobi, Kenya',
  hours: 'Mon–Sat, 8:00–18:00 EAT',
  instagram: 'kira_imports_',
  tiktok: 'kira.imports_',
  facebook: 'Kira Imports',
};

export function useCompanySettings() {
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCompanySettings();
        if (data) {
          setSettings({
            phone: data.phone || defaultSettings.phone,
            whatsapp: data.whatsapp || defaultSettings.whatsapp,
            email: data.email || defaultSettings.email,
            address: data.address || defaultSettings.address,
            hours: data.hours || defaultSettings.hours,
            instagram: data.instagram || defaultSettings.instagram,
            tiktok: data.tiktok || defaultSettings.tiktok,
            facebook: data.facebook || defaultSettings.facebook,
          });
        }
      } catch (err) {
        console.log('Using default company settings');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { settings, loading };
}
