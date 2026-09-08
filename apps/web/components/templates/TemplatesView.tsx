"use client";

import { useState } from "react";
import type { ContentTemplate, ContentTemplateDraft } from "@/lib/templates/types";
import { useTemplates } from "@/lib/templates/store";
import { usePosts } from "@/lib/posts/store";
import { isTemplateInUse } from "@/lib/templates/derive";
import { TemplatesTable } from "./TemplatesTable";
import { TemplateFormDialog } from "./TemplateFormDialog";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PlusIcon } from "@/components/ui/icons";

export function TemplatesView() {
  const { state: templatesState, createTemplate, updateTemplate, deleteTemplate } = useTemplates();
  const { state: postsState } = usePosts();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ContentTemplate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContentTemplate | null>(null);

  const { templates } = templatesState;

  function openCreate() {
    setEditingTemplate(null);
    setFormOpen(true);
  }

  function openEdit(template: ContentTemplate) {
    setEditingTemplate(template);
    setFormOpen(true);
  }

  function handleSubmit(draft: ContentTemplateDraft) {
    if (editingTemplate) {
      updateTemplate(editingTemplate.id, draft);
    } else {
      createTemplate(draft);
    }
    setFormOpen(false);
  }

  const deleteBlocked = deleteTarget ? isTemplateInUse(deleteTarget.id, postsState.posts) : false;

  if (!templatesState.hydrated || !postsState.hydrated) {
    return <div className="min-h-full bg-background" />;
  }

  return (
    <div className="min-h-full bg-background">
      <header className="px-4 pb-6 pt-10 sm:px-16">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-semibold text-on-surface">Templates</h1>
            <p className="mt-1 text-[16px] text-on-surface-variant">
              Manage the content-type catalog the Post wizard offers.
            </p>
          </div>
          <Button variant="primary" size="md" onClick={openCreate} className="shrink-0">
            <PlusIcon className="h-4 w-4" />
            Create Template
          </Button>
        </div>
      </header>

      <main className="px-4 pb-24 sm:px-16">
        <TemplatesTable templates={templates} onEdit={openEdit} onDelete={setDeleteTarget} />
      </main>

      <TemplateFormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} editing={editingTemplate} />

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        titleId="delete-template-title"
        title={deleteBlocked ? `Can't delete ${deleteTarget?.label ?? "this template"}` : `Delete ${deleteTarget?.label ?? "this template"}?`}
        description={
          deleteBlocked
            ? "One or more posts were created from this template. Delete those posts first, or keep the template."
            : "The Post wizard will no longer offer this template. This cannot be undone."
        }
        confirmLabel={deleteBlocked ? "Understood" : "Delete template"}
        danger={!deleteBlocked}
        onConfirm={() => {
          if (!deleteTarget || deleteBlocked) return;
          deleteTemplate(deleteTarget.id);
        }}
      />
    </div>
  );
}
