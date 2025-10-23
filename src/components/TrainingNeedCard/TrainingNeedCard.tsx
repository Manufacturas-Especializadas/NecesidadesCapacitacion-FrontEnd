import type { TrainingNeed } from "../../interfaces/TrainingNeed";

const PriorityBadge = ({ priority }: { priority: number }) => {
    const styles = {
        1: 'bg-green-100 text-green-800 border-green-300',
        2: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        3: 'bg-red-100 text-red-800 border-red-300',
    }[priority] || 'bg-gray-100 text-gray-800 border-gray-300';

    const text = { 1: 'POCO URGENTE', 2: 'URGENTE', 3: 'MUY URGENTE' }[priority] || 'N/A';

    return (
        <span className={`px-3 py-1 text-xs font-bold rounded-full border whitespace-nowrap ${styles}`}>
            {text}
        </span>
    );
};

const CategoryBadge = ({ category }: { category: number }) => {
    const text = {
        1: 'Seguridad',
        2: 'Calidad',
        3: 'Productividad',
        4: 'Normas y leyes',
        5: 'Finanzas',
        6: 'Liderazgo',
        7: 'Medio ambiente',
        9: 'Idiomas',
        10: 'Scrap',
        11: 'OTD',
        12: 'Tecnlogía'
    }[category] || 'General';

    return (
        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2.5 py-0.5 rounded-full">
            {text}
        </span>
    );
};

interface Props {
    item: TrainingNeed;
};

export const TrainingNeedCard = ({ item }: Props) => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border
            border-gray-200 flex flex-col">
            <div className="flex items-start justify-between p-4 border-b border-gray-200 bg-gray-50/70">
                <h3 className="text-lg font-semibold text-gray-800 pr-4" title={item.presentNeed}>
                    {item.presentNeed}
                </h3>
                <PriorityBadge priority={item.priority} />

                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Curso sugerido
                        </label>
                        <CategoryBadge category={item.category} />
                    </div>
                    <p className="text-gray-900 font-medium text-base">
                        {item.suggestedTrainingCourse || <span className="text-gray-400 italic">No asingando</span>}
                    </p>
                </div>

                <div className="p-4 space-y-4 flex-grow">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500 block">Colaboradores</label>
                            <p className="text-gray-700 text-sm">{item.positionsOrCollaborator}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500 block">Objetivo / KPI</label>
                            <p className="text-gray-700 text-sm">{item.qualityObjective}</p>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-500 block">Progreso de Desempeño</label>
                        <div className="flex flex-wrap items-center gap-2 text-gray-700 mt-1">
                            <span className="bg-gray-100 px-2 py-1 rounded text-sm font-medium">
                                Actual: <strong>{item.currentPerformance}</strong>
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                                Esperado: <strong>{item.expectedPerformance}</strong>
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-500 block">Proveedor Sugerido</label>
                        <p className="text-gray-700 text-sm">{item.providerUser || <span className="text-gray-400 italic">N/A</span>}</p>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    {/* <div>
                        <label className="text-xs font-medium text-gray-500 block">Registrado</label>
                        <p className="text-xs text-gray-600">{formattedDate}</p>
                    </div> */}
                    <button className="text-sm text-blue-600 hover:underline font-medium focus:outline-none">
                        Ver detalles
                    </button>
                </div>
            </div>
        </div>
    )
}
