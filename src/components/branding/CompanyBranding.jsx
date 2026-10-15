import { useEffect } from 'react';
import { useSiteContent } from '../../context/SiteContentContext';
import BrandWordmark from './BrandWordmark';

export function CompanyLogo({ className = '' }) {
  const { settings } = useSiteContent();
  if (!settings) return <span aria-hidden="true" className={className} />;
  return <img src={settings.logo_url ?? '/logo.jpeg'} alt="" className={className} />;
}

export function CompanyWordmark({ className = '' }) {
  const { settings } = useSiteContent();
  if (!settings) return <span aria-hidden="true" className={`ns-wordmark ns-brand-placeholder ${className}`} />;
  return settings.wordmark_url
    ? <img src={settings.wordmark_url} alt="NativeShine company wordmark" className={`ns-wordmark ns-uploaded-wordmark ${className}`} />
    : <BrandWordmark className={className} />;
}

export function CompanyFavicon() {
  const { settings } = useSiteContent();
  useEffect(() => {
    if (!settings?.logo_url) return;
    const icon = document.querySelector('link[rel="icon"]');
    if (icon) {
      icon.href = settings.logo_url;
      icon.removeAttribute('type');
    }
  }, [settings?.logo_url]);
  return null;
}
