export const CAMPAIGN_END = new Date('2026-06-15T00:00:00').getTime()

export function isCampaignEnded() {
  return Date.now() >= CAMPAIGN_END
}
