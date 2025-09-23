import { createContext, useContext, useEffect, useState } from 'react';
// import { supabase } from '../lib/supabase';

const supabase = {
  auth: {
    getUser: () => Promise.resolve({ data: { user: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signOut: () => Promise.resolve(),
  }
};

type Profile = { id: string; display_name?: string; role: 'user'|'reviewer'|'admin' };
type Ctx = { user: any | null; profile: Profile | null; loading: boolean; signOut: () => Promise<void>; };
const AuthCtx = createContext<Ctx>({ user: null, profile: null, loading: true, signOut: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const u = (await supabase.auth.getUser()).data.user;
    setUser(u);
    if (u) {
      // const { data } = await supabase.from('profiles').select('*').eq('id', u.id).single();
      // setProfile(data as Profile);
    } else {
      setProfile(null);
    }
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
    const { data: sub } = supabase.auth.onAuthStateChange(() => refresh());
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  return <AuthCtx.Provider value={{ user, profile, loading, signOut: () => supabase.auth.signOut() }}>{children}</AuthCtx.Provider>;
}

export function useAuth() { return useContext(AuthCtx); }
