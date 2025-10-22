
export const TableHeader = () => {
    return (
        <>
            <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10">
                <tr>
                    <th
                        scope="col"
                        className="px-4 py-3 text-xs md:text-sm font-semibold text-left tracking-wide">
                        Necesidad presente
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs md:text-sm font-semibold text-left tracking-wide">
                        Nombres y puestos del colaboraador a incluir
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs md:text-sm font-semibold text-left tracking-wide">
                        Curso / Entrenamieneto sugerdio
                    </th>
                    <th
                        scope="col"
                        className="px-4 py-3 text-xs md:text-sm font-semibold text-left tracking-wide"
                    >
                        Objetivo de calidad / KPI
                    </th>
                    <th
                        scope="col"
                        className="px-4 py-3 text-xs md:text-sm font-semibold text-left tracking-wide"
                    >
                        Desempeño actual
                    </th>
                    <th
                        scope="col"
                        className="px-4 py-3 text-xs md:text-sm font-semibold text-left tracking-wide"
                    >
                        Desempeño esperado
                    </th>
                    <th
                        scope="col"
                        className="px-4 py-3 text-xs md:text-sm font-semibold text-left tracking-wide"
                    >
                        Prioridad
                    </th>
                </tr>
            </thead>
        </>
    )
}
