// The site mark: a zero crossed by crosswalk stripes. The favicon uses the same drawing.
export default function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="11.5" fill="none" stroke="currentColor" strokeWidth="4" />
      <rect x="11" y="9" width="2.6" height="14" fill="currentColor" />
      <rect x="15" y="9" width="2.6" height="14" fill="currentColor" />
      <rect x="19" y="9" width="2.6" height="14" fill="currentColor" />
    </svg>
  );
}
