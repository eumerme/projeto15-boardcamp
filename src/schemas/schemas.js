import Joi from "joi";

const schemas = {
	categoryPOST: Joi.object().keys({
		name: Joi.string().trim().required(),
	}),
	gamePOST: Joi.object().keys({
		name: Joi.string().trim().required(),
		image: Joi.string().trim().required(),
		stockTotal: Joi.number().greater(0).required(),
		pricePerDay: Joi.number().greater(0).required(),
		categoryId: Joi.number().required(),
		title: Joi.string().trim(),
	}),
	customerPOST: Joi.object().keys({
		name: Joi.string().trim().required(),
		phone: Joi.string().alphanum().min(10).max(11).required(),
		cpf: Joi.string().alphanum().length(11).required(),
		birthday: Joi.string()
			.pattern(/^\d{4}-\d{2}-\d{2}$/)
			.required(),
	}),
	rentalPOST: Joi.object().keys({
		customerId: Joi.number().required(),
		gameId: Joi.number().required(),
		daysRented: Joi.number().greater(0).required(),
	}),
};

export { schemas };
