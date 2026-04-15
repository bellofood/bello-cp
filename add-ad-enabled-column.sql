-- Add ad_enabled column to site_settings table to toggle the ad popup
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS ad_enabled BOOLEAN DEFAULT TRUE;

-- Update existing rows to have ad_enabled = TRUE if it is currently NULL
UPDATE public.site_settings SET ad_enabled = TRUE WHERE ad_enabled IS NULL;
