export default function Stars({ count, size = 'md' }) {
  const starCount = count > 10 ? 3 : count === 10 ? 1 : 0

  return (
    <div className={`stars stars-${size}`} aria-label={`${count} points`}>
      {Array.from({ length: starCount }).map((_, i) => (
        <span key={i} className="star star-filled">★</span>
      ))}
      {starCount === 0 && <span className="star star-empty">☆</span>}
    </div>
  )
}
