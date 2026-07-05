import { useState, useEffect } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const isBusiness = searchParams.get("plan") === "business";
  const { signUp, signOut, session, loading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);
  const [voucher, setVoucher] = useState("");
  const [voucherError, setVoucherError] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  // If user arrives at /signup while already logged in, sign them out
  useEffect(() => {
    if (!loading && session && !signingOut) {
      setSigningOut(true);
      signOut().finally(() => setSigningOut(false));
    }
  }, [loading, session]);

  if (loading || signingOut) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const isValidEmail = (email: string) => {
    // Must have user@domain.tld with a real-looking domain
    const re = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!re.test(email)) return false;
    const domain = email.split("@")[1];
    // Reject obviously fake TLDs or domains like test@test.test
    if (/^(.)\1*$/.test(domain.replace(/\./g, ""))) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isValidEmail(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await signUp(email.trim(), password, fullName || undefined, isBusiness ? "business" : "citizen");
      setSuccess(true);
    } catch (err: any) {
      if (err.message?.includes("already registered")) {
        setError("An account with this email already exists.");
      } else {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-5">
        <div className="w-full max-w-sm text-center">
          <Link to="/" className="mb-10 block font-serif text-2xl font-bold text-foreground">
            Law&nbsp;Buddy
          </Link>
          <h1 className="font-serif text-xl font-bold text-foreground">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a confirmation link to <strong>{email}</strong>.
            Click it to activate your account.
          </p>
          <Link to="/login">
            <Button variant="outline" className="mt-6 rounded-md">Back to sign in</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-10 block text-center font-serif text-2xl font-bold text-foreground">
          Law&nbsp;Buddy
        </Link>

        <h1 className="font-serif text-xl font-bold text-foreground">
          {isBusiness ? "Create your business account" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isBusiness
            ? "Set up your team's regulatory intelligence hub."
            : "Get a personalized feed of laws that matter to you."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name <span className="text-muted-foreground">(optional)</span></Label>
            <Input
              id="name"
              type="text"
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full rounded-md" disabled={submitting}>
            {submitting ? "Creating account…" : "Get started"}
            {!submitting && <ArrowRight className="ml-1.5 h-4 w-4" />}
          </Button>

          {isBusiness && (
            <>
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-md"
                onClick={() => { setShowVoucher(!showVoucher); setVoucherError(""); }}
              >
                Demo Voucher
              </Button>

              {showVoucher && (
                <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-4">
                  <Label htmlFor="voucher">Enter 6-digit voucher code</Label>
                  <Input
                    id="voucher"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="123456"
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  />
                  {voucherError && <p className="text-sm text-destructive">{voucherError}</p>}
                  <Button
                    type="button"
                    className="w-full rounded-md"
                    disabled={submitting}
                    onClick={async () => {
                      setVoucherError("");
                      if (!/^\d{6}$/.test(voucher)) {
                        setVoucherError("Please enter exactly 6 digits.");
                        return;
                      }
                      if (!isValidEmail(email.trim())) {
                        setVoucherError("Please enter a valid email address above.");
                        return;
                      }
                      if (password.length < 6) {
                        setVoucherError("Please enter a password (6+ chars) above.");
                        return;
                      }
                      setSubmitting(true);
                      try {
                        await signUp(email.trim(), password, fullName || undefined, "business", true);
                        setSuccess(true);
                      } catch (err: any) {
                        if (err.message?.includes("already registered")) {
                          setVoucherError("An account with this email already exists.");
                        } else {
                          setVoucherError(err.message);
                        }
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                  >
                    {submitting ? "Redeeming…" : "Redeem & Sign Up"}
                  </Button>
                </div>
              )}
            </>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
