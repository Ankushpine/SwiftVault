import { useState } from 'react'
import type { Password } from '../data/demoData'
import toast from 'react-hot-toast'

interface PasswordDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    password: Password | null
    isDark: boolean
    onEdit: (password: Password) => void
}

const PasswordDetailsModal = ({ isOpen, onClose, password, isDark, onEdit }: PasswordDetailsModalProps) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showSecurityAnswer, setShowSecurityAnswer] = useState(false)

    if (!isOpen || !password) return null

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`${label} copied!`)
    }

    const getInitials = (account: string): string => {
        return account.charAt(0).toUpperCase()
    }

    const getColorForAccount = (account: string): string => {
        const colors = [
            'bg-blue-100 text-blue-600',
            'bg-green-100 text-green-600',
            'bg-purple-100 text-purple-600',
            'bg-pink-100 text-pink-600',
            'bg-yellow-100 text-yellow-600',
            'bg-red-100 text-red-600'
        ]
        const index = account.charCodeAt(0) % colors.length
        return colors[index]
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 ${
                isDark ? 'bg-[#1a1f2e] text-white border border-gray-800' : 'bg-white text-gray-900'
            }`}>
                {/* Header */}
                <div className="p-6 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${getColorForAccount(password.account)}`}>
                            {getInitials(password.account)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{password.account}</h2>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {password.groupLabel || password.group || 'General'}
                            </p>
                        </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Secure
                    </span>
                </div>

                {/* Content */}
                <div className="px-6 pb-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Username */}
                        <div className="space-y-1.5">
                            <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                Username
                            </label>
                            <div className="flex items-center justify-between group">
                                <span className="font-medium truncate">{password.username || 'Not Linked'}</span>
                                {password.username && (
                                    <button 
                                        onClick={() => copyToClipboard(password.username, 'Username')}
                                        className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                                    >
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-6a2 2 0 00-2 2zM8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                Email
                            </label>
                            <div className="flex items-center justify-between group">
                                <span className="font-medium truncate">{password.email || 'Not Linked'}</span>
                                {password.email && (
                                    <button 
                                        onClick={() => copyToClipboard(password.email, 'Email')}
                                        className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                                    >
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-6a2 2 0 00-2 2zM8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            Password
                        </label>
                        <div className={`flex items-center justify-between p-3 rounded-xl border ${
                            isDark ? 'bg-gray-800/20 border-gray-700' : 'bg-gray-50 border-gray-100'
                        }`}>
                            {password.password ? (
                                <>
                                    <span className="font-mono text-lg">
                                        {showPassword ? password.password : '••••••••••••••••'}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                {showPassword ? (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                ) : (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                )}
                                                {!showPassword && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />}
                                            </svg>
                                        </button>
                                        <div className={`w-px h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                        <button 
                                            onClick={() => copyToClipboard(password.password, 'Password')}
                                            className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-6a2 2 0 00-2 2zM8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                            </svg>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <span className={`text-sm italic ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Not Linked</span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Phone Number */}
                        <div className="space-y-1.5">
                            <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                Phone Number
                            </label>
                            <p className="font-medium">{password.phoneNumber || 'Not Linked'}</p>
                        </div>

                        {/* Date Created */}
                        <div className="space-y-1.5">
                            <label className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                Date Created
                            </label>
                            <p className="font-medium">
                                {password.createdAt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* Security Details Section */}
                    <div className={`pt-6 border-t space-y-4 ${
                        isDark ? 'border-gray-800' : 'border-gray-100'
                    }`}>
                        <div className="flex items-center gap-2">
                             <div className={`p-1.5 rounded-lg ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                             </div>
                            <span className={`text-[11px] uppercase font-bold tracking-[0.1em] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Security Details
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-5 mt-2">
                            <div>
                                <p className={`text-[10px] uppercase font-bold tracking-wider mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Security Question
                                </p>
                                <p className={`font-medium text-sm leading-relaxed ${!password.securityQuestion ? 'italic opacity-60' : ''}`}>
                                    {password.securityQuestion || 'Not Linked'}
                                </p>
                            </div>
                            
                            {password.securityQuestion && (
                                <div>
                                    <p className={`text-[10px] uppercase font-bold tracking-wider mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                        Security Answer
                                    </p>
                                    <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                        isDark ? 'bg-gray-800/20 border-gray-700 hover:bg-gray-800/40' : 'bg-gray-50 border-gray-100 hover:bg-gray-100/50'
                                    }`}>
                                        <span className="font-mono text-sm">
                                            {showSecurityAnswer ? password.securityAnswer : '••••••••••••'}
                                        </span>
                                        <button 
                                            onClick={() => setShowSecurityAnswer(!showSecurityAnswer)}
                                            className={`p-1.5 rounded-lg transition-colors ${
                                                isDark ? 'text-gray-500 hover:text-white hover:bg-gray-700' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-200'
                                            }`}
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                {showSecurityAnswer ? (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                ) : (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                )}
                                                {!showSecurityAnswer && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943-9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />}
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={`p-4 flex items-center justify-end gap-3 border-t ${
                    isDark ? 'bg-gray-800/30 border-gray-800' : 'bg-gray-50 border-gray-100'
                }`}>
                    <button
                        onClick={onClose}
                        className={`px-6 py-2 rounded-xl text-sm font-semibold transition-colors ${
                            isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                        Close
                    </button>
                    <button
                        onClick={() => onEdit(password)}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit Details
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PasswordDetailsModal
