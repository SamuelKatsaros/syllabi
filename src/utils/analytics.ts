export const GA_MEASUREMENT_ID = 'G-6ZCYT8DPVB';

type GtagConfigParams = {
  page_path?: string;
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

export const pageview = (url: string): void => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
}; 