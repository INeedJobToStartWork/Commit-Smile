/** @type {import("@changesets/types").GetReleaseLine}  */
async function getReleaseLine(changeset, type, changelogOpts) {
  console.log(type == "");
}

/** @type {import("@changesets/types").GetDependencyReleaseLine}  */
async function getDependencyReleaseLine() {}

/** @type {import("@changesets/types").ChangelogFunctions}  */
export default {
  getReleaseLine,
  getDependencyReleaseLine,
};
