// Presentational device-bezel chrome for wide viewports — not part of the
// Knowunity design system (see globals.css). On an actual phone this
// renders inert; the overlay pieces are only shown via the min-width
// media query in globals.css, and aria-hidden since they're decorative
// duplicates of real OS chrome, never real status info.
export function DeviceFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="device-frame">
      {children}

      <div className="device-notch" aria-hidden="true" />
      <div className="device-statusbar" aria-hidden="true">
        <span className="device-statusbar-time">9:41</span>
        <span className="device-statusbar-icons">
          <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
            <rect x="0" y="6" width="3" height="4" rx="0.5" fill="currentColor" />
            <rect x="4.5" y="4" width="3" height="6" rx="0.5" fill="currentColor" />
            <rect x="9" y="2" width="3" height="8" rx="0.5" fill="currentColor" />
            <rect x="13.5" y="0" width="3" height="10" rx="0.5" fill="currentColor" />
          </svg>
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
            <path
              d="M7.5 10.5c.6 0 1-.5 1-1s-.5-1-1-1-1 .5-1 1 .4 1 1 1Z"
              fill="currentColor"
            />
            <path
              d="M4.3 7.3a4.5 4.5 0 0 1 6.4 0M2 4.9a7.7 7.7 0 0 1 11 0M0 2.6a10.8 10.8 0 0 1 15 0"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect
              x="0.75"
              y="0.75"
              width="20.5"
              height="10.5"
              rx="2.5"
              stroke="currentColor"
              strokeOpacity="0.5"
              strokeWidth="1"
            />
            <rect x="2.5" y="2.5" width="17" height="7" rx="1.5" fill="currentColor" />
            <rect
              x="22.5"
              y="4"
              width="1.8"
              height="4"
              rx="0.9"
              fill="currentColor"
              fillOpacity="0.5"
            />
          </svg>
        </span>
      </div>

      <div className="device-home-indicator" aria-hidden="true" />

      <span className="device-btn device-btn-mute" aria-hidden="true" />
      <span className="device-btn device-btn-vol-up" aria-hidden="true" />
      <span className="device-btn device-btn-vol-down" aria-hidden="true" />
      <span className="device-btn device-btn-power" aria-hidden="true" />
    </div>
  );
}
