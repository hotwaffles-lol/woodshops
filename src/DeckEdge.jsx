// A standard deck is seven plies of maple; some shops dye a few veneers for a striped edge.
// Adjacent maple plies alternate grain tone so each veneer reads separately.
const PLIES = ["maple", "dye-red", "maple-dark", "dye-black", "maple", "dye-blue", "maple-dark"];

/** Decorative, abstract edge-on view of a seven-ply deck. */
export default function DeckEdge() {
  return (
    <div className="deck-edge" aria-hidden="true">
      {PLIES.map((ply, i) => (
        <span key={i} className={`ply ply-${ply}`} style={{ "--i": i }} />
      ))}
    </div>
  );
}
