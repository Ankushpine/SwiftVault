import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { toast } from 'react-hot-toast'

import PasswordTable from '../components/PasswordTable'
import AddPasswordModal, { type PasswordFormData } from '../components/AddPasswordModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import AddGroupModal from '../components/AddGroupModal'
import UnlockVaultModal from '../components/UnlockVaultModal'
import PasswordDetailsModal from '../components/PasswordDetailsModal'
import { type Password } from '../data/demoData'
import { fetchVaultEntries, addVaultEntry, updateVaultEntry, deleteVaultEntry, toggleFavorite } from '../lib/dataManupulation'
import { fetchGroups, addGroup, updateGroup, deleteGroup } from '../lib/groupManipulation'

const Home = () => {
    const { masterPassword } = useAuth()
    const [isDark, setIsDark] = useState(false)
    const [activeGroup, setActiveGroup] = useState('all') 
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)

    // Groups State
    const [groups, setGroups] = useState<any[]>([])
    const [loadingGroups, setLoadingGroups] = useState(true)

    // passwords state will now hold our Vault Items
    const [passwords, setPasswords] = useState<any[]>([]) 
    const [editingPassword, setEditingPassword] = useState<any | null>(null)
    const [deletingPassword, setDeletingPassword] = useState<any | null>(null)
    const [viewingPassword, setViewingPassword] = useState<Password | null>(null)
    const [editingGroup, setEditingGroup] = useState<{ id: string; label: string } | null>(null)
    const [deletingGroup, setDeletingGroup] = useState<{ id: string; label: string } | null>(null)

    // Load Groups
    const loadGroups = async () => {
        try {
            setLoadingGroups(true)
            const data = await fetchGroups()
             // Map Supabase data to UI (assuming fields: id, name, icon, user_id)
            const mapped = data.map((g: any) => ({
                id: g.id,
                label: g.name,
                icon: g.icon_type || '📁',
                color: 'gray'
            }))
            // Add 'All', 'Favorites', 'Recent' are handled by Sidebar statically or logic?
            // Sidebar handles 'all', 'favorites', 'recent' separately in `menuItems`. 
            // `groups` prop is only for user defined groups.
            setGroups(mapped)
        } catch (error) {
            console.error('Error loading groups:', error)
            toast.error('Failed to load groups')
        } finally {
            setLoadingGroups(false)
        }
    }

    useEffect(() => {
        loadGroups()
    }, [])

    // Helper to map Supabase Vault Item to UI Password object
    const mapVaultItemToPassword = (item: any, groups: any[]) => {
        // Find group by ID or Label (handles legacy/demo data where name might be stored)
        const groupObj = groups.find(g => g.id === item.group_name || g.label === item.group_name);
        
        return {
            id: item.id,
            account: item.account_name,
            username: item.username || '',
            email: item.email || '',
            password: item.password,
            group: groupObj ? groupObj.id : item.group_name, // Prefer UUID for Modal selection
            groupLabel: groupObj ? groupObj.label : item.group_name,
            phoneNumber: item.phone_no || '',
            isFavorite: item.is_favorite,
            securityDetails: `Q: ${item.security_question}\nA: ${item.security_answer}`,
            securityQuestion: item.security_question || '',
            securityAnswer: item.security_answer || '',
            updatedAt: new Date(item.created_at),
            createdAt: new Date(item.created_at)
        };
    };

    // Load Vault Data
    const [loadingPasswords, setLoadingPasswords] = useState(true)

    useEffect(() => {
      const loadDashboard = async () => {
        if (!masterPassword) return; 
        
        try {
          setLoadingPasswords(true)
          const items = await fetchVaultEntries(masterPassword, activeGroup);
          const mappedItems = items.map((item: any) => mapVaultItemToPassword(item, groups));
          setPasswords(mappedItems);
        } catch (error) {
            console.error("Error loading vault entries:", error);
            // toast.error("Failed to load passwords"); // Optional: depends on UX preference
        } finally {
            setLoadingPasswords(false)
        }
      };
      
      loadDashboard();
    }, [masterPassword, activeGroup, groups]); 


    // Filter passwords based on active group and search query
    const filteredPasswords = useMemo(() => {
        let filtered = passwords
        
        if (activeGroup === 'favorites') {
            filtered = filtered.filter(p => p.isFavorite)
        } else if (activeGroup === 'recent') {
            const sevenDaysAgo = new Date()
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
            filtered = passwords.filter(p => p.createdAt >= sevenDaysAgo)
        } 
        
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim()
            filtered = filtered.filter(p => p.account.toLowerCase().includes(query))
        }

        return filtered
    }, [activeGroup, passwords, searchQuery])

    // Get group display name and description
    const getGroupInfo = () => {
        switch (activeGroup) {
            case 'all': 
                return { name: 'All Passwords', description: 'Manage all your saved credentials.' }
            case 'favorites':
                return { name: 'Favorites', description: 'Your most frequently accessed passwords.' }
            case 'recent':
                return { name: 'Recent', description: 'Passwords added in the last 7 days.' }
            default:
                const group = groups.find(g => g.id === activeGroup)
                if (group) {
                    return { name: `${group.label} Group`, description: `Manage credentials for your ${group.label.toLowerCase()}.` }
                }
                return { name: activeGroup, description: 'Manage your credentials.' }
        }
    }

    const groupInfo = getGroupInfo()

    const handleAddNew = () => {
        setEditingPassword(null)
        setIsModalOpen(true)
    }

    const handleEditPassword = (password: Password) => {
        setEditingPassword(password)
        setIsModalOpen(true)
    }

    const handleDeletePassword = (password: Password) => {
        setDeletingPassword(password)
    }

    const handleSavePassword = async (data: PasswordFormData) => {
        try {
            if (!masterPassword) {
                 toast.error('Session invalid. Please login again.');
                 return;
            }

            if (editingPassword) {
                // Update logic
                await updateVaultEntry(editingPassword.id, {
                    accountName: data.account,
                    group: data.group,
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    phone: data.phoneNumber,
                    securityQuestion: data.securityQuestion,
                    securityAnswer: data.securityAnswer
                }, masterPassword);
                
                toast.success('Password updated successfully!');
            } else {
                // Add new entry
                await addVaultEntry({
                    accountName: data.account,
                    group: data.group,
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    phone: data.phoneNumber,
                    securityQuestion: data.securityQuestion,
                    securityAnswer: data.securityAnswer
                }, masterPassword);
                
                toast.success('Password saved successfully!');
            }

            // Refresh list
            const items = await fetchVaultEntries(masterPassword, activeGroup);
            const mappedItems = items.map((item: any) => mapVaultItemToPassword(item, groups));
            setPasswords(mappedItems);
            setIsModalOpen(false)
            setEditingPassword(null)
        } catch (error: any) {
            console.error('Error saving password:', error);
            toast.error(error.message || 'Failed to save password');
        }
    }

    const handleToggleFavorite = async (password: Password) => {
        try {
            const newFavoriteStatus = !password.isFavorite;
            
            // Optimistic update
            setPasswords(currentPasswords => {
                return currentPasswords.map(p => {
                    if (p.id === password.id) {
                        return { ...p, isFavorite: newFavoriteStatus }
                    }
                    return p
                })
            })

            await toggleFavorite(password.id, newFavoriteStatus);
            toast.success(newFavoriteStatus ? 'Added to favorites' : 'Removed from favorites');
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast.error('Failed to update favorite status');
            // Revert optimistic update if needed (omitted for simplicity, but could be added)
        }
    }

    const handleSaveGroup = async (name: string) => {
        try {
            if (editingGroup) {
                await updateGroup(editingGroup.id, name)
                toast.success('Group updated')
                setEditingGroup(null)
            } else {
                await addGroup(name)
                toast.success('Group added')
            }
            await loadGroups()
            setIsGroupModalOpen(false)
        } catch (error: any) {
            console.error('Error saving group:', error)
            toast.error('Failed to save group: ' + error.message)
        }
    }

    const handleEditGroup = (group: { id: string; label: string }) => {
        setEditingGroup(group)
        setIsGroupModalOpen(true)
    }

    const handleDeleteGroup = (group: { id: string; label: string }) => {
        setDeletingGroup(group)
    }

    const handleViewDetails = (password: Password) => {
        setViewingPassword(password)
    }

    const handleEditFromDetails = (password: Password) => {
        setViewingPassword(null)
        setEditingPassword(password)
        setIsModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (deletingPassword) {
            try {
                await deleteVaultEntry(deletingPassword.id);
                setPasswords(passwords.filter(p => p.id !== deletingPassword.id))
                toast.success('Account deleted successfully');
                setDeletingPassword(null)
            } catch (error: any) {
                console.error('Error deleting password:', error);
                toast.error('Failed to delete account');
            }
        } else if (deletingGroup) {
            try {
                await deleteGroup(deletingGroup.id)
                toast.success('Group deleted')
                if (activeGroup === deletingGroup.id) {
                    setActiveGroup('All')
                }
                await loadGroups()
                setDeletingGroup(null)
            } catch (error: any) {
                console.error('Error deleting group:', error)
                toast.error('Failed to delete group: ' + error.message)
            }
        }
    }



    return (
        <div className={`flex h-screen transition-colors ${isDark ? 'bg-[#0a0e14]' : 'bg-gray-50'
            }`}>
            <Sidebar
                isDark={isDark}
                activeGroup={activeGroup}
                groups={groups}
                isLoading={loadingGroups}
                onGroupChange={setActiveGroup}
                onEditGroup={handleEditGroup}
                onDeleteGroup={handleDeleteGroup}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-8 pb-4 flex-shrink-0">
                    <Header
                        isDark={isDark}
                        groupName={groupInfo.name}
                        groupDescription={groupInfo.description}
                        searchQuery={searchQuery}
                        onSearch={setSearchQuery}
                        onAddNew={handleAddNew}
                        onAddGroup={() => {
                            setEditingGroup(null)
                            setIsGroupModalOpen(true)
                        }}
                        onThemeToggle={() => setIsDark(!isDark)}
                    />
                </div>

                <div className="flex-1 px-8 pb-8 min-h-0">
                    <PasswordTable
                        isDark={isDark}
                        passwords={filteredPasswords}
                        groupName={groupInfo.name}
                        isLoading={loadingPasswords}
                        onEdit={handleEditPassword}
                        onDelete={handleDeletePassword}
                        onToggleFavorite={handleToggleFavorite}
                        onViewDetails={handleViewDetails}
                    />
                </div>
            </div>

            <AddPasswordModal
                isDark={isDark}
                isOpen={isModalOpen}
                editMode={!!editingPassword}
                initialData={editingPassword ? {
                    account: editingPassword.account,
                    group: editingPassword.group,
                    username: editingPassword.username,
                    email: editingPassword.email,
                    password: editingPassword.password,
                    phoneNumber: editingPassword.phoneNumber,
                    securityQuestion: editingPassword.securityQuestion,
                    securityAnswer: editingPassword.securityAnswer,
                    securityDetails: editingPassword.securityDetails
                } : null}
                groups={groups.map(g => ({ id: g.id, label: g.label }))}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditingPassword(null)
                }}
                onSave={handleSavePassword}
            />

            <DeleteConfirmModal
                isDark={isDark}
                isOpen={!!deletingPassword || !!deletingGroup}
                title={deletingGroup ? 'Delete Group?' : 'Delete Account?'}
                accountName={deletingGroup ? deletingGroup.label : deletingPassword?.account || ''}
                onClose={() => {
                    setDeletingPassword(null)
                    setDeletingGroup(null)
                }}
                onConfirm={handleConfirmDelete}
            />

            <AddGroupModal
                isDark={isDark}
                isOpen={isGroupModalOpen}
                initialName={editingGroup?.label}
                onClose={() => {
                    setIsGroupModalOpen(false)
                    setEditingGroup(null)
                }}
                onSave={handleSaveGroup}
            />


            <PasswordDetailsModal
                isDark={isDark}
                isOpen={!!viewingPassword}
                onClose={() => setViewingPassword(null)}
                password={viewingPassword}
                onEdit={handleEditFromDetails}
            />

            <UnlockVaultModal 
                isOpen={!masterPassword} 
                isDark={isDark} 
            />
        </div>
    )
}

export default Home