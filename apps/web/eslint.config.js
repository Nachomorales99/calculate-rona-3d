import { react } from "@rona3d/config/eslint/react";

export default [...react, { ignores: ["dist/**", "dev-dist/**", "coverage/**"] }];
