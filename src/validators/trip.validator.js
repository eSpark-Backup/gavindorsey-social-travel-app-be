import Joi from "joi";

const daySchema = Joi.object({
  dayNumber: Joi.number().integer().min(1).required(),
  notes: Joi.string().trim().max(500).optional(),
  cost: Joi.number().precision(2).min(0).optional(),
});

const markerSchema = Joi.object({
  name: Joi.string().trim().optional(),
  lat: Joi.number().min(-90).max(90).required(),
  lon: Joi.number().min(-180).max(180).required(),
  address: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
});

export const createTripValidator = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  imageUrl: Joi.string().uri().optional(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).required(),
  budget: Joi.number().precision(2).positive().required(),
  totalCost: Joi.number().precision(2).min(0).optional(),
  days: Joi.array().items(daySchema).optional(),
  markers: Joi.array().items(markerSchema).optional(),
});

export const updateTripValidator = Joi.object({
  title: Joi.string().min(2).max(100).optional(),
  imageUrl: Joi.string().uri().optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).when("startDate", {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
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

export const placeMarkerValidator = Joi.object({
  tripId: Joi.string().uuid().required(),
  markers: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().trim().optional(),
        address: Joi.string().trim().optional(),
        lat: Joi.number().min(-90).max(90).when("address", {
          is: Joi.exist(),
          then: Joi.optional(),
          otherwise: Joi.required(),
        }),
        lon: Joi.number().min(-180).max(180).when("address", {
          is: Joi.exist(),
          then: Joi.optional(),
          otherwise: Joi.required(),
        }),
        description: Joi.string().trim().optional(),
      }).or("address", "lat")
    )
    .min(1)
    .required(),
});

