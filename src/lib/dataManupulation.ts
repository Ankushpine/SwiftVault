import { supabase } from '../config/supabase';
import { encryptData, decryptData } from './crypto';

// Define a type for the Vault Entry to avoid 'any'
export interface VaultEntryInput {
    accountName: string;
    group: string;
    username?: string;
    email?: string;
    password: string;
    phone?: string;
    securityQuestion?: string;
    securityAnswer?: string;
}

export const addVaultEntry = async (formData: VaultEntryInput, masterPassword: string) => {
    const encryptedPassword = encryptData(formData.password, masterPassword);
    const encryptedSecurityAns = formData.securityAnswer
        ? encryptData(formData.securityAnswer, masterPassword)
        : null;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
        .from('vault')
        .insert([
            {
                account_name: formData.accountName,
                group_name: formData.group,
                username: formData.username,
                email: formData.email,
                encrypted_password: encryptedPassword,
                phone_no: formData.phone,
                security_question: formData.securityQuestion,
                security_answer: encryptedSecurityAns,
                user_id: user.id
            }
        ])
        .select();

    if (error) throw error;
    return data;
};

/**
 * NEW: Update an existing entry
 * Uses Partial<VaultEntryInput> so you can update only specific fields
 */
export const updateVaultEntry = async (id: string, formData: Partial<VaultEntryInput>, masterPassword: string) => {
    const updates: any = {
        account_name: formData.accountName,
        group_name: formData.group,
        username: formData.username,
        email: formData.email,
        phone_no: formData.phone,
        security_question: formData.securityQuestion,
    };

    // Only re-encrypt if the user provided a new password or security answer
    if (formData.password) {
        updates.encrypted_password = encryptData(formData.password, masterPassword);
    }
    if (formData.securityAnswer) {
        updates.security_answer = encryptData(formData.securityAnswer, masterPassword);
    }

    const { data, error } = await supabase
        .from('vault')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) throw error;
    return data;
};

/**
 * NEW: Delete an entry
 */
export const deleteVaultEntry = async (id: string) => {
    const { error } = await supabase
        .from('vault')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return true;
};

export const fetchVaultEntries = async (masterPassword: string, selectedGroup = 'all') => {
    let query = supabase.from('vault').select('*');

    // Only filter by group if it's not a special virtual group
    const virtualGroups = ['all', 'favorites', 'recent'];
    if (!virtualGroups.includes(selectedGroup)) {
        query = query.eq('group_name', selectedGroup);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map((item) => {
        try {
             return {
                ...item,
                password: decryptData(item.encrypted_password, masterPassword),
                security_answer: item.security_answer
                    ? decryptData(item.security_answer, masterPassword)
                    : null
            };
        } catch (e) {
            console.error("Failed to decrypt item:", item.id, e);
            return { ...item, password: '[Decryption Failed]', security_answer: null };
        }
    });
};
/**
 * Toggle favorite status
 */
export const toggleFavorite = async (id: string, isFavorite: boolean) => {
    const { data, error } = await supabase
        .from('vault')
        .update({ is_favorite: isFavorite })
        .eq('id', id)
        .select();

    if (error) throw error;
    return data;
};
