import DataTable, { type TableColumn, type TableStyles } from "react-data-table-component";
import { BiPencil, BiTrash, BiShow, BiLoaderAlt } from "react-icons/bi";

interface Props<T extends { id?: number | string }> {
    columns: TableColumn<T>[];
    data: T[];
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    onView?: (row: T) => void;
    onRowClicked?: (row: T) => void;
    title?: string;
    loading?: boolean;
    pagination?: boolean;
    selectableRows?: boolean;
    actionLoading?: number | string | null;
}

const CustomLoader = () => (
    <div className="py-16 flex flex-col items-center justify-center text-gray-500">
        <BiLoaderAlt className="w-8 h-8 animate-spin mb-3" />
        <p className="font-medium">Cargando datos...</p>
    </div>
);

const paginationOptions = {
    rowsPerPageText: 'Filas por página:',
    rangeSeparatorText: 'de',
};


export const Table = <T extends { id?: number | string }>({
    columns,
    data,
    onEdit,
    onDelete,
    onView,
    title,
    loading = false,
    pagination = true,
    selectableRows = false,
    onRowClicked,
    actionLoading,
}: Props<T>) => {
    const getRowId = (row: T): number | string | undefined => {
        return row.id !== undefined ? row.id : undefined;
    };

    const actionColumn: TableColumn<T> | null = onEdit || onDelete || onView
        ? {
            name: "Acciones",
            cell: (row: T) => {
                const rowId = getRowId(row);

                return (
                    <div className="flex gap-1">
                        {onView && (
                            <ActionButton
                                icon={BiShow}
                                title="Detalles"
                                color="blue"
                                onClick={() => onView(row)}
                                loading={actionLoading === rowId}
                                disabled={actionLoading !== null && actionLoading !== rowId}
                            />
                        )}
                        {onEdit && (
                            <ActionButton
                                icon={BiPencil}
                                title="Editar"
                                color="orange"
                                onClick={() => onEdit(row)}
                                loading={actionLoading === rowId}
                                disabled={actionLoading !== null && actionLoading !== rowId}
                            />
                        )}
                        {onDelete && (
                            <ActionButton
                                icon={BiTrash}
                                title="Eliminar"
                                color="red"
                                onClick={() => onDelete(row)}
                                loading={actionLoading === rowId}
                                disabled={actionLoading !== null && actionLoading !== rowId}
                            />
                        )}
                    </div>
                );
            },
            ignoreRowClick: true,
            width: "140px",
            center: true,
        }
        : null;

    const finalColumns = actionColumn ? [...columns, actionColumn] : columns;

    const customStyles: TableStyles = {
        headCells: {
            style: {
                backgroundColor: "#0071ab",
                color: "white",
                fontWeight: "bold",
                fontSize: "12px",
                letterSpacing: "0.5px",
                textTransform: "uppercase" as const,
                padding: "12px",
            },
        },
        cells: {
            style: {
                padding: "12px",
                fontSize: "14px",
                color: "#374151",
            }
        },
        rows: {
            style: {
                minHeight: "52px",
                transition: "background-color 0.2s ease",
                "&:nth-child(odd)": {
                    backgroundColor: "#ffffff",
                },
                "&:nth-child(even)": {
                    backgroundColor: "rgba(0, 164, 228, 0.05)",
                },
            },
            highlightOnHoverStyle: {
                backgroundColor: "rgba(0, 142, 212, 0.1)",
                cursor: onRowClicked ? "pointer" : "default",
            },
        },
        pagination: {
            style: {
                borderTop: "1px solid #e5e7eb",
                padding: "8px 0",
            }
        }
    };


    return (
        <div className="space-y-4">
            {title && (
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {title}
                </h3>
            )}

            <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <DataTable columns={finalColumns}
                    data={data}
                    customStyles={customStyles}
                    progressPending={loading}
                    progressComponent={<CustomLoader />}
                    pagination={pagination}
                    paginationComponentOptions={paginationOptions}
                    selectableRows={selectableRows}
                    onRowClicked={onRowClicked}
                    pointerOnHover={!!onRowClicked}
                    noDataComponent={
                        <div className="py-12 text-center text-gray-500 text-sm">
                            No hay datos disponibles
                        </div>
                    }
                    responsive
                />
            </div>
        </div>
    );
};

const ActionButton = ({
    title,
    icon: Icon,
    color,
    onClick,
    loading,
    disabled,
}: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    color: "blue" | "orange" | "red";
    onClick: () => void;
    loading: boolean | undefined;
    disabled: boolean;
}) => {
    const colors = {
        blue: "text-blue-600 hover:bg-blue-100",
        orange: "text-orange-600 hover:bg-orange-100",
        red: "text-red-600 hover:bg-red-100",
    };

    const baseClasses = "p-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 flex items-center justify-center";

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseClasses} ${colors[color]} ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""} hover:cursor-pointer`}
            aria-label={title}
            title={title}
        >
            {loading ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <Icon className="h-4 w-4" />
            )}
        </button>
    );
};

export type { Props };