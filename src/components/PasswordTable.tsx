import { useState, useEffect, useRef } from 'react'
import type { Password } from '../data/demoData'

interface PasswordTableProps {
    isDark: boolean
    passwords: Password[]
    groupName: string
    isLoading?: boolean
    onEdit?: (password: Password) => void
    onDelete?: (password: Password) => void
    onToggleFavorite?: (password: Password) => void
    onViewDetails?: (password: Password) => void
}

const PasswordTable = ({ isDark, passwords, groupName, isLoading, onEdit, onDelete, onToggleFavorite, onViewDetails }: PasswordTableProps) => {
    const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())
    const [visibleSecurityDetails, setVisibleSecurityDetails] = useState<Set<string>>(new Set())
    const [copiedField, setCopiedField] = useState<string>('')
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const togglePasswordVisibility = (id: string) => {
        const newVisible = new Set(visiblePasswords)
        if (newVisible.has(id)) {
            newVisible.delete(id)
        } else {
            newVisible.add(id)
        }
        setVisiblePasswords(newVisible)
    }

    const toggleSecurityVisibility = (id: string) => {
        const newVisible = new Set(visibleSecurityDetails)
        if (newVisible.has(id)) {
            newVisible.delete(id)
        } else {
            newVisible.add(id)
        }
        setVisibleSecurityDetails(newVisible)
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const toggleDropdown = (id: string) => {
        setOpenDropdown(openDropdown === id ? null : id)
    }

    const handleEdit = (password: Password) => {
        setOpenDropdown(null)
        onEdit?.(password)
    }

    const handleDelete = (password: Password) => {
        setOpenDropdown(null)
        onDelete?.(password)
    }

    const copyToClipboard = async (text: string, fieldId: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedField(fieldId)
            setTimeout(() => setCopiedField(''), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const getInitials = (account: string): string => {
        return account.charAt(0).toUpperCase()
    }

    const getColorForAccount = (account: string): string => {
        const colors = [
            'bg-blue-500',
            'bg-green-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-yellow-500',
            'bg-red-500'
        ]
        const index = account.charCodeAt(0) % colors.length
        return colors[index]
    }

    const CopyButton = ({ text, fieldId }: { text: string; fieldId: string }) => {
        const isCopied = copiedField === fieldId

        return (
            <button
                onClick={() => copyToClipboard(text, fieldId)}
                className={`p-1 rounded transition-all ${isCopied
                    ? 'bg-green-500 text-white'
                    : isDark
                        ? 'hover:bg-gray-700 text-gray-400'
                        : 'hover:bg-gray-200 text-gray-500'
                    }`}
                title="Copy to clipboard"
            >
                {isCopied ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                )}
            </button>
        )
    }

    return (
        <div className={`h-full flex flex-col rounded-xl overflow-hidden transition-colors border ${isDark ? 'bg-[#1a1f2e] border-gray-800' : 'bg-white border-gray-200'
            }`}>
            {/* Count Header */}
            <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-800 bg-[#0f1419]' : 'border-gray-200 bg-gray-50'
                }`}>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Showing {passwords.length} items in <span className="font-medium">{groupName}</span>
                </p>
            </div>

            {/* Scrollable Table Container */}
            <div className="flex-1 overflow-auto">
                <table className="w-full">
                    <thead className={`sticky top-0 z-10 ${isDark ? 'bg-[#0f1419]' : 'bg-gray-50'}`}>
                        <tr>
                            <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                Account
                            </th>
                            <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                Username
                            </th>
                            <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                Email
                            </th>
                            <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                Password
                            </th>
                            <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                Phone No.
                            </th>
                            <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                Security Details
                            </th>
                            <th className={`px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                Favorite
                            </th>
                            <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                                            <div className={`h-4 w-24 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><div className={`h-4 w-20 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div></td>
                                    <td className="px-6 py-4"><div className={`h-4 w-32 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div></td>
                                    <td className="px-6 py-4"><div className={`h-4 w-24 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div></td>
                                    <td className="px-6 py-4"><div className={`h-4 w-24 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div></td>
                                    <td className="px-6 py-4"><div className={`h-4 w-32 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div></td>
                                    <td className="px-6 py-4"><div className={`h-4 w-6 mx-auto rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div></td>
                                    <td className="px-6 py-4"></td>
                                </tr>
                            ))
                        ) : (
                            passwords.map((password) => (
                            <tr
                                key={password.id}
                                onClick={() => onViewDetails?.(password)}
                                className={`transition-colors cursor-pointer ${isDark ? 'hover:bg-[#0f1419]' : 'hover:bg-gray-50'
                                    }`}
                            >
                                {/* Account */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full ${getColorForAccount(password.account)} flex items-center justify-center text-white font-semibold`}>
                                            {getInitials(password.account)}
                                        </div>
                                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {password.account}
                                        </span>
                                    </div>
                                </td>

                                {/* Username */}
                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    {password.username ? (
                                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                            <span>{password.username}</span>
                                            <CopyButton text={password.username} fieldId={`username-${password.id}`} />
                                        </div>
                                    ) : (
                                        <span className={`text-xs italic ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Not Linked</span>
                                    )}
                                </td>

                                {/* Email */}
                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    {password.email ? (
                                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                            <span>{password.email}</span>
                                            <CopyButton text={password.email} fieldId={`email-${password.id}`} />
                                        </div>
                                    ) : (
                                        <span className={`text-xs italic ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Not Linked</span>
                                    )}
                                </td>

                                {/* Password */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {password.password ? (
                                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                            <span className={`text-sm font-mono ${isDark ? 'text-gray-300' : 'text-gray-600'
                                                }`}>
                                                {visiblePasswords.has(password.id) ? password.password : '••••••••'}
                                            </span>
                                            <CopyButton text={password.password} fieldId={`password-${password.id}`} />
                                            <button
                                                onClick={() => togglePasswordVisibility(password.id)}
                                                className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-500'
                                                    }`}
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    {visiblePasswords.has(password.id) ? (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    ) : (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    )}
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <span className={`text-xs italic ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Not Linked</span>
                                    )}
                                </td>

                                {/* Phone Number */}
                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                    {password.phoneNumber ? (
                                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                            <span>{password.phoneNumber}</span>
                                            <CopyButton text={password.phoneNumber} fieldId={`phone-${password.id}`} />
                                        </div>
                                    ) : (
                                        <span className={`text-xs italic ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Not Linked</span>
                                    )}
                                </td>

                                {/* Security Details */}
                                <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                    {password.securityQuestion ? (
                                        <div className="flex items-start gap-2" onClick={(e) => e.stopPropagation()}>
                                            <div className="max-w-xs">
                                                {password.securityDetails.split('\n').map((line, i) => {
                                                    const isQuestion = line.startsWith('Q:');
                                                    const content = line.startsWith('A: ') ? line.substring(3) : line;

                                                    if (isQuestion) return <div key={i} className="text-xs font-medium opacity-80 mb-0.5">{line}</div>;

                                                    return (
                                                        <div key={i} className="flex items-center gap-2">
                                                            <span className="text-xs font-mono">
                                                                A: {visibleSecurityDetails.has(password.id) ? content : '•'.repeat(Math.min(content.length, 8))}
                                                            </span>
                                                            <button
                                                                onClick={() => toggleSecurityVisibility(password.id)}
                                                                className={`p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                                                                title={visibleSecurityDetails.has(password.id) ? "Hide answer" : "Show answer"}
                                                            >
                                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    {visibleSecurityDetails.has(password.id) ? (
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                                    ) : (
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                    )}
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <CopyButton
                                                text={(() => {
                                                    const lines = password.securityDetails.split('\n');
                                                    const answerLine = lines.find(line => !line.startsWith('Q:'));
                                                    return answerLine ? (answerLine.startsWith('A: ') ? answerLine.substring(3) : answerLine) : '';
                                                })()}
                                                fieldId={`security-${password.id}`}
                                            />
                                        </div>
                                    ) : (
                                        <span className={`text-xs italic ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Not Linked</span>
                                    )}
                                </td>

                                {/* Favorite */}
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onToggleFavorite?.(password)
                                        }}
                                        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-all ${password.isFavorite
                                            ? 'text-yellow-500'
                                            : isDark ? 'text-gray-400' : 'text-gray-500'
                                            }`}
                                        aria-label={password.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                    >
                                        {password.isFavorite ? (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        )}
                                    </button>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 whitespace-nowrap text-right relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            toggleDropdown(password.id)
                                        }}
                                        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-500'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {openDropdown === password.id && (
                                        <div
                                            ref={dropdownRef}
                                            onClick={(e) => e.stopPropagation()}
                                            className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10 ${isDark ? 'bg-[#1a1f2e] border border-gray-700' : 'bg-white border border-gray-200'
                                                }`}
                                        >
                                            <div className="py-1">
                                                <button
                                                    onClick={() => handleEdit(password)}
                                                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${isDark
                                                        ? 'text-gray-300 hover:bg-gray-800'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(password)}
                                                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${isDark
                                                        ? 'text-red-400 hover:bg-gray-800'
                                                        : 'text-red-600 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PasswordTable
