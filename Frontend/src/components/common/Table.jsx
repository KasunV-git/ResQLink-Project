import React from 'react';
import EmptyState from './EmptyState';

/**
 * Responsive Table Component
 * Renders a standard table on desktop and a stacked card layout on mobile.
 * 
 * @param {Array} columns - Array of objects: { key, label, render(item) }
 * @param {Array} data - Array of data objects
 * @param {Function} renderActions - Function returning action buttons for a row
 * @param {String} keyField - The unique identifier field in data (default: 'id')
 */
const Table = ({ columns, data, renderActions, keyField = 'id', emptyMessage = 'No records found' }) => {
  if (!data || data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="w-full">
      {/* Mobile Card View (visible only on small screens) */}
      <div className="block md:hidden space-y-4">
        {data.map((item) => (
          <div key={item[keyField]} className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex flex-col gap-3">
              {columns.map((col) => (
                <div key={col.key} className="flex justify-between items-start border-b border-border/50 pb-2 last:border-0 last:pb-0">
                  <span className="text-xs font-semibold uppercase text-foreground/50 tracking-wider">
                    {col.label}
                  </span>
                  <div className="text-sm font-medium text-foreground text-right pl-4">
                    {col.render ? col.render(item) : item[col.key]}
                  </div>
                </div>
              ))}
              {renderActions && (
                <div className="pt-3 mt-1 border-t border-border flex justify-end gap-2">
                  {renderActions(item)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View (hidden on small screens) */}
      <div className="hidden md:block w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-border/30 text-foreground/70 uppercase text-xs font-semibold border-b border-border">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-6 py-4">{col.label}</th>
                ))}
                {renderActions && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((item) => (
                <tr key={item[keyField]} className="hover:bg-border/20 transition-colors group">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-foreground/80 group-hover:text-foreground transition-colors">
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {renderActions(item)}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;
