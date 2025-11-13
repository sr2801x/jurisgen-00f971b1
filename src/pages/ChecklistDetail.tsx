import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ChecklistItem {
  category: string;
  title: string;
  description: string;
  priority: string;
}

interface Checklist {
  id: string;
  company_type: string;
  state: string;
  industry: string;
  checklist_data: ChecklistItem[];
  created_at: string;
}

const ChecklistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchChecklist();
    }
  }, [id]);

  const fetchChecklist = async () => {
    try {
      const { data, error } = await supabase
        .from("compliance_checklists")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      // Parse the checklist_data as JSON if needed
      const parsedChecklist = {
        ...data,
        checklist_data: typeof data.checklist_data === 'string' 
          ? JSON.parse(data.checklist_data) 
          : data.checklist_data
      };

      setChecklist(parsedChecklist as Checklist);
    } catch (error: any) {
      toast.error("Failed to load checklist");
      navigate("/checklists");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!checklist) return;

    const text = `Compliance Checklist\n\nCompany Type: ${checklist.company_type}\nState: ${checklist.state}\nIndustry: ${checklist.industry}\n\n${checklist.checklist_data
      .map(
        (item) =>
          `${item.category}\n${item.title}\n${item.description}\nPriority: ${item.priority}\n`
      )
      .join("\n")}`;

    const blob = new Blob([text], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compliance-checklist-${checklist.id}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Checklist downloaded!");
  };

  const handleGenerateDocument = async () => {
    toast.info("Document generation feature coming soon!");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading checklist...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!checklist) {
    return null;
  }

  // Group items by category
  const groupedItems = checklist.checklist_data.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Compliance Checklist</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>{checklist.company_type}</span>
            <span>•</span>
            <span>{checklist.state}</span>
            <span>•</span>
            <span>{checklist.industry}</span>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <Button onClick={handleDownload} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Checklist
          </Button>
          <Button onClick={handleGenerateDocument}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Documents
          </Button>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, items]) => (
            <Card key={category} className="shadow-card">
              <CardHeader>
                <CardTitle>{category}</CardTitle>
                <CardDescription>{items.length} requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 bg-accent/50 rounded-lg"
                  >
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.description}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded ${
                          item.priority === "High"
                            ? "bg-destructive/10 text-destructive"
                            : item.priority === "Medium"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.priority} Priority
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChecklistDetail;
