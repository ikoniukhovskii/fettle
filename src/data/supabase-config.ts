// Public Supabase settings. Both values are public by design (they ship to every browser);
// the fallbacks let preview deploys and fresh checkouts build without a .env file.
export const SUPABASE_URL: string = import.meta.env.PUBLIC_SUPABASE_URL || 'https://jxrzmghnffvyeeemqwwn.supabase.co';
export const SUPABASE_ANON_KEY: string = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_c8fZpQK3OiOmyT8yAIsGiA_3be40eat';
