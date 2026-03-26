'use server';

import { createServerSupabaseClient } from '@/lib/supabase';

function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function submitCoordinatorReply(token: string, reply: string): Promise<{ success: boolean }> {
  const normalizedToken = token.trim();
  const normalizedReply = reply.trim();

  if (!normalizedToken || !normalizedReply) {
    return { success: false };
  }

  if (!hasSupabaseConfig()) {
    console.log('[mock] coordinator reply would be saved:', {
      token: normalizedToken,
      reply: normalizedReply,
    });
    return { success: true };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from('connect_messages')
      .update({ coordinator_reply: normalizedReply })
      .eq('reply_token', normalizedToken)
      .select('id')
      .single();

    if (error) {
      return { success: false };
    }

    return { success: true };
  } catch {
    return { success: false };
  }
}
