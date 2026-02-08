
-- Create the Vault table
create table if not exists public.vault (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null default auth.uid(),
  
  account_name text not null,
  group_name text default 'Work',
  username text,
  email text,
  phone_no text,
  
  -- Encrypted Fields
  encrypted_password text not null,
  security_question text,
  security_answer text,

  is_favorite boolean default false
);

-- Enable RLS
alter table public.vault enable row level security;

-- Policies
create policy "Users can view their own vault items."
  on public.vault for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own vault items."
  on public.vault for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own vault items."
  on public.vault for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own vault items."
  on public.vault for delete
  using ( auth.uid() = user_id );
