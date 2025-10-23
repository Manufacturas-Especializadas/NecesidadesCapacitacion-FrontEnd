const getInitials = (name: string = "") => {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.slice(0, 2).toUpperCase();
};

const getAvatarColor = (name: string = "") => {
    let hash = 0;
    if (name.length === 0) return 'bg-gray-500';
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    const colors = [
        'bg-blue-600', 'bg-green-600', 'bg-red-600',
        'bg-purple-600', 'bg-indigo-600', 'bg-yellow-700', 'bg-pink-600'
    ];
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};

interface Props {
    name: string;
    className?: string;
}

export const Avatar = ({ name, className = '' }: Props) => {
    return (
        <div
            className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center 
                text-white font-semibold text-sm ${getAvatarColor(name)} ${className}`}
        >
            {getInitials(name)}
        </div>
    );
};