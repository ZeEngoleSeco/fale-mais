import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);
sb.from('rooms').insert({ 
  name: 'Test', 
  is_private: false, 
  password: null, 
  host_id: 'c8f49611-1a3b-466d-88ab-f0502a11b65f',
  host_name: 'Test',
  host_initials: 'TE'
}).then(console.log).catch(console.error);
