import { loginSchema } from "@weiqing/shared";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button, Card, Input } from "../../src/components/base";
import { ErrorView } from "../../src/components/feedback";
import { PageShell } from "../../src/components/layout";
import { saveAuthSession, useLoginMutation } from "../../src/features/auth/auth.hooks";
import { routes } from "../../src/services";
import { colors, spacing, typography } from "../../src/styles";

export default function LoginRoute() {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit() {
    setFormError(null);
    const parsed = loginSchema.safeParse({
      email: email.trim(),
      password
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Enter a valid email and password.");
      return;
    }

    try {
      const session = await loginMutation.mutateAsync({
        ...parsed.data,
        deviceName: "Expo Mobile"
      });
      await saveAuthSession(session);
      router.replace(routes.home);
    } catch (error) {
      setFormError(getErrorMessage(error, "Login failed. Check your email and password."));
    }
  }

  return (
    <PageShell title="Welcome back" description="Sign in to keep today's record close.">
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
            <Text style={styles.label}>Password</Text>
            <Input
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              secureTextEntry
              textContentType="password"
              value={password}
            />
          </View>

          {formError ? <ErrorView message={formError} /> : null}

          <Button disabled={loginMutation.isPending} onPress={handleSubmit}>
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </View>
      </Card>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push(routes.register)}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>Create an account</Text>
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
