import * as organisationService from './service.js';

/** Organisation controller - placeholder. */
export async function list(req, res, next) {
  try {
    const withModules = req.query.with_modules === 'true';
    const data = await organisationService.listOrganisations(withModules);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const data = await organisationService.getOrganisationById(id);
    if (!data) return res.status(404).json({ success: false, message: 'Organisation not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const data = await organisationService.createOrganisation(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const { id } = req.params;
    const data = await organisationService.updateOrganisation(id, req.body);
    if (!data) return res.status(404).json({ success: false, message: 'Organisation not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await organisationService.deleteOrganisation(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Organisation not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function setModules(req, res, next) {
  try {
    const { id } = req.params;
    const { moduleSlugs } = req.body;
    await organisationService.setOrganisationModules(id, moduleSlugs || []);
    res.json({ success: true, message: 'Modules updated' });
  } catch (err) {
    next(err);
  }
}
