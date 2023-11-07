/// <reference types="vite/client" />

declare module "*.fbx" {
  const content: string;
  export default content;
}
declare module "*.glb" {
  const content: string;
  export default content;
}

// export default {
//   // ...
//   build: {
//     // ...
//     assetsInclude: ["**/*.fbx"],
//   },
// };
