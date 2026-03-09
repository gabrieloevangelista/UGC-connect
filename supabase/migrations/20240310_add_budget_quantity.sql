-- Migration to add budget and video_quantity columns to video_requests table

-- Add budget column (numeric for currency values)
ALTER TABLE video_requests 
ADD COLUMN budget numeric DEFAULT 0;

-- Add video_quantity column (integer)
ALTER TABLE video_requests 
ADD COLUMN video_quantity integer DEFAULT 1;

-- Add comment to document the changes
COMMENT ON COLUMN video_requests.budget IS 'Available budget for the campaign';
COMMENT ON COLUMN video_requests.video_quantity IS 'Number of videos requested';
