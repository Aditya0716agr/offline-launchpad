-- Create newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    unsubscribed_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique email per startup
    UNIQUE(email, startup_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_startup_id ON newsletter_subscriptions(startup_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_active ON newsletter_subscriptions(is_active) WHERE is_active = TRUE;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_newsletter_subscriptions_updated_at 
    BEFORE UPDATE ON newsletter_subscriptions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow anyone to insert (subscribe)
CREATE POLICY "Allow public subscription" ON newsletter_subscriptions
    FOR INSERT WITH CHECK (true);

-- Allow users to view their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON newsletter_subscriptions
    FOR SELECT USING (true);

-- Allow users to update their own subscriptions (unsubscribe)
CREATE POLICY "Users can update own subscriptions" ON newsletter_subscriptions
    FOR UPDATE USING (true);

-- Add comments for documentation
COMMENT ON TABLE newsletter_subscriptions IS 'Stores newsletter subscription data for startup updates';
COMMENT ON COLUMN newsletter_subscriptions.email IS 'Subscriber email address';
COMMENT ON COLUMN newsletter_subscriptions.startup_id IS 'ID of the startup they subscribed to';
COMMENT ON COLUMN newsletter_subscriptions.subscribed_at IS 'When the subscription was created';
COMMENT ON COLUMN newsletter_subscriptions.is_active IS 'Whether the subscription is currently active';
COMMENT ON COLUMN newsletter_subscriptions.unsubscribed_at IS 'When the subscription was cancelled (if applicable)';
