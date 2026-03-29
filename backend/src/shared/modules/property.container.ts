import { container } from "tsyringe";
import { TOKENS } from "../tokens";

import { IPropertyRepository } from "@/modules/properties/infrastructure/repositories/PrismaPropertyRepository";
import { PropertyRepository } from "@/modules/properties/infra/repositories/PropertyRepository";

container.registerSingleton<IPropertyRepository>(
  TOKENS.PropertyRepository,
  PropertyRepository
);
