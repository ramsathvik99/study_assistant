import React from "react";

interface ContentGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 4 | 6 | 8;
  className?: string;
}

/**
 * Standard responsive grid system
 * 
 * GRID SPECIFICATIONS:
 * Desktop (lg): 12 columns
 * Laptop (md): 12 columns
 * Tablet (sm): 8 columns
 * Mobile: 4 columns
 * 
 * Common patterns:
 * - 4 columns: stats cards
 * - 3 columns: feature cards
 * - 2 columns: content sections
 * - 1 column: full width
 * 
 * Gap options: 16px (4), 24px (6), 32px (8)
 */
export const ContentGrid: React.FC<ContentGridProps> = ({
  children,
  columns = 1,
  gap = 6,
  className = "",
}) => {
  const getGridClasses = () => {
    const gapClass = `gap-${gap}`;
    
    switch (columns) {
      case 12:
        return `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-12 ${gapClass}`;
      case 6:
        return `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 ${gapClass}`;
      case 4:
        return `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${gapClass}`;
      case 3:
        return `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 ${gapClass}`;
      case 2:
        return `grid grid-cols-1 lg:grid-cols-2 ${gapClass}`;
      case 1:
      default:
        return `grid grid-cols-1 ${gapClass}`;
    }
  };

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {children}
    </div>
  );
};

interface GridItemProps {
  children: React.ReactNode;
  span?: 1 | 2 | 3 | 4 | 6 | 12;
  className?: string;
}

/**
 * Grid item with optional column span
 * Allows items to span multiple columns
 */
export const GridItem: React.FC<GridItemProps> = ({
  children,
  span = 1,
  className = "",
}) => {
  const getSpanClasses = () => {
    switch (span) {
      case 12:
        return "col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-6 2xl:col-span-12";
      case 6:
        return "col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-6";
      case 4:
        return "col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-4";
      case 3:
        return "col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3";
      case 2:
        return "col-span-1 lg:col-span-2";
      case 1:
      default:
        return "col-span-1";
    }
  };

  return (
    <div className={`${getSpanClasses()} ${className}`}>
      {children}
    </div>
  );
};
