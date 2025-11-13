import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const companyTypes = [
  "Private Limited Company",
  "Limited Liability Partnership (LLP)",
  "Sole Proprietorship",
  "Partnership Firm",
  "One Person Company (OPC)",
];

const states = [
  "Delhi",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "West Bengal",
  "Uttar Pradesh",
  "Rajasthan",
  "Telangana",
  "Kerala",
];

const industries = [
  "Technology / IT Services",
  "Finance / Banking",
  "Manufacturing",
  "Healthcare",
  "E-commerce / Retail",
  "Education",
  "Real Estate",
  "Food & Beverage",
  "Consulting",
  "Other Services",
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [companyType, setCompanyType] = useState("");
  const [state, setState] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateChecklist = async () => {
    if (!companyType || !state || !industry) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in");
        return;
      }

      // Call the edge function to generate checklist
      const { data, error } = await supabase.functions.invoke("generate-checklist", {
        body: { companyType, state, industry },
      });

      if (error) throw error;

      // Save to database
      const { data: checklist, error: dbError } = await supabase
        .from("compliance_checklists")
        .insert({
          user_id: user.id,
          company_type: companyType,
          state: state,
          industry: industry,
          checklist_data: data.checklist,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast.success("Compliance checklist generated!");
      navigate(`/checklist/${checklist.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to generate checklist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">Generate Compliance Checklist</h1>
        <p className="text-muted-foreground mb-8">
          Tell us about your company and we'll create a personalized compliance checklist
        </p>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Fill in the details to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company-type">Company Type</Label>
              <Select value={companyType} onValueChange={setCompanyType}>
                <SelectTrigger id="company-type">
                  <SelectValue placeholder="Select company type" />
                </SelectTrigger>
                <SelectContent>
                  {companyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleGenerateChecklist}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Compliance Checklist"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
