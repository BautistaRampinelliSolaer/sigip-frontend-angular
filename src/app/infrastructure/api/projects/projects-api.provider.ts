import { LIFECYLCE_API_PROVIDER } from "./lifecycle/lifecycle.provider";
import { PROJECTS_API_PROVIDER } from "./project/projects.provider";

export function projectsApiProvider () {
    return [PROJECTS_API_PROVIDER, LIFECYLCE_API_PROVIDER];
}