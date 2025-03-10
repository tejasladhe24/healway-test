import { AuthForm } from "@/core/components/form/auth-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";

export default async function AuthPage() {
  return (
    <Card className="flex flex-col w-full">
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Login to Healway</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <AuthForm />
      </CardContent>
      <CardFooter />
    </Card>
  );
}
