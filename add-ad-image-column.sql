-- Add ad_image column to site_settings table
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS ad_image TEXT;

-- Set a default value if needed
UPDATE public.site_settings SET ad_image = '/assets/images/promo-banner.jpg' WHERE ad_image IS NULL;
