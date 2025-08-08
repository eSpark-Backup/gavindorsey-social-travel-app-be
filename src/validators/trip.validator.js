import Joi from "joi";

const createTripSchema = Joi.object({
  image_url: Joi.string().uri().optional(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  location: Joi.string().trim().min(2).max(100).required(),
  budget: Joi.number().precision(2).positive().required(),
  total_cost: Joi.number().precision(2).min(0).optional(),
  days: Joi.array()
    .items(
      Joi.object({
        day_number: Joi.number().integer().min(1).required(),
        notes: Joi.string().trim().max(500).optional(),
        cost: Joi.number().precision(2).min(0).optional(),
      })
    )
    .optional(),
});

const updateTripSchema = Joi.object({
  image_url: Joi.string().uri().optional(),
  start_date: Joi.date().optional(),
  end_date: Joi.date().optional(),
  location: Joi.string().trim().min(2).max(100).optional(),
  budget: Joi.number().precision(2).positive().optional(),
  total_cost: Joi.number().precision(2).min(0).optional(),
  days: Joi.array()
    .items(
      Joi.object({
        day_number: Joi.number().integer().min(1).required(),
        notes: Joi.string().trim().max(500).optional(),
        cost: Joi.number().precision(2).min(0).optional(),
      })
    )
    .optional(),
});

export { createTripSchema, updateTripSchema };
