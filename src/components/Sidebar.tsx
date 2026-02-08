import { useState, useRef, useEffect } from 'react'

interface SidebarProps {
    isDark: boolean
    activeGroup: string
    groups: Array<{ id: string; icon: string; label: string; color: string }>
    isLoading?: boolean
    onGroupChange: (group: string) => void
    onEditGroup: (group: { id: string; label: string }) => void
    onDeleteGroup: (group: { id: string; label: string }) => void
}

const Sidebar = ({ isDark, activeGroup, groups, isLoading, onGroupChange, onEditGroup, onDeleteGroup }: SidebarProps) => {
    // ... existing hooks ...
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const menuItems = [
        { id: 'all', icon: '🔑', label: 'All Passwords' },
        { id: 'favorites', icon: '⭐', label: 'Favorites' },
        { id: 'recent', icon: '🕐', label: 'Recent' }
    ]

    return (
        <div className={`w-52 h-screen flex flex-col border-r transition-colors ${isDark ? 'bg-[#0a0e14] border-gray-800' : 'bg-white border-gray-200'
            }`}>
            {/* Logo and Main Menu sections unchanged, skipping to groups section for editing */}
            <div className="p-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Vault
                </span>
            </div>

            {/* Main Menu */}
            <div className="flex-1 overflow-y-auto px-3 py-2">
                <div className="space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onGroupChange(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeGroup === item.id
                                ? isDark
                                    ? 'bg-blue-600/20 text-blue-400'
                                    : 'bg-blue-50 text-blue-600'
                                : isDark
                                    ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            <span className="text-base">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Groups Section */}
                <div className="mt-6">
                    <div className="px-3 mb-2">
                        <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                            Groups
                        </span>
                    </div>

                    <div className="space-y-1">
                        {isLoading ? (
                             // Skeleton Loader
                             Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3 px-3 py-2 animate-pulse">
                                    <div className={`w-5 h-5 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                                    <div className={`h-4 rounded w-24 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                                </div>
                             ))
                        ) : (
                            groups.map((group) => (
                            <button
                                key={group.id}
                                onClick={() => onGroupChange(group.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeGroup === group.id
                                    ? isDark
                                        ? 'bg-blue-600/20 text-blue-400'
                                        : 'bg-blue-50 text-blue-600'
                                    : isDark
                                        ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                <div className="flex-1 flex items-center gap-3 min-w-0">
                                    <span className="text-base">{group.icon}</span>
                                    <span className="font-medium truncate">{group.label}</span>
                                </div>
                                <div className="relative group/btn" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => setOpenDropdown(openDropdown === group.id ? null : group.id)}
                                        className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                                            } ${openDropdown === group.id ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" />
                                            <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" />
                                            <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" />
                                        </svg>
                                    </button>

                                    {openDropdown === group.id && (
                                        <div
                                            ref={dropdownRef}
                                            className={`absolute right-0 top-full mt-1 w-32 rounded-lg shadow-lg border z-50 ${isDark ? 'bg-[#1a1f2e] border-gray-700' : 'bg-white border-gray-200'
                                                }`}
                                        >
                                            <button
                                                onClick={() => {
                                                    onEditGroup({ id: group.id, label: group.label })
                                                    setOpenDropdown(null)
                                                }}
                                                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-opacity-50 ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onDeleteGroup({ id: group.id, label: group.label })
                                                    setOpenDropdown(null)
                                                }}
                                                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 text-red-500 hover:bg-opacity-50 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                                                    }`}
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))
                    )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
