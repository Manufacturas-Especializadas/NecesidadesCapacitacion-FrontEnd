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
        registrationDate: string
        priority: number;
        category: number;
        providerUser: string;
    };
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
                <td className="px-4 py-3 text-sm font-semibold text-blue-600 max-w-xs break-words">
                    {item.suggestedTrainingCourse}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs break-words">
                    {item.qualityObjective}
                </td>
                <td className="px-4 py-3 text-sm text-green-700 font-semibold max-w-xs break-words">
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
            </tr>
        </>
    )
}