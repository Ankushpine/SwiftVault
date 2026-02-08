import { useState, useEffect } from 'react'

interface AddGroupModalProps {
    isDark: boolean
    isOpen: boolean
    initialName?: string
    onClose: () => void
    onSave: (name: string) => void
}

const AddGroupModal = ({ isDark, isOpen, initialName = '', onClose, onSave }: AddGroupModalProps) => {
    const [name, setName] = useState('')
    const [error, setError] = useState('')

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setName(initialName)
            setError('')
        }
    }, [isOpen, initialName])

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) {
            setError('Group name cannot be empty')
            return
        }
        onSave(name.trim())
        onClose()
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
                        {initialName ? 'Edit Group' : 'Create New Group'}
                    </h2>
                    <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Organize your passwords with a new group.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            Group Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                                if (error) setError('')
                            }}
                            placeholder="e.g., Gaming, Shopping"
                            className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${error
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : isDark
                                    ? 'bg-[#0f1419] border-gray-700 text-white placeholder-gray-500'
                                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                                }`}
                            autoFocus
                        />
                        {error && (
                            <p className="mt-1 text-xs text-red-500">{error}</p>
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
                            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/30"
                        >
                            {initialName ? 'Save Changes' : 'Create Group'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddGroupModal
