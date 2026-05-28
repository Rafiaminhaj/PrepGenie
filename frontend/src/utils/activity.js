import { supabase } from '../lib/supabase';

export const logSession = async (earnedGems = 10) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; // Not logged in

    // 1. Fetch current stats
    let { data: stats } = await supabase.from('user_stats').select('*').eq('user_id', user.id).single();
    
    if (!stats) {
      // Create if doesn't exist
      const { data: newStats } = await supabase.from('user_stats').insert([{ user_id: user.id }]).select().single();
      stats = newStats;
    }

    if (stats) {
      // 2. Update user_stats
      const currentStreak = stats.current_streak > 0 ? stats.current_streak : 1;
      const maxStreak = Math.max(stats.max_streak, currentStreak);
      
      await supabase.from('user_stats').update({
        gems: stats.gems + earnedGems,
        total_sessions: stats.total_sessions + 1,
        max_streak: maxStreak,
        updated_at: new Date().toISOString()
      }).eq('user_id', user.id);

      // Keep localStorage in sync for fast UI rendering
      localStorage.setItem('totalSessions', stats.total_sessions + 1);
      localStorage.setItem('gems', stats.gems + earnedGems);
      localStorage.setItem('prepGenie_streak', currentStreak);
      localStorage.setItem('prepGenie_maxStreak', maxStreak);
    }

    // 3. Update activity_logs
    const today = new Date().toISOString().split('T')[0];
    const { data: log } = await supabase.from('activity_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('date_str', today)
      .single();

    if (log) {
      await supabase.from('activity_logs').update({ activity_count: log.activity_count + 1 }).eq('id', log.id);
    } else {
      await supabase.from('activity_logs').insert([{ user_id: user.id, date_str: today, activity_count: 1 }]);
    }

  } catch (error) {
    console.error("Error logging session to Supabase:", error);
  }
};
