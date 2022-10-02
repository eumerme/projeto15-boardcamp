import Joi from "joi";

const schemas = {
	categoryPOST: Joi.object().keys({
		name: Joi.string().trim().required(),
	}),
	gamePOST: Joi.object().keys({
		name: Joi.string().trim().required(),
		image: Joi.string().trim().base64().required(),
		stockTotal: Joi.number().greater(0).required(),
		pricePerDay: Joi.number().greater(0).required(),
		categoryId: Joi.number().required(),
	}),
	queryGameGET: Joi.object().keys({ name: Joi.string().trim() }),
	customerPOST: Joi.object().keys({
		name: Joi.string().trim().required(),
		phone: Joi.string().alphanum().min(10).max(11).required(),
		cpf: Joi.string().alphanum().length(11).required(),
		birthday: Joi.string().isoDate().required(),
	}),
	rentalPOST: Joi.object().keys({
		customerId: Joi.number().required(),
		gameId: Joi.number().required(),
		daysRented: Joi.number().greater(0).required(),
	}),
	queryRentalGET: Joi.object().keys({
		customerId: Joi.number().positive().integer(),
		gameId: Joi.number().positive().integer(),
	}),
	paramsId: Joi.object().keys({
		id: Joi.number().positive().integer(),
	}),
};

export { schemas };
