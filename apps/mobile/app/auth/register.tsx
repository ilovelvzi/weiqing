import { registerSchema } from "@weiqing/shared";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import { Button, Card, Input } from "../../src/components/base";
import { ErrorView } from "../../src/components/feedback";
import { PageShell } from "../../src/components/layout";
import { saveAuthSession, useRegisterMutation } from "../../src/features/auth/auth.hooks";
import { routes } from "../../src/services";
import { colors, spacing, typography } from "../../src/styles";

const registerFormSchema = registerSchema
  .extend({
    confirmPassword: z.string().min(8)
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
  });

export default function RegisterRoute() {
  const router = useRouter();
  const registerMutation = useRegisterMutation();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit() {
    setFormError(null);
    const parsed = registerFormSchema.safeParse({
      email: email.trim(),
      nickname: nickname.trim() || undefined,
      password,
      confirmPassword
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Check your registration details.");
      return;
    }

    try {
      const session = await registerMutation.mutateAsync({
        email: parsed.data.email,
        nickname: parsed.data.nickname,
        password: parsed.data.password
      });
      await saveAuthSession(session);
      router.replace(routes.home);
    } catch (error) {
      setFormError(getErrorMessage(error, "Registration failed. Try again later."));
    }
  }

  return (
    <PageShell title="Create account" description="Start with a quiet first step.">
      <Card>
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="you@example.com"
              textContentType="emailAddress"
              value={email}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Nickname</Text>
            <Input onChangeText={setNickname} placeholder="Optional" value={nickname} />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <Input
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              secureTextEntry
              textContentType="newPassword"
              value={password}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Confirm password</Text>
            <Input
              onChangeText={setConfirmPassword}
              placeholder="Repeat your password"
              secureTextEntry
              textContentType="newPassword"
              value={confirmPassword}
            />
          </View>

          {formError ? <ErrorView message={formError} /> : null}

          <Button disabled={registerMutation.isPending} onPress={handleSubmit}>
            {registerMutation.isPending ? "Creating..." : "Create account"}
          </Button>
        </View>
      </Card>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push(routes.login)}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>Already have an account? Sign in</Text>
      </Pressable>
    </PageShell>
  );
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md
  },
  field: {
    gap: spacing.sm
  },
  label: {
    ...typography.subheadline,
    color: colors.text,
    fontWeight: "600"
  },
  linkButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44
  },
  linkText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "600"
  }
});
