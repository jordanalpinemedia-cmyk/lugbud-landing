/**
 * Off-screen decoy input. Bots that fill every field in a form will populate
 * it; the server discards any submission that carries a value.
 *
 * Positioned off-screen rather than `display: none` — some form-fillers skip
 * fields that are not rendered at all. `aria-hidden` plus `tabIndex={-1}`
 * keeps it away from screen readers and keyboard navigation.
 */
export default function HoneypotField({ trapProps }) {
  return (
    <input
      {...trapProps}
      type="text"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: 1,
        height: 1,
        padding: 0,
        border: 0,
        overflow: 'hidden',
        clip: 'rect(0 0 0 0)',
        whiteSpace: 'nowrap',
        left: '-9999px',
      }}
    />
  );
}
