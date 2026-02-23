/**
 * Barbershop App Instance
 *
 * Uses createApp() with config from questpie.config.ts
 * and hand-written entity registrations.
 */

import { adminRpc } from "@questpie/admin/server";
import { createApp } from "questpie";
import {
	createBooking,
	getActiveBarbers,
	getAvailableTimeSlots,
	getRevenueStats,
} from "@/questpie/server/functions";
import { blocks } from "./blocks";
import {
	appointments,
	barberServices,
	barbers,
	pages,
	reviews,
	services,
} from "./collections";
import { siteSettings } from "./globals";
import {
	sendAppointmentCancellation,
	sendAppointmentConfirmation,
	sendAppointmentReminder,
} from "./jobs";
import appConfig from "./questpie.config";

export const app = createApp(appConfig, {
	collections: {
		barbers,
		services,
		barberServices,
		appointments,
		reviews,
		pages,
	},
	globals: { siteSettings },
	jobs: {
		sendAppointmentConfirmation,
		sendAppointmentCancellation,
		sendAppointmentReminder,
	},
	functions: {
		...adminRpc,
		getActiveBarbers,
		getRevenueStats,
		getAvailableTimeSlots,
		createBooking,
	},
	blocks,
});

export type App = typeof app;
export type AppRpc = App["functions"];
