import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState("");

  // Get parameters from both URL search params and hash fragments
  const token = searchParams.get('token');
  const type = searchParams.get('type');
  const accessToken = searchParams.get('access_token') || new URLSearchParams(window.location.hash.substring(1)).get('access_token');
  const refreshToken = searchParams.get('refresh_token') || new URLSearchParams(window.location.hash.substring(1)).get('refresh_token');
  const tokenHash = searchParams.get('token_hash');
  const confirmationToken = searchParams.get('confirmation_token');
  const expiresAt = searchParams.get('expires_at') || new URLSearchParams(window.location.hash.substring(1)).get('expires_at');
  const tokenType = searchParams.get('token_type') || new URLSearchParams(window.location.hash.substring(1)).get('token_type');
  const hashType = new URLSearchParams(window.location.hash.substring(1)).get('type');

  useEffect(() => {
    // Debug: Log the URL parameters
    const allParams = Object.fromEntries(searchParams.entries());
    const hashParams = Object.fromEntries(new URLSearchParams(window.location.hash.substring(1)).entries());
    console.log('EmailConfirmation URL params:', {
      accessToken: !!accessToken,
      refreshToken: !!refreshToken,
      token: !!token,
      tokenHash: !!tokenHash,
      confirmationToken: !!confirmationToken,
      type,
      hashType,
      searchParams: allParams,
      hashParams,
      hasAnyParams: Object.keys(allParams).length > 0 || Object.keys(hashParams).length > 0,
      currentUrl: window.location.href
    });

    // If there are any URL parameters (search or hash), this is likely a confirmation callback
    if (Object.keys(allParams).length > 0 || Object.keys(hashParams).length > 0) {
      // Check if this is a Supabase email confirmation callback
      if (accessToken && refreshToken) {
        handleSupabaseCallback();
      } else if (tokenHash && type === 'signup') {
        handleTokenHashConfirmation();
      } else if (confirmationToken) {
        handleConfirmationToken();
      } else if (token && type === 'signup') {
        handleEmailConfirmation();
      } else {
        // If we have parameters but don't recognize them, try to handle as generic confirmation
        console.log('Unknown confirmation parameters, attempting generic confirmation');
        handleGenericConfirmation();
      }
    }
  }, [accessToken, refreshToken, token, tokenHash, confirmationToken, type]);

  const handleGenericConfirmation = async () => {
    setLoading(true);
    try {
      // Try to get the current session to see if user is already confirmed
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        setError(error.message);
        toast({
          title: "Confirmation failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (session?.user) {
        setConfirmed(true);
        toast({
          title: "Email confirmed!",
          description: "Your account has been successfully verified. Welcome to KnowFounders!",
        });
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError("Unable to confirm email. Please try signing up again.");
        toast({
          title: "Confirmation failed",
          description: "Unable to confirm email. Please try signing up again.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during confirmation");
      toast({
        title: "Confirmation failed",
        description: err.message || "An error occurred during confirmation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTokenHashConfirmation = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash!,
        type: 'signup'
      });

      if (error) {
        setError(error.message);
        toast({
          title: "Confirmation failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setConfirmed(true);
        toast({
          title: "Email confirmed!",
          description: "Your account has been successfully verified. Welcome to KnowFounders!",
        });
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during confirmation");
      toast({
        title: "Confirmation failed",
        description: err.message || "An error occurred during confirmation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmationToken = async () => {
    setLoading(true);
    try {
      // For confirmation token, we need to try different approaches
      // First try with just the token
      const { data, error } = await supabase.auth.verifyOtp({
        token: confirmationToken!,
        type: 'signup'
      } as any); // Type assertion to bypass the strict typing

      if (error) {
        setError(error.message);
        toast({
          title: "Confirmation failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setConfirmed(true);
        toast({
          title: "Email confirmed!",
          description: "Your account has been successfully verified. Welcome to KnowFounders!",
        });
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during confirmation");
      toast({
        title: "Confirmation failed",
        description: err.message || "An error occurred during confirmation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSupabaseCallback = async () => {
    setLoading(true);
    try {
      // Set the session with the tokens from the URL
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken!,
        refresh_token: refreshToken!,
      });

      if (error) {
        setError(error.message);
        toast({
          title: "Confirmation failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setConfirmed(true);
        toast({
          title: "Email confirmed!",
          description: "Your account has been successfully verified. Welcome to KnowFounders!",
        });
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during confirmation");
      toast({
        title: "Confirmation failed",
        description: err.message || "An error occurred during confirmation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailConfirmation = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup'
      });

      if (error) {
        setError(error.message);
        toast({
          title: "Confirmation failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setConfirmed(true);
        toast({
          title: "Email confirmed!",
          description: "Your account has been successfully verified. Welcome to KnowFounders!",
        });
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during confirmation");
      toast({
        title: "Confirmation failed",
        description: err.message || "An error occurred during confirmation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to resend the confirmation.",
        variant: "destructive",
      });
      return;
    }

    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/email-confirmation`,
        }
      });

      if (error) {
        toast({
          title: "Failed to resend",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Confirmation email sent!",
          description: "Please check your email for the confirmation link.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Failed to resend",
        description: err.message || "An error occurred while resending the email.",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  // If this is any kind of email confirmation callback or has any URL parameters
  const searchParamsObj = Object.fromEntries(searchParams.entries());
  const hashParamsObj = Object.fromEntries(new URLSearchParams(window.location.hash.substring(1)).entries());
  const hasAnyParams = Object.keys(searchParamsObj).length > 0 || Object.keys(hashParamsObj).length > 0;
  if ((accessToken && refreshToken) || (tokenHash && type === 'signup') || confirmationToken || (token && type === 'signup') || hasAnyParams) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="text-2xl font-medium text-primary">
              KnowFounders
            </Link>
          </div>

          <Card className="border-0 shadow-none bg-accent/5">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                {loading ? (
                  <Loader2 className="h-16 w-16 text-primary animate-spin" />
                ) : confirmed ? (
                  <CheckCircle className="h-16 w-16 text-green-500" />
                ) : error ? (
                  <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-500 text-2xl">✕</span>
                  </div>
                ) : null}
              </div>
              <CardTitle className="text-2xl font-medium">
                {loading ? "Confirming your email..." : confirmed ? "Email Confirmed!" : "Confirmation Failed"}
              </CardTitle>
              <CardDescription>
                {loading 
                  ? "Please wait while we verify your email address."
                  : confirmed 
                    ? "Your account has been successfully verified. Redirecting you to the homepage..."
                    : error || "There was an issue confirming your email address."
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {confirmed && (
                <Button onClick={() => navigate("/")} className="w-full">
                  Go to Homepage
                </Button>
              )}
              {error && (
                <div className="space-y-4">
                  <Button onClick={() => navigate("/signup")} variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sign Up
                  </Button>
                  <Button onClick={handleEmailConfirmation} className="w-full">
                    Try Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Default view - email sent confirmation
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-medium text-primary">
            KnowFounders
          </Link>
        </div>

        <Card className="border-0 shadow-none bg-accent/5">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Mail className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-2xl font-medium">Check Your Email</CardTitle>
            <CardDescription>
              We've sent you a confirmation link. Please check your email and click the link to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground text-center space-y-3">
              <p>Didn't receive the email? Check your spam folder.</p>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleResendConfirmation}
                  disabled={resending}
                  className="w-full"
                >
                  {resending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Resend Confirmation Email
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button onClick={() => navigate("/")} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
              <Button onClick={() => navigate("/login")}>
                Go to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailConfirmation;
