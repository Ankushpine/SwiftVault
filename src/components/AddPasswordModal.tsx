import { useState, useEffect, type FormEvent } from 'react'

interface AddPasswordModalProps {
    isDark: boolean
    isOpen: boolean
    editMode?: boolean
    initialData?: PasswordFormData | null
    groups: Array<{ id: string; label: string }>
    onClose: () => void
    onSave: (data: PasswordFormData) => void
}

export interface PasswordFormData {
    account: string
    group: string
    username: string
    email: string
    password: string
    phoneNumber: string
    securityQuestion: string
    securityAnswer: string
    securityDetails: string // Added to match Home.tsx usage
}

const AddPasswordModal = ({ isDark, isOpen, editMode = false, initialData = null, groups, onClose, onSave }: AddPasswordModalProps) => {
    const [formData, setFormData] = useState<PasswordFormData>({
        account: '',
        group: '',
        username: '',
        email: '',
        password: '',
        phoneNumber: '',
        securityQuestion: '',
        securityAnswer: '',
        securityDetails: ''
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showSecurityAnswer, setShowSecurityAnswer] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)
    const [errors, setErrors] = useState<Partial<Record<keyof PasswordFormData, string>>>({})

    // Pre-fill form data when in edit mode
    useEffect(() => {
        if (editMode && initialData) {
            setFormData(initialData)
            setPasswordStrength(calculatePasswordStrength(initialData.password))
            setErrors({})
        } else {
            // Reset form when not in edit mode
            setFormData({
                account: '',
                group: '',
                username: '',
                email: '',
                password: '',
                phoneNumber: '',
                securityQuestion: '',
                securityAnswer: '',
                securityDetails: ''
            })
            setPasswordStrength(0)
            setErrors({})
        }
    }, [editMode, initialData, isOpen])

    if (!isOpen) return null

    const calculatePasswordStrength = (password: string): number => {
        let strength = 0
        if (!password) return 0
        if (password.length >= 8) strength += 25
        if (password.length >= 12) strength += 25
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25
        if (/\d/.test(password)) strength += 12.5
        if (/[^a-zA-Z0-9]/.test(password)) strength += 12.5
        return Math.min(strength, 100)
    }

    const generatePassword = () => {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const lowercase = 'abcdefghijklmnopqrstuvwxyz'
        const numbers = '0123456789'
        const special = '!@#$%^&*()_+-=[]{}|;:,.<>?'
        const allChars = uppercase + lowercase + numbers + special

        let password = ''
        // Ensure at least one of each type
        password += uppercase[Math.floor(Math.random() * uppercase.length)]
        password += lowercase[Math.floor(Math.random() * lowercase.length)]
        password += numbers[Math.floor(Math.random() * numbers.length)]
        password += special[Math.floor(Math.random() * special.length)]

        // Fill the rest randomly
        for (let i = 4; i < 16; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)]
        }

        // Shuffle the password
        password = password.split('').sort(() => Math.random() - 0.5).join('')

        setFormData({ ...formData, password })
        setPasswordStrength(calculatePasswordStrength(password))
        // Clear password error if generated
        if (errors.password) setErrors({ ...errors, password: '' })
    }

    const handlePasswordChange = (password: string) => {
        setFormData({ ...formData, password })
        setPasswordStrength(calculatePasswordStrength(password))
        if (errors.password) setErrors({ ...errors, password: '' })
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        // Validation logic
        const newErrors: Partial<Record<keyof PasswordFormData, string>> = {}
        let isValid = true

        if (!formData.account.trim()) {
            newErrors.account = 'Account Name cannot be empty'
            isValid = false
        }

        if (!formData.group) {
            newErrors.group = 'Group must be selected'
            isValid = false
        }

        // Password is now optional, removed validation check

        setErrors(newErrors)

        if (isValid) {
            onSave({
                ...formData,
                securityDetails: `Q: ${formData.securityQuestion}\nA: ${formData.securityAnswer}`
            })
            handleClose()
        }
    }

    const handleClose = () => {
        setFormData({
            account: '',
            group: '',
            username: '',
            email: '',
            password: '',
            phoneNumber: '',
            securityQuestion: '',
            securityAnswer: '',
            securityDetails: ''
        })
        setPasswordStrength(0)
        setErrors({})
        setShowPassword(false)
        setShowSecurityAnswer(false)
        onClose()
    }

    const getStrengthColor = () => {
        if (passwordStrength < 40) return 'bg-red-500'
        if (passwordStrength < 70) return 'bg-yellow-500'
        return 'bg-green-500'
    }

    const getStrengthWidth = () => {
        return `${passwordStrength}%`
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className={`relative w-full max-w-2xl mx-4 rounded-2xl shadow-2xl ${isDark ? 'bg-[#1a1f2e]' : 'bg-white'
                }`}>
                {/* Header */}
                <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'
                    }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                {editMode ? 'Edit Account' : 'Add New Account'}
                            </h2>
                            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                Securely store your credentials in the encrypted vault.
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className={`p-2 rounded-lg transition-colors ${isDark
                                ? 'hover:bg-gray-800 text-gray-400'
                                : 'hover:bg-gray-100 text-gray-600'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-6" autoComplete="off">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Account Name */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                Account Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={formData.account}
                                    onChange={(e) => {
                                        setFormData({ ...formData, account: e.target.value })
                                        if (errors.account) setErrors({ ...errors, account: '' })
                                    }}
                                    placeholder="e.g. Netflix, GitHub, Work VPN"
                                    autoComplete="off"
                                    name="swiftvault_account_name"
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors ${errors.account
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : isDark
                                            ? 'bg-[#0f1419] border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                                        } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                                />
                            </div>
                            {errors.account && (
                                <p className="text-xs text-red-500 mt-1">{errors.account}</p>
                            )}
                        </div>

                        {/* Group */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                Group <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.group}
                                onChange={(e) => {
                                    setFormData({ ...formData, group: e.target.value })
                                    if (errors.group) setErrors({ ...errors, group: '' })
                                }}
                                className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${errors.group
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : isDark
                                        ? 'bg-[#0f1419] border-gray-700 text-white focus:border-blue-500'
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                    } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                            >
                                <option value="">Select a group</option>
                                {groups.map(group => (
                                    <option key={group.id} value={group.id}>{group.label}</option>
                                ))}
                            </select>
                            {errors.group && (
                                <p className="text-xs text-red-500 mt-1">{errors.group}</p>
                            )}
                        </div>

                        {/* Username */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="johndoe_dev"
                                    autoComplete="off"
                                    name="swiftvault_username"
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors ${isDark
                                        ? 'bg-[#0f1419] border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@example.com"
                                    autoComplete="off"
                                    name="swiftvault_email_field"
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors ${isDark
                                        ? 'bg-[#0f1419] border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                    placeholder="Enter password"
                                    autoComplete="new-password"
                                    name="swiftvault_new_password_field"
                                    className={`w-full pl-10 pr-20 py-2.5 rounded-lg border transition-colors ${errors.password
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : isDark
                                            ? 'bg-[#0f1419] border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                                        } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1">
                                    <button
                                        type="button"
                                        onClick={generatePassword}
                                        className="text-blue-500 hover:text-blue-600 text-xs font-medium"
                                    >
                                        Generate
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={`p-1 rounded ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                                            }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            {showPassword ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            )}
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className={`h-1 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                        <div
                                            className={`h-full rounded-full transition-all ${getStrengthColor()}`}
                                            style={{ width: getStrengthWidth() }}
                                        />
                                    </div>
                                </div>
                            )}
                            {errors.password && (
                                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                Phone Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    placeholder="+1 (555) 000-0000"
                                    autoComplete="off"
                                    name="swiftvault_phone"
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors ${isDark
                                        ? 'bg-[#0f1419] border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                                />
                            </div>
                        </div>

                        {/* Security Question */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                Security Question
                            </label>
                            <input
                                type="text"
                                value={formData.securityQuestion}
                                onChange={(e) => setFormData({ ...formData, securityQuestion: e.target.value })}
                                placeholder="Mother's maiden name?"
                                autoComplete="off"
                                name="swiftvault_sec_q"
                                className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${isDark
                                    ? 'bg-[#0f1419] border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                            />
                        </div>

                        {/* Security Answer */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                Security Answer
                            </label>
                            <div className="relative">
                                <input
                                    type={showSecurityAnswer ? 'text' : 'password'}
                                    value={formData.securityAnswer}
                                    onChange={(e) => setFormData({ ...formData, securityAnswer: e.target.value })}
                                    placeholder="Enter answer"
                                    autoComplete="off"
                                    name="swiftvault_sec_a"
                                    className={`w-full px-4 py-2.5 pr-10 rounded-lg border transition-colors ${isDark
                                        ? 'bg-[#0f1419] border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSecurityAnswer(!showSecurityAnswer)}
                                    className={`absolute inset-y-0 right-0 pr-3 flex items-center ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                                        }`}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {showSecurityAnswer ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={`flex justify-end gap-3 mt-6 pt-6 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'
                        }`}>
                        <button
                            type="button"
                            onClick={handleClose}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDark
                                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            {editMode ? 'Update Account' : 'Save to Vault'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddPasswordModal
