import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Mail, Route, FileText, PenTool, Archive, BarChart, Settings, ChevronDown, ChevronRight } from 'lucide-react';

const menuGroups = [
  {
    key: 'dashboard',
    icon: LayoutDashboard,
    labelKey: 'nav.dashboard',
    path: '/',
    children: [],
  },
  {
    key: 'letters',
    icon: Mail,
    labelKey: 'nav.letters',
    children: [
      { path: '/letters/incoming', labelKey: 'menu.incoming' },
      { path: '/letters/outgoing', labelKey: 'menu.outgoing' },
      { path: '/letters/internal', labelKey: 'menu.internal' },
      { path: '/letters/pending', labelKey: 'menu.pending' },
      { path: '/letters/search', labelKey: 'menu.search' },
    ],
  },
  {
    key: 'routing',
    icon: Route,
    labelKey: 'nav.routing',
    children: [
      { path: '/routing/inbox', labelKey: 'menu.inbox' },
      { path: '/routing/history', labelKey: 'menu.routingHistory' },
      { path: '/routing/overdue', labelKey: 'menu.overdue' },
    ],
  },
  {
    key: 'templates',
    icon: FileText,
    labelKey: 'nav.templates',
    children: [
      { path: '/templates/types', labelKey: 'menu.letterTypes' },
      { path: '/templates/list', labelKey: 'menu.templateList' },
      { path: '/templates/preview', labelKey: 'menu.templatePreview' },
    ],
  },
  {
    key: 'signatures',
    icon: PenTool,
    labelKey: 'nav.signatures',
    children: [
      { path: '/signatures/pending', labelKey: 'menu.pendingSignatures' },
      { path: '/signatures/history', labelKey: 'menu.signedHistory' },
      { path: '/signatures/certificates', labelKey: 'menu.certificates' },
    ],
  },
  {
    key: 'archive',
    icon: Archive,
    labelKey: 'nav.archive',
    children: [
      { path: '/archive/letters', labelKey: 'menu.archivedLetters' },
      { path: '/archive/policies', labelKey: 'menu.retentionPolicies' },
    ],
  },
  {
    key: 'reports',
    icon: BarChart,
    labelKey: 'nav.reports',
    children: [
      { path: '/reports/pendency', labelKey: 'menu.pendencyReport' },
      { path: '/reports/volume', labelKey: 'menu.volumeReport' },
      { path: '/reports/export', labelKey: 'menu.exportCenter' },
    ],
  },
  {
    key: 'admin',
    icon: Settings,
    labelKey: 'nav.admin',
    children: [
      { path: '/admin/users', labelKey: 'menu.users' },
      { path: '/admin/roles', labelKey: 'menu.roles' },
      { path: '/admin/offices', labelKey: 'menu.offices' },
      { path: '/admin/languages', labelKey: 'menu.languages' },
      { path: '/admin/audit-logs', labelKey: 'menu.auditLogs' },
      { path: '/admin/settings', labelKey: 'menu.systemSettings' },
    ],
  },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">LTMS</div>
      <nav className="sidebar-nav">
        {menuGroups.map((group) => {
          const Icon = group.icon;
          const hasChildren = group.children.length > 0;
          const isOpen = openKey === group.key;

          if (!hasChildren) {
            return (
              <NavLink key={group.key} to={group.path!} end
                className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                <Icon size={18} />
                <span>{t(group.labelKey)}</span>
              </NavLink>
            );
          }

          return (
            <div key={group.key} className="sidebar-group">
              <button className="sidebar-link sidebar-group-toggle"
                onClick={() => setOpenKey(isOpen ? null : group.key)}>
                <Icon size={18} />
                <span>{t(group.labelKey)}</span>
                {isOpen ? <ChevronDown size={16} style={{ marginLeft: 'auto' }} /> : <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
              </button>
              {isOpen && (
                <div className="sidebar-submenu">
                  {group.children.map((child) => (
                    <NavLink key={child.path} to={child.path} end
                      className={({ isActive }) => isActive ? 'sidebar-sublink active' : 'sidebar-sublink'}>
                      {t(child.labelKey)}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}