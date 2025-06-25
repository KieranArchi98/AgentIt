-- Create profiles table if not exists
create table if not exists public.profiles (
  id uuid not null references auth.users(id) on delete cascade,
  username text not null,
  avatar_url text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint profiles_pkey primary key (id),
  constraint profiles_username_key unique (username)
);

-- Ensure extensions are available
create extension if not exists "uuid-ossp" with schema extensions;

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Drop existing policies if any
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Anyone can insert a profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can create their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Create function to handle updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for updated_at
drop trigger if exists handle_profiles_updated_at on public.profiles;
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row
  execute procedure public.handle_updated_at();

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant all on public.profiles to authenticated;

-- Create a function to automatically create a profile after signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

-- Create a trigger to call handle_new_user after signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create function to handle user deletion
CREATE OR REPLACE FUNCTION handle_deleted_user()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM profiles WHERE id = old.id;
  RETURN old;
END;
$$ language plpgsql security definer;

-- Create trigger for user deletion
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_deleted_user(); 