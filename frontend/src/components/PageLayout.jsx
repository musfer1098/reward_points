import LeaderboardSidebar from './LeaderboardSidebar'

export default function PageLayout({ children }) {
  return (
    <div className="page-bg">
      <div className="page-layout">
        <main className="page-main">{children}</main>
        <LeaderboardSidebar />
      </div>
    </div>
  )
}
