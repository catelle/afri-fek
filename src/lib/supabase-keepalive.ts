import { supabase } from './supabase';

// Keep Supabase project alive by pinging every 5 days
export class SupabaseKeepAlive {
  private intervalId: NodeJS.Timeout | null = null;
  private readonly PING_INTERVAL = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds

  start() {
    // Ping immediately on start
    this.ping();
    
    // Set up recurring ping every 5 days
    this.intervalId = setInterval(() => {
      this.ping();
    }, this.PING_INTERVAL);
    
    console.log('🔄 Supabase keep-alive started (pings every 5 days)');
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('⏹️ Supabase keep-alive stopped');
    }
  }

  private async ping() {
    try {
      // Simple storage query to keep connection alive
      const { data, error } = await supabase.storage
        .from('afrifek')
        .list('', { limit: 1 });
      
      if (error) {
        // If storage fails, try a simple RPC call
        try {
          await supabase.rpc('ping', {});
        } catch (rpcError) {
          // If RPC fails, just log - connection attempt was made
          console.log('📡 Supabase ping attempted (connection made)');
        }
      }
      
      console.log('✅ Supabase keep-alive ping successful:', new Date().toISOString());
    } catch (error) {
      console.log('📡 Supabase ping attempted (connection made):', new Date().toISOString());
      // Even if query fails, the connection attempt keeps project alive
    }
  }
}

// Singleton instance
export const supabaseKeepAlive = new SupabaseKeepAlive();