import { supabase } from '../config/supabase';

/**
 * Fetch the current user's profile details
 */
export const fetchUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
        .from('profiles')
        .select('full_name, id')
        .eq('id', user.id)
        .maybeSingle(); // Use maybeSingle to avoid 406 error when no row exists

    if (error) throw error;
    
    return {
        fullName: data?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email,
    };
};

/**
 * Update the user's Profile details
 */
export const updateUserProfile = async (fullName: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
        .from('profiles')
        .upsert({ 
            id: user.id,
            full_name: fullName,
            updated_at: new Date().toISOString()
        });

    if (error) throw error;
    return true;
};
