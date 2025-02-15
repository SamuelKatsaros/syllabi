export const GA_MEASUREMENT_ID = 'G-6ZCYT8DPVB';

type GtagEvent = {
  action: string;
  category: string;
  label: string;
  value?: number;
};

type GtagConfigParams = {
  page_path?: string;
  cookie_domain?: string;
  cookie_flags?: string;
  dimension1?: string;
  send_to?: string;
  event_category?: string;
  event_label?: string;
  value?: number;
};

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      params?: GtagConfigParams
    ) => void;
  }
}

export const pageview = (url: string, subdomain: string) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
    cookie_domain: '.syllabus.website',
    cookie_flags: 'SameSite=None;Secure',
    dimension1: subdomain // Custom dimension for subdomain tracking
  });
};

export const event = ({ action, category, label, value }: GtagEvent) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  });
}; 