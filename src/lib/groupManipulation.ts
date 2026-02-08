import { supabase } from "../config/supabase";

// --- FETCH GROUPS ---
export const fetchGroups = async () => {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

// --- ADD GROUP ---
export const addGroup = async (groupName: string) => {
  const user = (await supabase.auth.getUser()).data.user;
  
  const { data, error } = await supabase
    .from('groups')
    .insert([{
      name: groupName,
      user_id: user?.id,
      icon_type: '📁' // Default icon
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// --- UPDATE GROUP ---
export const updateGroup = async (groupId: string, newName: string) => {
  const { data, error } = await supabase
    .from('groups')
    .update({ name: newName })
    .eq('id', groupId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// --- DELETE GROUP ---
export const deleteGroup = async (groupId: string) => {
  const { error } = await supabase
    .from('groups')
    .delete()
    .eq('id', groupId);

  if (error) throw error;
};