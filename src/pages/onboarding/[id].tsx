import { useRouter } from "next/router";
import { SyntheticEvent } from "react";
import { api } from "~/utils/api";

function OnboardingStepPage() {
  const router = useRouter();
  const {
    query: { id },
  } = router;

  if (!id || Array.isArray(id)) return <></>;

  const step1Mut = api.user.onboardingStep1.useMutation();
  const step2Mut = api.user.onboardingStep2.useMutation();

  async function handleStep1(e: SyntheticEvent) {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      nickname: { value: string };
    };
    const nickname = target.nickname.value;

    try {
      await step1Mut.mutateAsync({ nickname });
      router.push("/onboarding/2");
    } catch (e) {
      console.error(e);
    }
  }

  async function handleStep2() {
    try {
      await step2Mut.mutateAsync();
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  }

  switch (id) {
    case "1": {
      return (
        <>
          <form onSubmit={handleStep1} method="post">
            <label htmlFor="nickname">Nickname</label>
            <input type="text" id="nickname" name="nickname" required />
            <button type="submit">Submit</button>
          </form>
        </>
      );
    }
    case "2": {
      return (
        <>
          <button onClick={handleStep2}>Agree to ToS</button>
        </>
      );
    }
  }
}

export default OnboardingStepPage;
