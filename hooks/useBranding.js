import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://f82cb2me3v.ap-northeast-1.awsapprunner.com';

export function useBranding() {
  const [branding, setBranding] = useState({
    name: 'Linda 髮廊',
    short_name: 'Linda',
    description: '專業美髮服務，打造您的完美造型',
    logo: '',
    theme_color: '#8B5CF6',
    background_color: '#FFFFFF',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBranding();
  }, []);

  const fetchBranding = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/settings/branding`);
      setBranding(response.data);
    } catch (error) {
      console.error('Failed to fetch branding:', error);
      // 使用預設值
    } finally {
      setIsLoading(false);
    }
  };

  return { branding, isLoading };
}
