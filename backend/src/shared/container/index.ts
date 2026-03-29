import "reflect-metadata";
import { container } from "tsyringe";

// 🔥 IMPORTA OS CONTAINERS (NÃO providers)
import "./modules/company.container";
import "./modules/tenant.container";
import "./modules/property.container";
import "./modules/auth.container";

// 🔥 EXPORTA
export { container };