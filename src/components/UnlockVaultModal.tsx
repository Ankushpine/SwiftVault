import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-hot-toast'

interface UnlockVaultModalProps {
    isOpen: boolean
    isDark: boolean
}

const UnlockVaultModal = ({ isOpen, isDark }: UnlockVaultModalProps) => {
    const [password, setPassword] = useState('')
    const { setMasterPassword } = useAuth()

    if (!isOpen) return null

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault()
        if (password.trim().length === 0) {
            toast.error('Please enter your master password')
            return
        }
        setMasterPassword(password)
        toast.success('Vault unlocked')
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden ${isDark ? 'bg-[#1a1f2e] border border-gray-700' : 'bg-white'
                }`}>
                <div className="p-6">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 text-2xl">
                            🔐
                        </div>
                        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Unlock Your Vault
                        </h2>
                        <p className={`text-sm mt-2 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Your session is active, but your vault is locked. Please enter your master password to continue.
                        </p>
                    </div>

                    <form onSubmit={handleUnlock} className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                Master Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isDark
                                        ? 'bg-[#0a0e14] border-gray-700 text-white placeholder-gray-500'
                                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                                    }`}
                                placeholder="Enter master password"
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:ring-4 focus:ring-blue-500/20"
                        >
                            Unlock Vault
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UnlockVaultModal
