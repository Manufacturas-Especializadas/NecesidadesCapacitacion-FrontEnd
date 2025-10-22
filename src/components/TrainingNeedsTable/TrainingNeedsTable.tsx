import { useEffect, useState } from "react";
import type { TrainingNeed } from "../../interfaces/TrainingNeed"
import { TableHeader } from "./TableHeader/TableHeader";
import { TableRow } from "./TableRow/TableRow";
import { trainingNeedService } from "../../api/services/TrainingNeedService";

interface Props {
    reloadTrigger?: number;
}

export const TrainingNeedsTable = ({ reloadTrigger }: Props) => {
    const [data, setData] = useState<TrainingNeed[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTrainingNeeds = async () => {
        setLoading(true);
        try {
            const response = await trainingNeedService.getTrainingNeeds();
            setData(response);
        } catch (error: any) {
            console.error("Error al cargar necesidades", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTrainingNeeds();
    }, []);

    useEffect(() => {
        loadTrainingNeeds();
    }, [reloadTrigger]);

    return (
        <>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {
                    loading ? (
                        <div className="py-12 text-center text-gray-500 animate-pulse">
                            Cargando dato...
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px] border-collapse">
                                <TableHeader />
                                <tbody className="divide-y divide-gray-100">
                                    {
                                        data.length > 0 ? (
                                            data.map((item) => <TableRow key={item.id} item={item} />)
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="py-8 text-center text-gray-400 italic"
                                                >
                                                    No hay registros disponibles
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    )
                }
            </div>
        </>
    )
}
