import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSpaces } from "@/contexts/SpacesContext";
import { useAuth } from "@/contexts/AuthContext";
import type { SpaceFormData } from "@/contexts/SpacesContext";
import SpaceCard from "@/components/SpaceCard";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import CreateSpaceWizard from "@/components/CreateSpaceWizard";
import CreateBusinessSpaceWizard from "@/components/CreateBusinessSpaceWizard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import RecommendedSpaces from "@/components/RecommendedSpaces";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Spaces = () => {
  const { spaces, activeSpace, loading, createSpace, updateSpace, deleteSpace, switchSpace } = useSpaces();
  const { profile } = useAuth();
  const isBusiness = profile?.account_type === "business";
  const navigate = useNavigate();
  const { toast } = useToast();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleTap = async (spaceId: string) => {
    await switchSpace(spaceId);
    navigate("/feed");
  };

  const openEdit = (spaceId: string) => {
    setSelectedSpaceId(spaceId);
    setEditOpen(true);
  };

  const openDelete = (spaceId: string) => {
    setSelectedSpaceId(spaceId);
    setDeleteOpen(true);
  };

  const handleCreate = async (data: SpaceFormData) => {
    setSaving(true);
    try {
      await createSpace(data);
      setCreateOpen(false);
      toast({ title: "Space created", description: `"${data.name}" is now your active space.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (data: SpaceFormData) => {
    if (!selectedSpaceId) return;
    setSaving(true);
    try {
      await updateSpace(selectedSpaceId, data);
      setEditOpen(false);
      toast({ title: "Space updated" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSpaceId) return;
    try {
      await deleteSpace(selectedSpaceId);
      setDeleteOpen(false);
      toast({ title: "Space deleted" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const editingSpace = selectedSpaceId ? spaces.find((s) => s.id === selectedSpaceId) : null;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader />
      <main className="mx-auto max-w-lg px-5 pt-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-2xl font-bold text-foreground">My Spaces</h1>
          <Button size="sm" variant="outline" className="rounded-full gap-1.5" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {spaces.map((space, i) => (
            <motion.div
              key={space.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <SpaceCard
                id={space.id}
                name={space.name}
                emoji={space.emoji}
                personaType={space.persona_type}
                city={space.city}
                isActive={activeSpace?.id === space.id}
                onTap={() => handleTap(space.id)}
                onEdit={() => openEdit(space.id)}
                onDelete={() => openDelete(space.id)}
              />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: spaces.length * 0.05 }}
          >
            <button
              onClick={() => setCreateOpen(true)}
              className="flex h-full min-h-[140px] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
            >
              <Plus className="h-6 w-6" />
              <span className="text-sm font-medium">New Space</span>
            </button>
          </motion.div>
        </div>

        <RecommendedSpaces
          onAdd={handleCreate}
          existingNames={spaces.map((s) => s.name)}
        />
      </main>

      <BottomNav />

      {/* Create Dialog - Multi-step wizard */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create a new space</DialogTitle>
            <DialogDescription>{isBusiness ? "Set up a new business space." : "Personalize your law feed based on your real circumstances."}</DialogDescription>
          </DialogHeader>
          {isBusiness ? (
            <CreateBusinessSpaceWizard onComplete={handleCreate} onCancel={() => setCreateOpen(false)} saving={saving} />
          ) : (
            <CreateSpaceWizard onComplete={handleCreate} onCancel={() => setCreateOpen(false)} saving={saving} />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog - Multi-step wizard */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit space</DialogTitle>
            <DialogDescription>Update the details of this space.</DialogDescription>
          </DialogHeader>
          {editingSpace && (
            isBusiness ? (
              <CreateBusinessSpaceWizard
                onComplete={handleUpdate}
                onCancel={() => setEditOpen(false)}
                saving={saving}
                initialData={{
                  name: editingSpace.name,
                  city: editingSpace.city || undefined,
                  company_size: editingSpace.company_size || undefined,
                  business_type: editingSpace.business_type || undefined,
                  employee_roles: editingSpace.employee_roles || undefined,
                  regulatory_concerns: editingSpace.regulatory_concerns || undefined,
                  revenue_model: editingSpace.revenue_model || undefined,
                  contracts_affected: editingSpace.contracts_affected || undefined,
                  key_concerns: editingSpace.key_concerns || undefined,
                  custom_instructions: editingSpace.custom_instructions || undefined,
                }}
              />
            ) : (
              <CreateSpaceWizard
                onComplete={handleUpdate}
                onCancel={() => setEditOpen(false)}
                saving={saving}
                initialData={{
                  name: editingSpace.name,
                  emoji: editingSpace.emoji || undefined,
                  city: editingSpace.city || undefined,
                  bundesland: editingSpace.bundesland || undefined,
                  primary_roles: editingSpace.primary_roles || undefined,
                  housing_situation: editingSpace.housing_situation || undefined,
                  work_study_status: editingSpace.work_study_status || undefined,
                  key_concerns: editingSpace.key_concerns || undefined,
                  income_level: editingSpace.income_level || undefined,
                  custom_instructions: editingSpace.custom_instructions || undefined,
                }}
              />
            )
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this space?</AlertDialogTitle>
            <AlertDialogDescription>
              {spaces.length <= 1
                ? "You can't delete your only space. Create another one first."
                : "This action cannot be undone. The space and its settings will be permanently removed."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {spaces.length > 1 && (
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Spaces;
