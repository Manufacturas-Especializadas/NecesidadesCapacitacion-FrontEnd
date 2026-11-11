import { PriorityBadge } from "../../PriorityBadge/PriorityBadge";

interface Props {
    item: {
        id: number;
        presentNeed: string;
        positionsOrCollaborator: string;
        suggestedTrainingCourse: string;
        qualityObjective: string;
        currentPerformance: string;
        expectedPerformance: string;
        registrationDate: string | null;
        priority: number;
        category: number;
        providerUser: string;
        status: number;
    };
};

const formatRegistrationDate = (value: string | null | undefined): string => {
    if (!value) return "—";

    // Conservar la fecha calendario del ISO recibido, sin convertir la zona horaria.
    const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,7})?(?:Z|[+-](?:0\d|1[0-3]):[0-5]\d|[+-]14:00)?)?$/.exec(value.trim());
    if (!match) return "—";

    const [, year, month, day] = match;
    const yearNumber = Number(year);
    const monthNumber = Number(month);
    const dayNumber = Number(day);
    const leapYear = yearNumber % 4 === 0 && (yearNumber % 100 !== 0 || yearNumber % 400 === 0);
    const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (yearNumber < 1 || monthNumber < 1 || monthNumber > 12
        || dayNumber < 1 || dayNumber > daysInMonth[monthNumber - 1]) {
        return "—";
    }

    return `${day}/${month}/${year}`;
};

export const TableRow = ({ item }: Props) => {
    return (
        <>
            <tr className="hover:bg-blue-50/60 transition-colors duration-200">
                <td className="px-4 py-3 text-sm text-gray-800 font-medium max-w-xs break-words">
                    {item.presentNeed}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-xs break-words">
                    {item.positionsOrCollaborator}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-600 max-w-xs break-words">
                    {item.suggestedTrainingCourse}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs break-words">
                    {item.qualityObjective}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 font-semibold max-w-xs break-words">
                    {item.currentPerformance}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs break-words">
                    {item.expectedPerformance || <span className="text-gray-400 italic">N/A</span>}
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                    <PriorityBadge priority={item.priority} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs break-words">
                    {item.category}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs break-words">
                    {item.providerUser}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs break-words">
                    {item.status}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 text-left whitespace-nowrap">
                    {formatRegistrationDate(item.registrationDate)}
                </td>
            </tr>
        </>
    )
}