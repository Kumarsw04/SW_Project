import { useState } from 'react';
import {
  Activity,
  ArrowRight,
  BatteryCharging,
  Bell,
  BellRing,
  Bot,
  Building,
  Cable,
  Car,
  CloudSun,
  Crown,
  Database,
  FileChartColumn,
  Flame,
  Gauge,
  Gift,
  HandCoins,
  HeartPulse,
  Houses,
  Leaf,
  Lightbulb,
  ListChecks,
  Lock,
  Map,
  MapPin,
  Network,
  PiggyBank,
  PlugZap,
  Receipt,
  Settings,
  Sparkles,
  Sun,
  TrendingUp,
  User,
  Users,
  Wallet,
  Wrench,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import './Sidebar.css';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface SidebarNavItem {
  /** Stable id, also used as React key. */
  id: string;
  label: string;
  icon: LucideIcon;
  /** Route the item points to. */
  path: string;
  /** Numeric badge (e.g. the Alerts count). */
  count?: number;
  /** Access-status label shown on add-ons ("Soon", "Pro", "Phase 2", ...). */
  status?: string;
  /** Restricted items are muted and cannot be navigated. */
  locked?: boolean;
}

export interface SidebarSection {
  id: string;
  label: string;
  items: SidebarNavItem[];
}

export interface SidebarProps {
  /** Currently selected route. Falls back to internal state ("/today"). */
  activePath?: string;
  /** Called with the item path whenever an available item is clicked. */
  onNavigate?: (path: string) => void;
  /** Optional location line rendered under the brand. */
  locationName?: string;
  /** Extra class names for the root element. */
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Navigation data                                                     */
/* ------------------------------------------------------------------ */

export const DEFAULT_ACTIVE_PATH = '/today';

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      { id: 'today', label: 'Today', icon: Sun, path: '/today' },
      { id: 'society-map', label: 'Society map', icon: Map, path: '/society-map' },
      { id: 'wiring-risers', label: 'Wiring & risers', icon: Cable, path: '/wiring-risers' },
    ],
  },
  {
    id: 'flats-billing',
    label: 'Flats & billing',
    items: [
      {
        id: 'flats-statements',
        label: 'Flats & statements',
        icon: Receipt,
        path: '/flats-statements',
      },
      { id: 'flat-details', label: 'Flat details', icon: Building, path: '/flat-details' },
    ],
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    items: [
      { id: 'alerts', label: 'Alerts', icon: Bell, path: '/alerts'},
      { id: 'actions', label: 'Actions', icon: ListChecks, path: '/actions' },
      {
        id: 'power-cuts-uptime',
        label: 'Power cuts & uptime',
        icon: PlugZap,
        path: '/power-cuts-uptime',
      },
      { id: 'voltage-quality', label: 'Voltage quality', icon: Gauge, path: '/voltage-quality' },
      { id: 'meter-health', label: 'Meter health', icon: HeartPulse, path: '/meter-health' },
    ],
  },
  {
    id: 'cost-savings',
    label: 'Cost & savings',
    items: [
      { id: 'electricity-cost', label: 'Electricity cost', icon: Wallet, path: '/electricity-cost' },
      { id: 'load-pattern', label: 'Load pattern', icon: TrendingUp, path: '/load-pattern' },
      { id: 'savings', label: 'Savings', icon: PiggyBank, path: '/savings' },
    ],
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    items: [
      { id: 'energy-waste', label: 'Energy waste', icon: Flame, path: '/energy-waste' },
      {
        id: 'equipment-health',
        label: 'Equipment health',
        icon: Wrench,
        path: '/equipment-health',
      },
      { id: 'alert-rules', label: 'Alert rules', icon: BellRing, path: '/alert-rules' },
      { id: 'copilot', label: 'Copilot', icon: Bot, path: '/copilot' },
    ],
  },
  {
    id: 'administration',
    label: 'Administration',
    items: [
      { id: 'reports', label: 'Reports', icon: FileChartColumn, path: '/reports' },
      { id: 'users-access', label: 'Users & access', icon: Users, path: '/users-access' },
      { id: 'my-profile', label: 'My profile', icon: User, path: '/my-profile' },
      { id: 'site-setup', label: 'Site setup', icon: Settings, path: '/site-setup' },
      { id: 'data-quality', label: 'Data quality', icon: Database, path: '/data-quality' },
      { id: 'data-sources', label: 'Data sources', icon: Network, path: '/data-sources' },
    ],
  },
  {
    id: 'add-ons',
    label: 'Add-ons · Not in plan',
    items: [
      { id: 'multiple-societies', label: 'Multiple societies', icon: Houses, path: '/add-ons/multiple-societies', status: 'Soon', locked: true },
      { id: 'ev-charging', label: 'EV charging', icon: Car, path: '/add-ons/ev-charging', status: 'Soon', locked: true },
      { id: 'power-quality', label: 'Power quality', icon: Activity, path: '/add-ons/power-quality', status: 'Soon', locked: true },
      { id: 'solar-batteries', label: 'Solar & batteries', icon: BatteryCharging, path: '/add-ons/solar-batteries', status: 'Soon', locked: true },
      { id: 'tenant-billing', label: 'Tenant billing', icon: HandCoins, path: '/add-ons/tenant-billing', status: 'Pro', locked: true },
      { id: 'forecasts', label: 'Forecasts', icon: CloudSun, path: '/add-ons/forecasts', status: 'Phase 2', locked: true },
      { id: 'appliance-insights', label: 'Appliance insights', icon: Lightbulb, path: '/add-ons/appliance-insights', status: 'Phase 3', locked: true },
      { id: 'resident-rewards', label: 'Resident rewards', icon: Gift, path: '/add-ons/resident-rewards', status: 'Phase 2', locked: true },
      { id: 'carbon-report', label: 'Carbon report', icon: Leaf, path: '/add-ons/carbon-report', status: 'Later', locked: true },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function Sidebar({
  activePath,
  onNavigate,
  locationName,
  className,
}: SidebarProps) {
  const [internalActivePath, setInternalActivePath] =
    useState<string>(DEFAULT_ACTIVE_PATH);
  const currentPath = activePath ?? internalActivePath;

  const handleSelect = (path: string) => {
    setInternalActivePath(path);
    onNavigate?.(path);
  };

  return (
    <aside
      className={['sidebar', className].filter(Boolean).join(' ')}
      aria-label="SWYTCHO primary navigation"
    >
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark" aria-hidden="true">
            <Zap size={15} strokeWidth={2.4} fill="currentColor" />
          </span>
          <span className="sidebar-brand-name">SWYTCHO</span>
        </div>
        {locationName ? (
          <p className="sidebar-location">
            <MapPin size={11} strokeWidth={2} aria-hidden="true" />
            <span className="sidebar-location-name">{locationName}</span>
          </p>
        ) : null}
      </div>

      <nav className="sidebar-scroll" aria-label="Sections">
        {SIDEBAR_SECTIONS.map((section) => (
          <div className="sidebar-section" key={section.id}>
            <h2 className="sidebar-section-label">{section.label}</h2>
            <ul className="sidebar-list">
              {section.items.map((item) => {
                const isActive = !item.locked && item.path === currentPath;
                const Icon = item.icon;
                const linkClassName = [
                  'sidebar-link',
                  isActive ? 'sidebar-link--active' : '',
                  item.locked ? 'sidebar-link--locked' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                const inner = (
                  <>
                    <Icon className="sidebar-link-icon" size={15} strokeWidth={1.9} aria-hidden="true" />
                    <span className="sidebar-link-label">{item.label}</span>
                    {typeof item.count === 'number' ? (
                      <span className="sidebar-count" aria-label={`${item.count} open alerts`}>
                        {item.count}
                      </span>
                    ) : null}
                    {item.status ? (
                      <span
                        className={[
                          'sidebar-status',
                          item.status === 'Pro' ? 'sidebar-status--gold' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {item.status === 'Pro' ? (
                          <Sparkles size={9} strokeWidth={2.2} aria-hidden="true" />
                        ) : (
                          <Lock size={9} strokeWidth={2.2} aria-hidden="true" />
                        )}
                        <span className="sidebar-status-text">{item.status}</span>
                      </span>
                    ) : null}
                  </>
                );

                return (
                  <li key={item.id}>
                    {item.locked ? (
                      <span
                        className={linkClassName}
                        aria-disabled="true"
                        title={`${item.label} — not included in your plan`}
                      >
                        {inner}
                      </span>
                    ) : (
                      <button
                        type="button"
                        className={linkClassName}
                        title={item.label}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => handleSelect(item.path)}
                      >
                        {inner}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-upgrade">
          <span className="sidebar-upgrade-icon" aria-hidden="true">
            <Crown size={13} strokeWidth={2} />
          </span>
          <h2 className="sidebar-upgrade-title">Upgrade to Premium</h2>
          <p className="sidebar-upgrade-text">
            Unlock 3D view, advanced analytics and more.
          </p>
          <button
            type="button"
            className="sidebar-upgrade-button"
            onClick={() => onNavigate?.('/upgrade')}
          >
            <span className="sidebar-upgrade-button-label">Upgrade</span>
            <ArrowRight size={11} strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
