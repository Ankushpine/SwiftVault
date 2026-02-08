// Demo password data for the vault
export interface Password {
    id: string
    account: string
    username: string
    email: string
    password: string
    phoneNumber: string
    securityDetails: string
    securityQuestion?: string
    securityAnswer?: string
    group: string
    groupLabel?: string
    isFavorite: boolean
    createdAt: Date
    updatedAt: Date
}

// Calculate password strength
export const calculatePasswordStrength = (password: string): number => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (password.length >= 12) strength += 25
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 12.5
    if (/[^a-zA-Z0-9]/.test(password)) strength += 12.5
    return Math.min(strength, 100)
}

// Get weak passwords count
export const getWeakPasswordsCount = (passwords: Password[]): number => {
    return passwords.filter(p => calculatePasswordStrength(p.password) < 50).length
}

// Get security score
export const getSecurityScore = (passwords: Password[]): number => {
    if (passwords.length === 0) return 0
    const totalStrength = passwords.reduce((sum, p) => sum + calculatePasswordStrength(p.password), 0)
    return Math.round(totalStrength / passwords.length)
}

// Get latest entry time
export const getLatestEntryTime = (passwords: Password[]): string => {
    if (passwords.length === 0) return 'Never'

    const latest = passwords.reduce((max, p) =>
        p.updatedAt > max.updatedAt ? p : max
        , passwords[0])

    const now = new Date()
    const diff = now.getTime() - latest.updatedAt.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return latest.updatedAt.toLocaleDateString()
}