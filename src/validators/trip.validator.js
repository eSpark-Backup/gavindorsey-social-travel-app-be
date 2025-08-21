import Joi from "joi";

const daySchema = Joi.object({
  dayNumber: Joi.number().integer().min(1).required(),
  notes: Joi.string().trim().max(500).optional(),
  cost: Joi.number().precision(2).min(0).optional(),
});

const markerSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  lat: Joi.number().min(-90).max(90).required(),
  lon: Joi.number().min(-180).max(180).required(),
});

export const createTripValidator = Joi.object({
  imageUrl: Joi.string().uri().optional(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).required(),
  location: Joi.string().trim().min(2).max(100).required(),
  budget: Joi.number().precision(2).positive().required(),
  totalCost: Joi.number().precision(2).min(0).optional(),
  days: Joi.array().items(daySchema).optional(),
  markers: Joi.array().items(markerSchema).optional(),
});

export const updateTripValidator = Joi.object({
  imageUrl: Joi.string().uri().optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).when("startDate", {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  location: Joi.string().trim().min(2).max(100).optional(),
  budget: Joi.number().precision(2).positive().optional(),
  totalCost: Joi.number().precision(2).min(0).optional(),
  days: Joi.array().items(daySchema).optional(),
  markers: Joi.array().items(markerSchema).optional(),
  old_public_id: Joi.string().trim().optional(),
});

export const markerDetailsValidator = Joi.object({
  lat: Joi.number().min(-90).max(90).required(),
  lon: Joi.number().min(-180).max(180).required(),
});
