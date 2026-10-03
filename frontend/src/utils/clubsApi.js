import { api } from './api';

// ─── Public ──────────────────────────────────────────────────────────────────

/** Fetch active clubs. Pass wing='primary'|'secondary' to filter by wing. */
export const getClubs = (wing) => {
  const query = wing ? `?wing=${encodeURIComponent(wing)}` : '';
  return api.list(`clubs${query}`);
};

// ─── Admin ───────────────────────────────────────────────────────────────────

/** Fetch ALL clubs (active + inactive). Admin only. */
export const getAdminClubs = (wing) => {
  const query = wing ? `?wing=${encodeURIComponent(wing)}` : '';
  return api.list(`clubs/admin${query}`);
};

/** Create a new club. Admin only. */
export const createClub = (data) => api.create('clubs', data);

/** Update an existing club by id. Admin only. */
export const updateClub = (id, data) => api.update('clubs', id, data);

/** Delete a club by id. Admin only. */
export const deleteClub = (id) => api.remove('clubs', id);

/** Batch-update display order. items = [{ id, order }, …]. Admin only. */
export const reorderClubs = (items) =>
  api.updateOne('clubs/reorder', { items });
