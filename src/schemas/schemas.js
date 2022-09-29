import Joi from "joi";

const schemas = {
	categoriePOST: Joi.object().keys({
		name: Joi.string().trim().required(),
	}),
};

export { schemas };
