import { Eye, Palette, Puzzle, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import { CodeWindow } from "./CodeWindow";

type PresetId = "renderers" | "views" | "components" | "realtime";

type Preset = {
	id: PresetId;
	label: string;
	kicker: string;
	file: string;
	code: string;
	points: string[];
	previewTitle: string;
	previewBody: string;
};

const presets: Preset[] = [
	{
		id: "renderers",
		label: "Field renderer registry",
		kicker: "Custom field UX",
		file: "admin/admin.ts",
		code: `// Auto-generated admin config includes all field renderers
import admin from "./.generated/client"

// Extend with custom field renderers
admin.fields({
  point: PointFieldRenderer,
  availability: TimeSlotsRenderer,
})`,
		points: [
			"Register custom field renderers",
			"Use domain-native controls (maps, slots, visual pickers)",
			"Keep field contracts portable across apps",
		],
		previewTitle: "Custom fields in your own UI language",
		previewBody:
			"Point picker, scheduling controls, and branded field chrome come from your registry - not from locked-in defaults.",
	},
	{
		id: "views",
		label: "List/edit view registry",
		kicker: "Workflow views",
		file: "admin/admin.ts",
		code: `// Auto-generated admin config includes all view types
import admin from "./.generated/client"

// Extend with custom view types
admin.views({
  kanban: listView("kanban", { component: AppointmentsKanban }),
  splitForm: editView("split-form", { component: SplitEditor }),
})`,
		points: [
			"Register custom list/edit views",
			"Map business workflows to dedicated view types",
			"Reuse one contract across teams and products",
		],
		previewTitle: "Same data, different operator workflows",
		previewBody:
			"Switch between table, kanban, and split-edit experiences without changing server contracts.",
	},
	{
		id: "components",
		label: "Component references",
		kicker: "Brand + tokens",
		file: "admin/admin.ts",
		code: `// Auto-generated admin config includes defaults
import admin from "./.generated/client"

// Override with your design system components
admin.components({
  icon: AppIcon,
  badge: AppBadge,
  statusPill: StatusPill,
  emptyState: EmptyStateCard,
})`,
		points: [
			"Resolve component refs from registry",
			"Keep UI composition in one place",
			"Keep tokens/components/UX rules inside your design system",
		],
		previewTitle: "Contracts from server, presentation from your app",
		previewBody:
			"Icons, badges, states, and empty views remain fully aligned with your product design system.",
	},
	{
		id: "realtime",
		label: "Realtime operator mode",
		kicker: "Live admin",
		file: "admin/admin.ts",
		code: `// Auto-generated admin config
import admin from "./.generated/client"

// Add realtime-aware views and components
admin.views({
  table: listView("table", {
    component: LiveAppointmentsTable,
    props: { highlightMode: "pulse" },
  }),
}).components({
  activityFeed: LiveActivityFeed,
  presenceAvatar: PresenceAvatar,
})`,
		points: [
			"Live presence for operators working in parallel",
			"Realtime highlights for changed rows/fields",
			"Activity feed components rendered from your registry",
		],
		previewTitle: "Realtime admin that still looks like your product",
		previewBody:
			"Presence, live updates, and conflict cues are visualized through your own components and interaction rules.",
	},
];

const pillars = [
	{ icon: Palette, label: "Tokens" },
	{ icon: Puzzle, label: "Components" },
	{ icon: Sparkles, label: "UX Rules" },
	{ icon: Eye, label: "Realtime" },
];

export function Stack() {
	const [activeId, setActiveId] = useState<PresetId>("realtime");
	const activePreset = useMemo(
		() => presets.find((preset) => preset.id === activeId) ?? presets[0],
		[activeId],
	);

	return (
		<section id="design-system" className="border-border/40 border-t py-24">
			<div className="mx-auto w-full max-w-7xl px-4">
				<div className="grid items-start gap-10 lg:grid-cols-[1fr_1.2fr]">
					<div className="space-y-5">
						<h2 className="text-primary font-mono text-sm tracking-[0.2em] uppercase">
							Design system integration
						</h2>
						<h3 className="text-3xl font-bold tracking-tight md:text-4xl">
							Bring your design system. Keep your velocity.
						</h3>
						<p className="text-muted-foreground">
							QUESTPIE ships contracts, not visual lock-in. Server config stays
							portable and serializable, while client registries map contracts
							to your own components, tokens, interactions, and realtime cues.
						</p>

						<div className="space-y-2">
							<p className="text-muted-foreground font-mono text-[11px] tracking-[0.18em] uppercase">
								Click a mode to preview code + UI output
							</p>
							<div className="grid gap-2 sm:grid-cols-2">
								{presets.map((preset) => (
									<button
										key={preset.id}
										type="button"
										onClick={() => setActiveId(preset.id)}
										aria-pressed={activeId === preset.id}
										className={cn(
											"border px-3 py-2 text-left transition-colors",
											activeId === preset.id
												? "border-primary/60 bg-primary/10"
												: "border-border bg-card/30 hover:border-primary/35",
										)}
									>
										<span className="text-muted-foreground block font-mono text-[10px] tracking-[0.16em] uppercase">
											{preset.kicker}
										</span>
										<span className="text-foreground block text-sm font-medium">
											{preset.label}
										</span>
									</button>
								))}
							</div>
						</div>

						<div className="text-muted-foreground space-y-2.5 text-sm">
							{activePreset.points.map((item) => (
								<div
									key={item}
									className="border-border bg-card/30 inline-flex w-full items-center gap-2 border px-3 py-2"
								>
									<Sparkles className="text-primary h-3.5 w-3.5" />
									{item}
								</div>
							))}
						</div>

						<div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-4">
							{pillars.map((pillar) => (
								<div
									key={pillar.label}
									className="border-border bg-card/30 text-muted-foreground border p-3 text-center text-xs"
								>
									<pillar.icon className="text-primary mx-auto mb-2 h-4 w-4" />
									{pillar.label}
								</div>
							))}
						</div>
					</div>

					<div className="space-y-4">
						<CodeWindow title={activePreset.file}>
							{activePreset.code}
						</CodeWindow>

						<div className="border-border bg-card/30 border p-4">
							<div className="mb-4 space-y-1">
								<p className="text-primary font-mono text-[10px] tracking-[0.2em] uppercase">
									Visual output
								</p>
								<h4 className="text-foreground text-sm font-semibold">
									{activePreset.previewTitle}
								</h4>
								<p className="text-muted-foreground text-xs leading-relaxed">
									{activePreset.previewBody}
								</p>
							</div>

							<StackVisualization preset={activePreset.id} />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function StackVisualization({ preset }: { preset: PresetId }) {
	if (preset === "renderers") {
		return (
			<div className="grid gap-3 md:grid-cols-2">
				<div className="border-border bg-background/60 border p-3">
					<p className="text-muted-foreground font-mono text-[10px] tracking-[0.16em] uppercase">
						Point field renderer
					</p>
					<div className="border-border from-primary/15 via-primary/5 mt-2 border bg-gradient-to-br to-transparent p-3">
						<p className="text-xs font-medium">Pickup point</p>
						<p className="text-muted-foreground mt-1 text-[11px]">
							Map + coordinates with branded controls
						</p>
						<div className="border-primary/30 bg-primary/10 mt-3 h-20 border" />
					</div>
				</div>

				<div className="border-border bg-background/60 border p-3">
					<p className="text-muted-foreground font-mono text-[10px] tracking-[0.16em] uppercase">
						Smart editor chrome
					</p>
					<div className="border-border bg-card/40 mt-2 space-y-2 border p-3">
						<div className="bg-muted h-2 w-2/5" />
						<div className="bg-muted h-2 w-full" />
						<div className="bg-muted h-2 w-4/5" />
						<div className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-2 border px-2 py-1 text-[11px]">
							<Sparkles className="h-3 w-3" />
							Generated from registry config
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (preset === "views") {
		return (
			<div className="grid gap-3 md:grid-cols-3">
				{[
					{ title: "Queue", items: ["Walk-in", "Phone booking"] },
					{ title: "In Progress", items: ["Coloring", "Haircut"] },
					{ title: "Done", items: ["Styling", "Checkout"] },
				].map((column) => (
					<div
						key={column.title}
						className="border-border bg-background/60 border p-3"
					>
						<p className="text-muted-foreground font-mono text-[10px] tracking-[0.16em] uppercase">
							{column.title}
						</p>
						<div className="mt-2 space-y-2">
							{column.items.map((item) => (
								<div
									key={item}
									className="border-border bg-card/40 border px-2 py-1.5 text-xs"
								>
									{item}
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		);
	}

	if (preset === "components") {
		return (
			<div className="border-border bg-background/60 space-y-2 border p-3">
				{[
					{ name: "Appointment #A-102", status: "Confirmed" },
					{ name: "Appointment #A-103", status: "Pending" },
					{ name: "Appointment #A-104", status: "Done" },
				].map((item) => (
					<div
						key={item.name}
						className="border-border bg-card/40 flex items-center justify-between border px-3 py-2"
					>
						<div className="flex items-center gap-2">
							<div className="bg-primary h-2.5 w-2.5" />
							<span className="text-xs font-medium">{item.name}</span>
						</div>
						<span className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-1 border px-2 py-0.5 text-[11px]">
							<Puzzle className="h-3 w-3" />
							{item.status}
						</span>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="border-border bg-background/60 space-y-3 border p-3">
			<div className="border-border bg-card/40 flex items-center justify-between border px-3 py-2">
				<div className="flex items-center gap-2">
					<Eye className="text-primary h-4 w-4" />
					<span className="text-xs font-medium">Live presence</span>
				</div>
				<div className="flex -space-x-1.5">
					{["AK", "ML", "JR"].map((user) => (
						<span
							key={user}
							className="border-background bg-primary/20 text-primary inline-flex h-6 w-6 items-center justify-center border font-mono text-[10px]"
						>
							{user}
						</span>
					))}
				</div>
			</div>

			<div className="space-y-2">
				{[
					"Mila updated Appointment #A-102",
					"Alex moved #A-103 to In Progress",
					"Jaro resolved payment for #A-098",
				].map((event, index) => (
					<div
						key={event}
						className="border-border bg-card/40 flex items-center gap-2 border px-3 py-2 text-xs"
					>
						<span
							className="bg-primary h-2 w-2 animate-pulse"
							style={{ animationDelay: `${index * 220}ms` }}
						/>
						<span className="text-foreground">{event}</span>
					</div>
				))}
			</div>

			<div className="grid gap-2 sm:grid-cols-2">
				<div className="border-primary/30 bg-primary/10 text-primary border px-2 py-1.5 text-[11px]">
					Row highlight pulse
				</div>
				<div className="border-border bg-card/40 text-muted-foreground border px-2 py-1.5 text-[11px]">
					Lock-aware editing cues
				</div>
			</div>
		</div>
	);
}
