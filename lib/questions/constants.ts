export const STAGE_CODE_TO_NAME: Record<string, string> = {
  phone_screen: "Phone Screen",
  hr: "HR",
  technical: "Technical",
  hm_interview: "HM Interview",
  final_round: "Final Round",
};

export const STAGE_NAME_TO_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(STAGE_CODE_TO_NAME).map(([code, name]) => [name, code]),
);
