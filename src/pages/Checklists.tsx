import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Checklist {
  id: string;
  company_type: string;
  state: string;
  industry: string;
  created_at: string;
}

const Checklists = () => {
  const navigate = useNavigate();
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChecklists();
  }, []);

  const fetchChecklists = async () => {
    try {
      const { data, error } = await supabase
        .from("compliance_checklists")
        .select("id, company_type, state, industry, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setChecklists(data || []);
    } catch (error: any) {
      toast.error("Failed to load checklists");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading checklists...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Your Checklists</h1>
            <p className="text-muted-foreground mt-2">
              View and manage your compliance checklists
            </p>
          </div>
          <Button onClick={() => navigate("/dashboard")}>
            Create New Checklist
          </Button>
        </div>

        {checklists.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No checklists yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first compliance checklist to get started
              </p>
              <Button onClick={() => navigate("/dashboard")}>
                Create Checklist
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {checklists.map((checklist) => (
              <Card
                key={checklist.id}
                className="cursor-pointer hover:shadow-elevated transition-shadow"
                onClick={() => navigate(`/checklist/${checklist.id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {checklist.company_type}
                  </CardTitle>
                  <CardDescription>
                    {checklist.state} • {checklist.industry}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Created on {formatDate(checklist.created_at)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Checklists;
