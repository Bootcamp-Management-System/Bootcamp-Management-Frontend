import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

export const DataTable = ({ columns, data, actions = [], searchPlaceholder = 'Search...' }) => {
  const [query, setQuery] = useState('');

  const filteredData = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return data;
    return data.filter((row) => JSON.stringify(row).toLowerCase().includes(normalized));
  }, [data, query]);

  const hasActions = actions.length > 0;

  return (
    <div className="bg-portal-card border border-portal-border rounded-3xl overflow-hidden shadow-xl">
      <div className="p-6 border-b border-portal-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">Records</h3>
          <p className="text-xs text-portal-text-muted">{filteredData.length} result(s)</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-portal-input border border-portal-border rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-portal-text-muted outline-none focus:border-portal-accent transition-colors"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-portal-input/40">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="text-left text-[10px] font-bold uppercase tracking-widest text-portal-text-muted px-6 py-4">
                  {col.header}
                </th>
              ))}
              {hasActions && (
                <th className="text-right text-[10px] font-bold uppercase tracking-widest text-portal-text-muted px-6 py-4">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-portal-border/50">
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="px-6 py-10 text-center text-sm text-portal-text-muted"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              filteredData.map((row, rowIndex) => (
                <tr key={row.id ?? rowIndex} className="hover:bg-portal-input/30 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 align-middle">
                      {col.render(row)}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center justify-end gap-2">
                        {actions.map((action, actionIndex) => {
                          const Icon = action.icon;
                          return (
                            <button
                              key={actionIndex}
                              onClick={() => action.onClick(row)}
                              className={`px-3 py-2 rounded-xl text-xs font-bold text-portal-text-muted hover:text-white hover:bg-portal-border/40 transition-colors ${action.className || ''}`}
                              type="button"
                            >
                              <span className="inline-flex items-center gap-2">
                                {Icon && <Icon className="w-3.5 h-3.5" />}
                                {action.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
