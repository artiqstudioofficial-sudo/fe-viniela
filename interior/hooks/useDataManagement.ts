
import { useState, useMemo, useEffect } from 'react';

// Define a generic type for the data management hook
export const useDataManagement = <T,>(
    data: T[],
    searchKeys: (keyof T)[],
    rowsPerPage = 5
) => {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);

    // Reset to page 1 when data source changes or query changes
    useEffect(() => {
        setPage(1);
    }, [query, data.length]);

    // Filtering Logic
    const filteredData = useMemo(() => {
        if (!query) return data;
        const lowerQuery = query.toLowerCase();
        
        return data.filter(item =>
            searchKeys.some(key => {
                const val = item[key];
                // Check if value is string or number and convert to string for comparison
                return val != null && String(val).toLowerCase().includes(lowerQuery);
            })
        );
    }, [data, query, searchKeys]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    
    // Ensure current page is valid
    const safePage = Math.min(Math.max(1, page), Math.max(1, totalPages));
    
    const paginatedData = useMemo(() => {
        const start = (safePage - 1) * rowsPerPage;
        return filteredData.slice(start, start + rowsPerPage);
    }, [filteredData, safePage, rowsPerPage]);

    return {
        query,
        setQuery,
        page: safePage,
        setPage,
        totalPages,
        paginatedData,
        filteredCount: filteredData.length,
        totalItems: data.length
    };
};
