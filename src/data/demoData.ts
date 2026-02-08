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

export const demoPasswords: Password[] = [
    {
        id: '1',
        account: 'Figma',
        username: 'pine_designer',
        email: 'design@ankush.com',
        password: 'SecurePass123!',
        phoneNumber: 'Not Linked',
        securityDetails: 'Q: Childhood hero?\n******',
        group: 'Work',
        isFavorite: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
    },
    {
        id: '2',
        account: 'Slack',
        username: 'ankush_p',
        email: 'work.ankush@corp.com',
        password: 'WorkSlack@2024',
        phoneNumber: '9876543210',
        securityDetails: 'Q: Office location?\n******',
        group: 'Work',
        isFavorite: false,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-25')
    },
    {
        id: '3',
        account: 'GitHub',
        username: 'ankush_dev',
        email: 'dev@ankush.com',
        password: 'GitSecure#456',
        phoneNumber: '9876543210',
        securityDetails: 'Q: First repository?\n******',
        group: 'Work',
        isFavorite: true,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-18')
    },
    {
        id: '4',
        account: 'Netflix',
        username: 'ankush_personal',
        email: 'personal@ankush.com',
        password: 'Netflix@Home99',
        phoneNumber: '9123456789',
        securityDetails: 'Q: Favorite show?\n******',
        group: 'Personal',
        isFavorite: false,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-22')
    },
    {
        id: '5',
        account: 'Amazon',
        username: 'ankush_shopper',
        email: 'shopping@ankush.com',
        password: 'AmazonPrime#2024',
        phoneNumber: '9123456789',
        securityDetails: 'Q: First purchase?\n******',
        group: 'Personal',
        isFavorite: false,
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-19')
    },
    {
        id: '6',
        account: 'Bank of America',
        username: 'ankush_banking',
        email: 'finance@ankush.com',
        password: 'BankSecure$789',
        phoneNumber: '9876543210',
        securityDetails: 'Q: Mother maiden name?\n******',
        group: 'Finance',
        isFavorite: true,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-28')
    },
    {
        id: '7',
        account: 'PayPal',
        username: 'ankush_payments',
        email: 'payments@ankush.com',
        password: 'PayPal@Secure123',
        phoneNumber: '9123456789',
        securityDetails: 'Q: Security question?\n******',
        group: 'Finance',
        isFavorite: false,
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-26')
    },
    {
        id: '8',
        account: 'Twitter',
        username: '@ankush_tweets',
        email: 'social@ankush.com',
        password: 'Twitter#Social99',
        phoneNumber: '9123456789',
        securityDetails: 'Q: First tweet?\n******',
        group: 'Social',
        isFavorite: false,
        createdAt: new Date('2024-01-11'),
        updatedAt: new Date('2024-01-24')
    },
    {
        id: '9',
        account: 'LinkedIn',
        username: 'ankush_professional',
        email: 'work@ankush.com',
        password: 'LinkedIn@Pro2024',
        phoneNumber: '9876543210',
        securityDetails: 'Q: Current company?\n******',
        group: 'Work',
        isFavorite: true,
        createdAt: new Date('2024-01-07'),
        updatedAt: new Date('2024-01-21')
    },
    {
        id: '10',
        account: 'Spotify',
        username: 'ankush_music',
        email: 'music@ankush.com',
        password: 'SpotifyMusic#123',
        phoneNumber: 'Not Linked',
        securityDetails: 'Q: Favorite artist?\n******',
        group: 'Personal',
        isFavorite: false,
        createdAt: new Date('2024-01-09'),
        updatedAt: new Date('2024-01-23')
    }
]

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
