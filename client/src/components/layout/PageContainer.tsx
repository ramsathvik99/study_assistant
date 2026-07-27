import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
}

/**
 * Standard page container
 * 
 * EXACT SPECIFICATIONS:
 * - max-width: 1400px (88rem)
 * - margin: auto (centered)
 * - padding-left: 32px (8)
 * - padding-right: 32px (8)
 * - padding-top: 40px (10)
 * - padding-bottom: 40px (10)
 * 
 * EVERY page must use these exact values
 */
export const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 py-10">
      {children}
    </div>
  );
};

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

/**
 * Standard page header
 * 
 * SPECIFICATIONS:
 * - Title: text-h1 (32px)
 * - Subtitle: text-body (15px)
 * - Spacing: mb-8 (32px below)
 * - Always same layout
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-h1 font-display text-slate-900 dark:text-white mb-2">{title}</h1>
          {subtitle && (
            <p className="text-body text-slate-600 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
};

interface SectionHeaderProps {
  title: string;
  action?: React.ReactNode;
}

/**
 * Standard section header within pages
 * 
 * SPECIFICATIONS:
 * - Title: text-h2 (24px)
 * - Spacing: mb-6 (24px below)
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  action,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-h2 font-display text-slate-900 dark:text-white">{title}</h2>
      {action && <div>{action}</div>}
    </div>
  );
};
