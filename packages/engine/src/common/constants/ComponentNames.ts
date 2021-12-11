export const ComponentName = {
  MT_DATA: 'mtdata' as const,
  _MT_DATA: '_metadata' as const,
  USER_DATA: 'userdata' as const,
  AMBIENT_LIGHT: 'ambient-light' as const,
  DIRECTIONAL_LIGHT: 'directional-light' as const,
  HEMISPHERE_LIGHT: 'hemisphere-light' as const,
  POINT_LIGHT: 'point-light' as const,
  SPOT_LIGHT: 'spot-light' as const,
  COLLIDABLE: 'collidable' as const,
  FLOOR_PLAN: 'floor-plan' as const,
  GLTF_MODEL: 'gltf-model' as const,
  LOOP_ANIMATION: 'loop-animation' as const,
  INTERACT: 'interact' as const,
  GROUND_PLANE: 'ground-plane' as const,
  IMAGE: 'image' as const,
  VIDEO: 'video' as const,
  MAP: 'map' as const,
  AUDIO: 'audio' as const,
  VOLUMETRIC: 'volumetric' as const,
  TRANSFORM: 'transform' as const,
  FOG: 'fog' as const,
  SKYBOX: 'skybox' as const,
  AUDIO_SETTINGS: 'audio-settings' as const,
  RENDERER_SETTINGS: 'renderer-settings' as const,
  SPAWN_POINT: 'spawn-point' as const,
  SCENE: 'scene' as const,
  SCENE_PREVIEW_CAMERA: 'scene-preview-camera' as const,
  SHADOW: 'shadow' as const,
  COLLIDER: 'collider' as const,
  BOX_COLLIDER: 'box-collider' as const,
  TRIGGER_VOLUME: 'trigger-volume' as const,
  LINK: 'link' as const,
  PARTICLE_EMITTER: 'particle-emitter' as const,
  CLOUDS: 'clouds' as const,
  OCEAN: 'ocean' as const,
  WATER: 'water' as const,
  INTERIOR: 'interior' as const,
  POSTPROCESSING: 'postprocessing' as const,
  CAMERA_PROPERTIES: 'cameraproperties' as const,
  ENVMAP: 'envmap' as const,
  PORTAL: 'portal' as const,
  GROUP: 'group' as const,
  PROJECT: 'project' as const,
  VISIBLE: 'visible' as const,
  PERSIST: 'persist' as const,
  INCLUDE_IN_CUBEMAP_BAKE: 'includeInCubemapBake' as const,
  MESH_COLLIDER: 'mesh-collider' as const,
  CUBEMAP_BAKE: 'cubemap-bake' as const,
  NAME: 'name' as const,
  SIMPLE_MATERIALS: 'simple-materials' as const,
  WALKABLE: 'walkable' as const
}

export type ComponentNameType = typeof ComponentName[keyof typeof ComponentName]
