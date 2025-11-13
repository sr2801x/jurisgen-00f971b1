import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyType, state, industry } = await req.json();

    console.log('Generating checklist for:', { companyType, state, industry });

    // Placeholder AI-generated compliance checklist
    // In production, this would call OpenAI GPT-4 or similar
    const checklist = [
      {
        category: "Business Registrations",
        title: "Company Registration",
        description: `Register your ${companyType} with the Ministry of Corporate Affairs (MCA) or Registrar of Companies.`,
        priority: "High"
      },
      {
        category: "Business Registrations",
        title: "GST Registration",
        description: `Obtain Goods and Services Tax (GST) registration if annual turnover exceeds ₹40 lakhs (₹20 lakhs for special category states).`,
        priority: "High"
      },
      {
        category: "Business Registrations",
        title: "Professional Tax Registration",
        description: `Register for Professional Tax in ${state} if you employ staff or earn above the threshold.`,
        priority: "Medium"
      },
      {
        category: "Tax Compliance",
        title: "PAN and TAN Registration",
        description: "Obtain Permanent Account Number (PAN) and Tax Deduction and Collection Account Number (TAN) from the Income Tax Department.",
        priority: "High"
      },
      {
        category: "Tax Compliance",
        title: "Income Tax Returns",
        description: "File annual income tax returns by the due date (typically July 31st for companies).",
        priority: "High"
      },
      {
        category: "Tax Compliance",
        title: "GST Returns",
        description: "File monthly/quarterly GST returns (GSTR-1, GSTR-3B) depending on turnover.",
        priority: "High"
      },
      {
        category: "Labor Laws",
        title: "Provident Fund Registration",
        description: "Register for Employee Provident Fund (EPF) if you have 20 or more employees.",
        priority: "Medium"
      },
      {
        category: "Labor Laws",
        title: "ESI Registration",
        description: "Register for Employee State Insurance (ESI) if you have 10 or more employees earning below ₹21,000/month.",
        priority: "Medium"
      },
      {
        category: "Labor Laws",
        title: "Shops and Establishments Act",
        description: `Obtain registration under the ${state} Shops and Establishments Act.`,
        priority: "High"
      },
      {
        category: "Industry-Specific Compliance",
        title: `${industry} Licenses`,
        description: `Obtain necessary licenses and permits specific to the ${industry} industry in ${state}.`,
        priority: "High"
      },
      {
        category: "Industry-Specific Compliance",
        title: "Environmental Clearances",
        description: "Obtain necessary environmental clearances if your business has environmental impact (manufacturing, construction, etc.).",
        priority: industry === "Manufacturing" ? "High" : "Low"
      },
      {
        category: "Annual Filings",
        title: "Annual Return Filing",
        description: "File annual returns with the MCA (Form AOC-4 and MGT-7 for companies).",
        priority: "High"
      },
      {
        category: "Annual Filings",
        title: "Annual General Meeting",
        description: "Conduct Annual General Meeting (AGM) within 6 months of financial year end.",
        priority: "Medium"
      },
      {
        category: "Data Protection",
        title: "Privacy Policy",
        description: "Create and publish a privacy policy compliant with Indian data protection laws and IT Act.",
        priority: industry === "Technology / IT Services" || industry === "E-commerce / Retail" ? "High" : "Medium"
      },
      {
        category: "Contracts & Agreements",
        title: "Employment Agreements",
        description: "Draft employment agreements, offer letters, and appointment letters for all employees.",
        priority: "High"
      },
      {
        category: "Contracts & Agreements",
        title: "Non-Disclosure Agreements",
        description: "Create NDAs for employees, contractors, and business partners to protect confidential information.",
        priority: "Medium"
      }
    ];

    return new Response(
      JSON.stringify({ checklist }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-checklist function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
