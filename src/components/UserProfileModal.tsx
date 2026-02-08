import { useState, useEffect } from 'react'

interface UserProfileFormData {
    name: string
    email: string
    password: string
}

interface UserProfileModalProps {
    isDark: boolean
    isOpen: boolean
    currentUser: UserProfileFormData
    onClose: () => void
    onSave: (data: UserProfileFormData) => Promise<void>
}

const UserProfileModal = ({ isDark, isOpen, currentUser, onClose, onSave }: UserProfileModalProps) => {
    const [formData, setFormData] = useState<UserProfileFormData>(currentUser)
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<Partial<UserProfileFormData>>({})

    useEffect(() => {
        if (isOpen) {
            setFormData(currentUser)
            setErrors({})
        }
    }, [isOpen, currentUser])

    if (!isOpen) return null

    const [isSaving, setIsSaving] = useState(false)

    const validateForm = () => {
        const newErrors: Partial<UserProfileFormData> = {}
        let isValid = true

        if (!formData.name.trim()) {
            newErrors.name = 'Full Name is required'
            isValid = false
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email Address is required'
            isValid = false
        }
        if (!formData.password) {
            newErrors.password = 'Master Password is required'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm() && !isSaving) {
            try {
                setIsSaving(true)
                await onSave(formData)
                onClose()
            } catch (error) {
                // Error handled by parent toast
            } finally {
                setIsSaving(false)
            }
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className={`relative w-full max-w-md rounded-2xl shadow-xl transform transition-all scale-100 ${isDark ? 'bg-[#1a1f2e]' : 'bg-white'
                }`}>
                <div className={`p-6 border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Edit Profile
                    </h2>
                    <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Update your personal information.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Name */}
                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({ ...formData, name: e.target.value })
                                if (errors.name) setErrors({ ...errors, name: '' })
                            }}
                            className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all ${errors.name
                                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                                : isDark
                                    ? 'bg-[#0f1419] border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                                }`}
                            placeholder="Enter your full name"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value })
                                if (errors.email) setErrors({ ...errors, email: '' })
                            }}
                            className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all ${errors.email
                                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                                : isDark
                                    ? 'bg-[#0f1419] border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                                }`}
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            Master Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => {
                                    setFormData({ ...formData, password: e.target.value })
                                    if (errors.password) setErrors({ ...errors, password: '' })
                                }}
                                className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all ${errors.password
                                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                                    : isDark
                                        ? 'bg-[#0f1419] border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                                    }`}
                                placeholder="Enter your master password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-opacity-10 ${isDark ? 'text-gray-400 hover:bg-gray-500' : 'text-gray-500 hover:bg-gray-900'
                                    }`}
                            >
                                {showPassword ? (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${isDark
                                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!formData.name.trim() || !formData.email.trim() || !formData.password || isSaving}
                            className={`px-6 py-2.5 font-medium rounded-lg transition-colors shadow-lg ${!formData.name.trim() || !formData.email.trim() || !formData.password || isSaving
                                    ? 'bg-gray-400 cursor-not-allowed opacity-50 shadow-none'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/30'
                                }`}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserProfileModal
