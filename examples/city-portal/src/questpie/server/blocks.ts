/**
 * City Portal Blocks
 *
 * Content blocks for building city council pages.
 */

import {
	type AdminConfigContext,
	type BlockCategoryConfig,
	block,
} from "@questpie/admin/server";
import type { Where } from "questpie";
import type { App } from "@/questpie/server/.generated";
import type _announcements from "@/questpie/server/collections/announcements";
import type _documents from "@/questpie/server/collections/documents";
import type _news from "@/questpie/server/collections/news";

// ============================================================================
// Category Helpers
// ============================================================================

const sections = (c: AdminConfigContext["c"]): BlockCategoryConfig => ({
	label: "Sections",
	icon: c.icon("ph:layout"),
	order: 1,
});

const content = (c: AdminConfigContext["c"]): BlockCategoryConfig => ({
	label: "Content",
	icon: c.icon("ph:text-t"),
	order: 2,
});

const layout = (c: AdminConfigContext["c"]): BlockCategoryConfig => ({
	label: "Layout",
	icon: c.icon("ph:columns"),
	order: 3,
});

const dynamic = (c: AdminConfigContext["c"]): BlockCategoryConfig => ({
	label: "Dynamic",
	icon: c.icon("ph:arrows-clockwise"),
	order: 4,
});

// ============================================================================
// Section Blocks
// ============================================================================

export const heroBlock = block("hero")
	.admin(({ c }) => ({
		label: "Hero Section",
		icon: c.icon("ph:image"),
		category: sections(c),
		order: 1,
	}))
	.fields(({ f }) => ({
		title: f.text().label("Title").required(),
		subtitle: f.textarea().label("Subtitle"),
		backgroundImage: f.upload({ mimeTypes: ["image/*"] }).label("Background Image"),
		overlayOpacity: f.number().label("Overlay Opacity").default(60),
		alignment: f
			.select([
				{ value: "left", label: "Left" },
				{ value: "center", label: "Center" },
				{ value: "right", label: "Right" },
			])
			.label("Alignment")
			.default("center"),
		ctaText: f.text().label("CTA Text"),
		ctaLink: f.text().label("CTA Link"),
		showSearch: f.boolean().label("Show Search Bar").default(false),
		height: f
			.select([
				{ value: "small", label: "Small" },
				{ value: "medium", label: "Medium" },
				{ value: "large", label: "Large" },
				{ value: "full", label: "Full" },
			])
			.label("Height")
			.default("medium"),
	}));

export const ctaBlock = block("cta")
	.admin(({ c }) => ({
		label: "Call to Action",
		icon: c.icon("ph:megaphone"),
		category: sections(c),
		order: 2,
	}))
	.fields(({ f }) => ({
		title: f.text().label("Title").required(),
		description: f.textarea().label("Description"),
		buttonText: f.text().label("Button Text"),
		buttonLink: f.text().label("Button Link"),
		variant: f
			.select([
				{ value: "highlight", label: "Highlight" },
				{ value: "dark", label: "Dark" },
				{ value: "light", label: "Light" },
			])
			.label("Variant")
			.default("highlight"),
	}));

export const announcementBannerBlock = block("announcement-banner")
	.admin(({ c }) => ({
		label: "Announcement Banner",
		icon: c.icon("ph:bell"),
		category: sections(c),
		order: 3,
	}))
	.fields(({ f }) => ({
		count: f.number().label("Number to Show").default(3),
		showExpired: f.boolean().label("Show Expired").default(false),
	}))
	.prefetch(async ({ values, ctx }) => {
		const app = ctx.app as App;
		let where: Where<typeof _announcements, App> = {};
		if (!values.showExpired) {
			where = {
				validTo: { gte: new Date().toISOString() },
			};
		}

		const res = await app.api.collections.announcements.find({
			limit: values.count || 3,
			where,
			orderBy: { isPinned: "desc", validFrom: "desc" },
		});
		return { announcements: res.docs };
	});

// ============================================================================
// Content Blocks
// ============================================================================

export const textBlock = block("text")
	.admin(({ c }) => ({
		label: "Text Block",
		icon: c.icon("ph:text-t"),
		category: content(c),
		order: 1,
	}))
	.fields(({ f }) => ({
		content: f.richText().label("Content").required(),
		maxWidth: f
			.select([
				{ value: "narrow", label: "Narrow" },
				{ value: "medium", label: "Medium" },
				{ value: "wide", label: "Wide" },
				{ value: "full", label: "Full" },
			])
			.label("Max Width")
			.default("medium"),
		padding: f
			.select([
				{ value: "none", label: "None" },
				{ value: "small", label: "Small" },
				{ value: "medium", label: "Medium" },
				{ value: "large", label: "Large" },
			])
			.label("Padding")
			.default("medium"),
	}));

export const headingBlock = block("heading")
	.admin(({ c }) => ({
		label: "Heading",
		icon: c.icon("ph:text-h-one"),
		category: content(c),
		order: 2,
	}))
	.fields(({ f }) => ({
		text: f.text().label("Text").required(),
		level: f
			.select([
				{ value: "h1", label: "H1" },
				{ value: "h2", label: "H2" },
				{ value: "h3", label: "H3" },
				{ value: "h4", label: "H4" },
			])
			.label("Level")
			.default("h2"),
		align: f
			.select([
				{ value: "left", label: "Left" },
				{ value: "center", label: "Center" },
				{ value: "right", label: "Right" },
			])
			.label("Alignment")
			.default("left"),
	}));

export const imageBlock = block("image")
	.admin(({ c }) => ({
		label: "Image",
		icon: c.icon("ph:image"),
		category: content(c),
		order: 3,
	}))
	.fields(({ f }) => ({
		image: f.upload({ mimeTypes: ["image/*"] }).label("Image").required(),
		caption: f.text().label("Caption"),
		alt: f.text().label("Alt Text").description("Description for accessibility"),
		aspectRatio: f
			.select([
				{ value: "original", label: "Original" },
				{ value: "square", label: "Square" },
				{ value: "video", label: "16:9" },
				{ value: "portrait", label: "3:4" },
			])
			.label("Aspect Ratio")
			.default("original"),
		width: f
			.select([
				{ value: "full", label: "Full Width" },
				{ value: "medium", label: "Medium" },
				{ value: "small", label: "Small" },
			])
			.label("Width")
			.default("full"),
	}));

export const galleryBlock = block("gallery")
	.admin(({ c }) => ({
		label: "Gallery",
		icon: c.icon("ph:images"),
		category: content(c),
		order: 4,
	}))
	.fields(({ f }) => ({
		title: f.text().label("Title"),
		images: f.json().label("Images").description("Array of image data"),
		columns: f
			.select([
				{ value: "2", label: "2" },
				{ value: "3", label: "3" },
				{ value: "4", label: "4" },
			])
			.label("Columns")
			.default("3"),
		showCaptions: f.boolean().label("Show Captions").default(true),
		gap: f
			.select([
				{ value: "small", label: "Small" },
				{ value: "medium", label: "Medium" },
				{ value: "large", label: "Large" },
			])
			.label("Gap")
			.default("medium"),
	}));

export const imageTextBlock = block("image-text")
	.admin(({ c }) => ({
		label: "Image + Text",
		icon: c.icon("ph:layout"),
		category: content(c),
		order: 5,
	}))
	.fields(({ f }) => ({
		image: f.upload({ mimeTypes: ["image/*"] }).label("Image"),
		imagePosition: f
			.select([
				{ value: "left", label: "Left" },
				{ value: "right", label: "Right" },
			])
			.label("Image Position")
			.default("left"),
		title: f.text().label("Title"),
		content: f.richText().label("Content"),
		ctaText: f.text().label("CTA Text"),
		ctaLink: f.text().label("CTA Link"),
	}));

export const videoBlock = block("video")
	.admin(({ c }) => ({
		label: "Video Embed",
		icon: c.icon("ph:video"),
		category: content(c),
		order: 6,
	}))
	.fields(({ f }) => ({
		title: f.text().label("Title"),
		url: f
			.text()
			.label("Video URL")
			.description("YouTube or Vimeo URL")
			.required(),
		caption: f.text().label("Caption"),
	}));

export const accordionBlock = block("accordion")
	.admin(({ c }) => ({
		label: "Accordion / FAQ",
		icon: c.icon("ph:list-dashes"),
		category: content(c),
		order: 7,
	}))
	.fields(({ f }) => ({
		title: f.text().label("Title"),
		items: f
			.json()
			.label("Items")
			.description("Array of {title, content} objects"),
		allowMultipleOpen: f.boolean().label("Allow Multiple Open").default(false),
	}));

// ============================================================================
// Dynamic Blocks
// ============================================================================

export const latestNewsBlock = block("latest-news")
	.admin(({ c }) => ({
		label: "Latest News",
		icon: c.icon("ph:newspaper"),
		category: dynamic(c),
		order: 1,
	}))
	.fields(({ f }) => ({
		title: f.text().label("Title").default("Latest News"),
		count: f.number().label("Number of Articles").default(3),
		showFeatured: f.boolean().label("Show Featured First").default(true),
		category: f
			.select([
				{ value: "all", label: "All Categories" },
				{ value: "general", label: "General" },
				{ value: "council", label: "Council News" },
				{ value: "events", label: "Events" },
				{ value: "planning", label: "Planning" },
				{ value: "community", label: "Community" },
				{ value: "transport", label: "Transport" },
			])
			.label("Filter by Category")
			.default("all"),
		layout: f
			.select([
				{ value: "grid", label: "Grid" },
				{ value: "list", label: "List" },
			])
			.label("Layout")
			.default("grid"),
	}))
	.prefetch(async ({ values, ctx }) => {
		const app = ctx.app as App;
		let where: Where<typeof _news, App> = {};
		if (values.category && values.category !== "all") {
			where = {
				category: values.category,
			};
		}

		const res = await app.api.collections.news.find({
			limit: values.count || 3,
			where,
			orderBy: values.showFeatured
				? [{ isFeatured: "desc" }, { publishedAt: "desc" }]
				: { publishedAt: "desc" },
		});
		return { news: res.docs };
	});

export const contactsListBlock = block("contacts-list")
	.admin(({ c }) => ({
		label: "Contacts List",
		icon: c.icon("ph:address-book"),
		category: dynamic(c),
		order: 2,
	}))
	.fields(({ f }) => ({
		title: f.text().label("Title").default("Contact Us"),
		showAll: f.boolean().label("Show All Contacts").default(true),
		contactIds: f
			.json()
			.label("Specific Contacts")
			.description("Array of contact IDs (if not showing all)"),
	}))
	.prefetch(async ({ values, ctx }) => {
		const app = ctx.app as App;
		const findOptions: any = {
			orderBy: { order: "asc" },
		};

		if (!values.showAll) {
			const ids = (values.contactIds as string[]) || [];
			if (ids.length === 0) return { contacts: [] };
			findOptions.where = { id: { in: ids } };
		}

		const res = await app.api.collections.contacts.find(findOptions);
		return { contacts: res.docs };
	});

export const documentsListBlock = block("documents-list")
	.admin(({ c }) => ({
		label: "Documents List",
		icon: c.icon("ph:file-text"),
		category: dynamic(c),
		order: 3,
	}))
	.fields(({ f }) => ({
		title: f.text().label("Title").default("Documents"),
		category: f
			.select([
				{ value: "all", label: "All Categories" },
				{ value: "policy", label: "Policy" },
				{ value: "minutes", label: "Meeting Minutes" },
				{ value: "budget", label: "Budget & Finance" },
				{ value: "planning", label: "Planning" },
				{ value: "strategy", label: "Strategy" },
				{ value: "report", label: "Report" },
				{ value: "form", label: "Form" },
				{ value: "guide", label: "Guide" },
			])
			.label("Filter by Category")
			.default("all"),
		limit: f.number().label("Max Documents").default(10),
	}))
	.prefetch(async ({ values, ctx }) => {
		const app = ctx.app as App;
		let where: Where<typeof _documents, App> = { isPublished: true };
		if (values.category && values.category !== "all") {
			where = { ...where, category: values.category };
		}

		const res = await app.api.collections.documents.find({
			limit: values.limit || 10,
			where,
			orderBy: { publishedDate: "desc" },
		});
		return { documents: res.docs };
	});

// ============================================================================
// Layout Blocks
// ============================================================================

export const columnsBlock = block("columns")
	.admin(({ c }) => ({
		label: "Columns",
		icon: c.icon("ph:columns"),
		category: layout(c),
		order: 1,
	}))
	.allowChildren()
	.fields(({ f }) => ({
		columns: f
			.select([
				{ value: "2", label: "2" },
				{ value: "3", label: "3" },
				{ value: "4", label: "4" },
			])
			.label("Columns")
			.default("2"),
		gap: f
			.select([
				{ value: "small", label: "Small" },
				{ value: "medium", label: "Medium" },
				{ value: "large", label: "Large" },
			])
			.label("Gap")
			.default("medium"),
		padding: f
			.select([
				{ value: "none", label: "None" },
				{ value: "small", label: "Small" },
				{ value: "medium", label: "Medium" },
				{ value: "large", label: "Large" },
			])
			.label("Padding")
			.default("medium"),
	}));

export const spacerBlock = block("spacer")
	.admin(({ c }) => ({
		label: "Spacer",
		icon: c.icon("ph:arrows-out-vertical"),
		category: layout(c),
		order: 2,
	}))
	.fields(({ f }) => ({
		size: f
			.select([
				{ value: "small", label: "S" },
				{ value: "medium", label: "M" },
				{ value: "large", label: "L" },
				{ value: "xlarge", label: "XL" },
			])
			.label("Size")
			.default("medium"),
	}));

export const dividerBlock = block("divider")
	.admin(({ c }) => ({
		label: "Divider",
		icon: c.icon("ph:minus"),
		category: layout(c),
		order: 3,
	}))
	.fields(({ f }) => ({
		style: f
			.select([
				{ value: "solid", label: "Solid" },
				{ value: "dashed", label: "Dashed" },
				{ value: "dotted", label: "Dotted" },
			])
			.label("Style")
			.default("solid"),
		width: f
			.select([
				{ value: "full", label: "Full" },
				{ value: "medium", label: "Medium" },
				{ value: "small", label: "Small" },
			])
			.label("Width")
			.default("full"),
	}));

// ============================================================================
// Export all blocks
// ============================================================================

export const blocks = {
	hero: heroBlock,
	cta: ctaBlock,
	"announcement-banner": announcementBannerBlock,
	text: textBlock,
	heading: headingBlock,
	image: imageBlock,
	gallery: galleryBlock,
	"image-text": imageTextBlock,
	video: videoBlock,
	accordion: accordionBlock,
	"latest-news": latestNewsBlock,
	"contacts-list": contactsListBlock,
	"documents-list": documentsListBlock,
	columns: columnsBlock,
	spacer: spacerBlock,
	divider: dividerBlock,
};
