/**
 * View Skeletons
 *
 * Loading skeletons for collection views (table, form).
 * Used with Suspense boundaries to show loading state.
 */

import { Skeleton } from "../../components/ui/skeleton";

function TableSkeletonRow({ isLast = false }: { isLast?: boolean }) {
	return (
		<div
			className={`border-border flex items-center gap-4 px-4 py-3 ${isLast ? "border-0" : "border-b"}`}
		>
			<Skeleton variant="text" className="h-4 w-4" />
			<Skeleton variant="text" className="h-4 w-48" />
			<Skeleton variant="text" className="h-4 w-20" />
			<Skeleton variant="text" className="h-4 w-24" />
			<Skeleton variant="text" className="ml-auto h-4 w-16" />
		</div>
	);
}

function FormFieldSkeleton() {
	return (
		<div className="space-y-2">
			<Skeleton variant="text" className="h-4 w-24" />
			<Skeleton className="h-10 w-full" />
		</div>
	);
}

function ToolbarIconSkeleton() {
	return <Skeleton variant="text" className="h-8 w-8" />;
}

function ContentLineSkeleton({ width }: { width: string }) {
	return <Skeleton variant="text" className={`h-4 ${width}`} />;
}

/**
 * Skeleton for TableView
 *
 * Shows a loading state that mimics the table layout.
 */
export function TableViewSkeleton() {
	return (
		<div className="qa-table-view-skeleton container">
			<div className="space-y-4">
				{/* Header */}
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div className="space-y-1">
						<Skeleton variant="text" className="h-8 w-48" />
						<Skeleton variant="text" className="h-4 w-64" />
					</div>
					<Skeleton className="h-9 w-32" />
				</div>

				{/* Toolbar */}
				<div className="flex items-center gap-2">
					<Skeleton className="h-9 w-64" />
					<Skeleton className="h-9 w-24" />
					<Skeleton className="h-9 w-24" />
				</div>

				{/* Table */}
				<div className="panel-surface overflow-hidden">
					{/* Header row */}
					<div className="border-border bg-muted flex items-center gap-4 border-b px-4 py-3">
						<Skeleton variant="text" className="h-4 w-4" />
						<Skeleton variant="text" className="h-4 w-32" />
						<Skeleton variant="text" className="h-4 w-24" />
						<Skeleton variant="text" className="h-4 w-24" />
						<Skeleton variant="text" className="ml-auto h-4 w-20" />
					</div>
					{/* Data rows */}
					<TableSkeletonRow />
					<TableSkeletonRow />
					<TableSkeletonRow />
					<TableSkeletonRow />
					<TableSkeletonRow isLast />
				</div>
			</div>
		</div>
	);
}

/**
 * Skeleton for FormView
 *
 * Shows a loading state that mimics the form layout.
 */
export function FormViewSkeleton() {
	return (
		<div className="qa-form-view-skeleton container max-w-4xl py-6">
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Skeleton variant="text" className="h-8 w-8" /> {/* Back button */}
						<Skeleton variant="text" className="h-8 w-48" />
					</div>
					<div className="flex items-center gap-2">
						<Skeleton className="h-9 w-20" />
						<Skeleton className="h-9 w-24" />
					</div>
				</div>

				{/* Form fields */}
				<div className="space-y-6">
					<FormFieldSkeleton />
					<FormFieldSkeleton />
					<FormFieldSkeleton />
					<FormFieldSkeleton />

					{/* Textarea field */}
					<div className="space-y-2">
						<Skeleton variant="text" className="h-4 w-32" />
						<Skeleton className="h-32 w-full" />
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Skeleton for RichTextEditor
 *
 * Shows a loading state that mimics the rich text editor.
 */
function RichTextEditorSkeleton() {
	return (
		<div className="space-y-2">
			{/* Toolbar */}
			<div className="panel-surface bg-muted flex items-center gap-1 rounded-b-none border-b-0 p-2">
				<ToolbarIconSkeleton />
				<ToolbarIconSkeleton />
				<ToolbarIconSkeleton />
				<ToolbarIconSkeleton />
				<ToolbarIconSkeleton />
				<ToolbarIconSkeleton />
				<ToolbarIconSkeleton />
				<ToolbarIconSkeleton />
			</div>
			{/* Content area */}
			<div className="panel-surface min-h-[200px] rounded-t-none border-t-0 p-4">
				<div className="space-y-2">
					<ContentLineSkeleton width="w-full" />
					<ContentLineSkeleton width="w-3/4" />
					<ContentLineSkeleton width="w-5/6" />
					<ContentLineSkeleton width="w-2/3" />
				</div>
			</div>
		</div>
	);
}
