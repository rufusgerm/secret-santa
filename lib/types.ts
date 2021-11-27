import { Prisma } from "@prisma/client";

export const santaId = Prisma.validator<Prisma.SantaSelect>()({
  id: true,
});

export type SantaIdOnly = Prisma.SantaGetPayload<{
  select: typeof santaId;
}>;

export const santaFamilyDetail = {
  family: {
    select: {
      id: true,
      name: true,
      Questions: {
        select: {
          id: true,
          text: true,
        },
      },
    },
  },
  santa_is_admin: true,
};

export const santaDetail = Prisma.validator<Prisma.SantaSelect>()({
  id: true,
  first_name: true,
  coupled_with_id: true,
  SantasOnFamilies: {
    select: santaFamilyDetail,
  },
});

export type SantaInfo = Prisma.SantaGetPayload<{
  select: typeof santaDetail;
}>;

export const familyId = Prisma.validator<Prisma.FamilySelect>()({
  id: true,
});

export type FamilyIdOnly = Prisma.SantaGetPayload<{
  select: typeof familyId;
}>;

export const santaOnFamily = {
  santa_id: true,
  santa: {
    select: {
      first_name: true,
      last_name: true,
      Answers: {
        select: {
          id: true,
          text: true,
          question_id: true,
        },
      },
    },
  },
  santa_is_admin: true,
};

export const familyDetail = Prisma.validator<Prisma.FamilySelect>()({
  id: true,
  name: true,
  rules: true,
  Questions: {
    select: {
      id: true,
      text: true,
    },
  },
  SantasOnFamilies: {
    select: santaOnFamily,
  },
});

export type FamilyInfo = Prisma.FamilyGetPayload<{
  select: typeof familyDetail;
}>;

export const questionDetail = Prisma.validator<Prisma.QuestionSelect>()({
  id: true,
  text: true,
  family_id: true,
});

export type QuestionInfo = Prisma.QuestionGetPayload<{
  select: typeof questionDetail;
}>;

export const answerDetail = Prisma.validator<Prisma.AnswerSelect>()({
  id: true,
  text: true,
  question: {
    select: {
      id: true,
      family_id: true,
      text: true,
    },
  },
  santa_id: true,
});

export type AnswerInfo = Prisma.AnswerGetPayload<{
  select: typeof answerDetail;
}>;

export const tempAcctDetail = Prisma.validator<Prisma.TempAccountSelect>()({
  email: true,
  verification_code: true,
  invite_via_family_id: true,
});

export type TempAcctInfo = Prisma.TempAccountGetPayload<{
  select: typeof tempAcctDetail;
}>;

export const santaOnFamilyInviteSelect =
  Prisma.validator<Prisma.SantasOnFamiliesSelect>()({
    family_id: true,
    santa_id: true,
  });

export type SantaOnFamilyInfo = Prisma.SantasOnFamiliesGetPayload<{
  select: typeof santaOnFamilyInviteSelect;
}>;

export type EndpointResponse<T, U = undefined, V = undefined> = {
  status: number;
} & (U extends undefined
  ? { payload: string | T }
  : V extends undefined
  ? { payload: string | T | U }
  : { payload: string | T | U | V });
