import { and, eq } from "drizzle-orm";
import { GetModelPricingFromDBError } from "../exceptions/modelPricing.exceptions";
import db from "./db";
import { modelPricing } from "./schema";


export async function getModelPricingFromDB(payload: { provider: string; model: string }) {
	try {
		const pricing = await db
			.select()
			.from(modelPricing)
			.where(and(eq(modelPricing.provider, payload.provider), eq(modelPricing.model, payload.model)));
		return pricing[0];
	} catch (error) {
		throw new GetModelPricingFromDBError("Error occurred while fetching model pricing from database", { cause: (error as Error).message });
	}
}
