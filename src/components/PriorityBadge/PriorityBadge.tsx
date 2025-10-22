interface Props {
    priority: number | string;
}

const PRIORITY_CONFIG = {
    1: { label: 'POCO URGENTE', className: ' bg-green-100 text-green-800 border-green-300' },
    2: { label: 'URGENTE', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    3: { label: 'MUY URGENTE', className: 'bg-red-100 text-red-800 border-red-300' },
};

const PRIORITY_MAP: { [key: string]: number } = {
    'POCO URGENTE': 1,
    'URGENTE': 2,
    'MUY URGENTE': 3
};

export const PriorityBadge = ({ priority }: Props) => {
    const numericPriorityId = typeof priority === 'string'
        ? PRIORITY_MAP[priority]
        : priority;

    const config = PRIORITY_CONFIG[numericPriorityId as keyof typeof PRIORITY_CONFIG] || {
        label: 'DESCONOCIDO',
        className: 'bg-gray-100 text-gray-800 border-gray-300',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
            {config.label}
        </span>
    );
};