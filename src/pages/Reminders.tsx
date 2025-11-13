import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Plus, Check } from "lucide-react";
import { toast } from "sonner";

interface Reminder {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  completed: boolean;
  created_at: string;
}

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    due_date: "",
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .order("due_date", { ascending: true });

      if (error) throw error;

      setReminders(data || []);
    } catch (error: any) {
      toast.error("Failed to load reminders");
    } finally {
      setLoading(false);
    }
  };

  const handleAddReminder = async () => {
    if (!newReminder.title || !newReminder.due_date) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in");
        return;
      }

      const { error } = await supabase.from("reminders").insert({
        user_id: user.id,
        title: newReminder.title,
        description: newReminder.description || null,
        due_date: newReminder.due_date,
      });

      if (error) throw error;

      toast.success("Reminder added!");
      setNewReminder({ title: "", description: "", due_date: "" });
      setDialogOpen(false);
      fetchReminders();
    } catch (error: any) {
      toast.error(error.message || "Failed to add reminder");
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("reminders")
        .update({ completed: !completed })
        .eq("id", id);

      if (error) throw error;

      toast.success(completed ? "Reminder marked as incomplete" : "Reminder completed!");
      fetchReminders();
    } catch (error: any) {
      toast.error("Failed to update reminder");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isPastDue = (dateString: string) => {
    return new Date(dateString) < new Date() && new Date(dateString).toDateString() !== new Date().toDateString();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading reminders...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reminders</h1>
            <p className="text-muted-foreground mt-2">
              Keep track of important compliance deadlines
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Reminder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Reminder</DialogTitle>
                <DialogDescription>
                  Set a reminder for an important compliance deadline
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., File Annual Return"
                    value={newReminder.title}
                    onChange={(e) =>
                      setNewReminder({ ...newReminder, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Additional details..."
                    value={newReminder.description}
                    onChange={(e) =>
                      setNewReminder({ ...newReminder, description: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={newReminder.due_date}
                    onChange={(e) =>
                      setNewReminder({ ...newReminder, due_date: e.target.value })
                    }
                  />
                </div>
                <Button className="w-full" onClick={handleAddReminder}>
                  Add Reminder
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {reminders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reminders yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first reminder to track compliance deadlines
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Reminder
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <Card
                key={reminder.id}
                className={`shadow-card ${
                  reminder.completed ? "opacity-60" : ""
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() =>
                          handleToggleComplete(reminder.id, reminder.completed)
                        }
                        className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          reminder.completed
                            ? "bg-primary border-primary"
                            : "border-muted-foreground hover:border-primary"
                        }`}
                      >
                        {reminder.completed && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </button>
                      <div className="flex-1">
                        <CardTitle
                          className={`text-lg ${
                            reminder.completed ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {reminder.title}
                        </CardTitle>
                        {reminder.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {reminder.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        isPastDue(reminder.due_date) && !reminder.completed
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {formatDate(reminder.due_date)}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reminders;
