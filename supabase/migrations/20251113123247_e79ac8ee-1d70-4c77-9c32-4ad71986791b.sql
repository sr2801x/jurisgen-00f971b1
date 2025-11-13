-- Create compliance_checklists table
CREATE TABLE public.compliance_checklists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_type TEXT NOT NULL,
  state TEXT NOT NULL,
  industry TEXT NOT NULL,
  checklist_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.compliance_checklists ENABLE ROW LEVEL SECURITY;

-- Create policies for compliance_checklists
CREATE POLICY "Users can view their own checklists"
ON public.compliance_checklists
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own checklists"
ON public.compliance_checklists
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checklists"
ON public.compliance_checklists
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own checklists"
ON public.compliance_checklists
FOR DELETE
USING (auth.uid() = user_id);

-- Create reminders table
CREATE TABLE public.reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checklist_id UUID REFERENCES public.compliance_checklists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Create policies for reminders
CREATE POLICY "Users can view their own reminders"
ON public.reminders
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reminders"
ON public.reminders
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders"
ON public.reminders
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders"
ON public.reminders
FOR DELETE
USING (auth.uid() = user_id);