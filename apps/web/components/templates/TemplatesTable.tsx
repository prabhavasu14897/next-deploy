"use client";

import type { ContentTemplate } from "@/lib/templates/types";
import { iconFor } from "@/lib/templates/icon-registry";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconButton } from "@/components/ui/Button";
import { PencilIcon, TrashIcon } from "@/components/ui/icons";

const HEADERS = ["Template", "Description", "Actions"] as const;

/** The template catalog, in the same table shape as PlatformsTable — a
 *  sibling admin-CRUD surface, not a new pattern. */
export function TemplatesTable({
  templates,
  onEdit,
  onDelete,
}: {
  templates: ContentTemplate[];
  onEdit: (template: ContentTemplate) => void;
  onDelete: (template: ContentTemplate) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/15">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03]">
              {HEADERS.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className={`px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-on-surface-variant ${
                    header === "Actions" ? "text-right" : ""
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {templates.length === 0 ? (
              <tr>
                <td colSpan={HEADERS.length} className="px-4 py-14 text-center">
                  <EmptyState
                    title="No templates yet"
                    description="Add a template so the Post wizard has a starting point to offer."
                  />
                </td>
              </tr>
            ) : (
              templates.map((template) => {
                const Icon = iconFor(template.iconKey);
                return (
                  <tr key={template.id} className="border-b border-white/[0.06] transition-colors last:border-b-0 hover:bg-white/[0.04]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-[14px] font-semibold text-on-surface">{template.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="max-w-md text-[12px] text-on-surface-variant">{template.description}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <IconButton label={`Edit ${template.label}`} onClick={() => onEdit(template)}>
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                        <IconButton label={`Delete ${template.label}`} onClick={() => onDelete(template)}>
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
