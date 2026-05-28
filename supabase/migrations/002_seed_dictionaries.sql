insert into public.positions (code, name)
values
  ('all', 'All roles'),
  ('qa', 'QA Engineer'),
  ('pm', 'Project Manager'),
  ('bsa', 'BSA')
on conflict (code) do update
set name = excluded.name,
    is_active = true;

insert into public.question_types (code, name, sort_order)
values
  ('about', 'About you', 10),
  ('soft', 'STAR', 20),
  ('hard', 'Technical', 30)
on conflict (code) do update
set name = excluded.name,
    sort_order = excluded.sort_order,
    is_active = true;

insert into public.interview_stages (code, name, sort_order)
values
  ('phone_screen', 'Phone Screen', 10),
  ('hr', 'HR', 20),
  ('technical', 'Technical', 30),
  ('hm_interview', 'HM Interview', 40),
  ('final_round', 'Final Round', 50)
on conflict (code) do update
set name = excluded.name,
    sort_order = excluded.sort_order,
    is_active = true;
