# 3D model

Drop a glTF binary here as `aureon-s5.glb` and the hero will use it instead of
the built-in primitive model.

- The loader normalises the model: it is scaled so its length is 5.1 world
  units and dropped onto y = 0, so the camera choreography needs no changes.
- Presence is resolved at **build time** (see `next.config.mjs`), so add the
  file and redeploy — there is no runtime probe.
- Keep it under ~8 MB and Draco- or Meshopt-compressed if possible; it is
  fetched on first paint of the hero.
- Orient the model with +X forward (boom side) and +Y up.

Without this file the hero renders `FallbackExcavator`, a low-poly stand-in
built to the published S5 dimensions.
