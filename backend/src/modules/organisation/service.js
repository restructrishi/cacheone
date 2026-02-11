import * as organisationModel from './model.js';

/** Organisation service - placeholder. No cross-module direct access. */
export async function listOrganisations(withModules = false) {
  return withModules ? organisationModel.findAllWithModules() : organisationModel.findAll();
}

export async function getOrganisationById(id) {
  return organisationModel.findById(id);
}

export async function createOrganisation(data) {
  return organisationModel.create(data);
}

export async function updateOrganisation(id, data) {
  return organisationModel.update(id, data);
}

export async function deleteOrganisation(id) {
  return organisationModel.remove(id);
}

export async function setOrganisationModules(id, moduleSlugs) {
  return organisationModel.setModules(id, moduleSlugs);
}
