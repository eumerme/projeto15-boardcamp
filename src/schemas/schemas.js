import Joi from "joi";

const schemas = {
	categoriePOST: Joi.object().keys({
		name: Joi.string().trim().required(),
	}),
	gamePOST: Joi.object().keys({
		name: Joi.string().trim().required(),
		image: Joi.string().trim().required(),
		stockTotal: Joi.number().greater(0).required(),
		pricePerDay: Joi.number().greater(0).required(),
		categoryId: Joi.number().required(),
	}),
};

export { schemas };
