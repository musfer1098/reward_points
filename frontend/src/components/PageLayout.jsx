import LeaderboardSidebar from './LeaderboardSidebar'

export default function PageLayout({ children, hideSidebar = false }) {
  return (
    <div className="page-bg">
      <div className={`page-layout ${hideSidebar ? 'page-layout-centered' : ''}`}>
        <main className="page-main">{children}</main>
        {!hideSidebar && <LeaderboardSidebar />}
      </div>
    </div>
  )
}
