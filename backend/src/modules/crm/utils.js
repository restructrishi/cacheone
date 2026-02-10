/**
 * CRM module-specific utilities.
 */

export function formatLeadStatus(status) {
  const map = { new: 'New', contacted: 'Contacted', qualified: 'Qualified', lost: 'Lost' };
  return map[status] || status;
}

export function formatDealStage(stage) {
  const map = { lead: 'Lead', proposal: 'Proposal', negotiation: 'Negotiation', won: 'Won', lost: 'Lost' };
  return map[stage] || stage;
}
