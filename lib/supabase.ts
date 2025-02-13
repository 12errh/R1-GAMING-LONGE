import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export function subscribeToOnlinePlayers(callback: (players: any[]) => void) {
  const channel = supabase.channel('online-users');

  channel
    .on('presence', { event: 'sync' }, () => {
      const newState = channel.presenceState();
      const onlinePlayers = Object.values(newState).flat();
      callback(onlinePlayers);
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await channel.track({ 
            user_id: user.id, 
            username: user.user_metadata.username 
          });
        }
      }
    });

  return () => {
    channel.unsubscribe();
  };
}

