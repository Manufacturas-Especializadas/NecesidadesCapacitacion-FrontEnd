import { useEffect, useState } from "react"
import type { TrainingNeed } from "../../interfaces/TrainingNeed"
import { trainingNeedService } from "../../api/services/TrainingNeedService";
import { TrainingNeedCard } from "../TrainingNeedCard/TrainingNeedCard";

interface Props {
    reloadTrigger?: number;
};

export const TrainingNeedsList = ({ reloadTrigger }: Props) => {
    const [data, setData] = useState<TrainingNeed[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTrainingNeeds = async () => {
        setLoading(true);
        try {
            const response = await trainingNeedService.getTrainingNeeds();
            setData(response);
        } catch (error: any) {
            console.error("Error al cargar necesidades: ", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTrainingNeeds();
    }, [reloadTrigger]);

    if (loading) {
        return (
            <div className="py-24 text-center text-gray-500 animate-pulse">
                Cargando necesidades...
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
            {
                data.map((item) => (
                    <TrainingNeedCard key={item.id} item={item} />
                ))
            }
        </div>
    )
}
