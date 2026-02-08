interface StatsCardProps {
    isDark: boolean
    icon: React.ReactNode
    label: string
    value: string | number
    badge?: string
    badgeColor?: string
}

const StatsCard = ({ isDark, icon, label, value, badge, badgeColor }: StatsCardProps) => {
    return (
        <div className={`rounded-xl p-6 transition-colors ${isDark ? 'bg-[#1a1f2e]' : 'bg-white border border-gray-200'
            }`}>
            <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-600/20' : 'bg-blue-50'
                    }`}>
                    {icon}
                </div>
                {badge && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${badgeColor === 'green' ? 'bg-green-500/20 text-green-500' :
                            badgeColor === 'red' ? 'bg-red-500/20 text-red-500' :
                                'bg-blue-500/20 text-blue-500'
                        }`}>
                        {badge}
                    </span>
                )}
            </div>
            <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {label}
            </p>
            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {value}
            </p>
        </div>
    )
}

interface StatsCardsProps {
    isDark: boolean
    securityScore: number
    weakPasswords: number
    latestEntry: string
}

const StatsCards = ({ isDark, securityScore, weakPasswords, latestEntry }: StatsCardsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatsCard
                isDark={isDark}
                icon={
                    <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                }
                label="Group Security Score"
                value={`${securityScore}/100`}
            />

            <StatsCard
                isDark={isDark}
                icon={
                    <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                }
                label="Weak Passwords"
                value={weakPasswords}
                badge={weakPasswords === 0 ? 'ALL SECURE' : undefined}
                badgeColor={weakPasswords === 0 ? 'green' : 'red'}
            />

            <StatsCard
                isDark={isDark}
                icon={
                    <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                }
                label="Latest Entry"
                value={latestEntry}
            />
        </div>
    )
}

export default StatsCards
