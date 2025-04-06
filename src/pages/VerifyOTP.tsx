
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ShoppingBag } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [tempUser, setTempUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('tempUser');
    if (!userData) {
      toast.error("No user found. Please register first.");
      navigate('/register');
      return;
    }
    
    setTempUser(JSON.parse(userData));
    
    // Countdown timer for resend OTP
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, [navigate]);

  const handleVerify = () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    
    setIsLoading(true);
    
    // This would be replaced with actual API call in a real app
    setTimeout(() => {
      // Simulate successful verification
      const user = {
        ...tempUser,
        verified: true,
      };
      localStorage.removeItem('tempUser');
      localStorage.setItem('user', JSON.stringify(user));
      toast.success("Email verified successfully!");
      navigate('/dashboard');
      setIsLoading(false);
    }, 1500);
  };

  const handleResendOTP = () => {
    if (countdown > 0) return;
    
    toast.info("New OTP has been sent to your email.");
    setCountdown(60);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mall-light p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-mall-primary p-3 rounded-full">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
          <CardDescription>
            We've sent a 6-digit verification code to {tempUser?.email || "your email"}. 
            Enter the code below to confirm your email address.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              value={otp}
              onChange={setOtp}
              maxLength={6}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>
          
          <Button 
            onClick={handleVerify} 
            className="w-full bg-mall-primary hover:bg-mall-dark"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Didn't receive the code?{" "}
              <button
                onClick={handleResendOTP}
                disabled={countdown > 0}
                className={`text-mall-primary font-medium ${
                  countdown > 0 ? "opacity-50 cursor-not-allowed" : "hover:underline"
                }`}
              >
                Resend
              </button>
              {countdown > 0 && <span className="text-gray-500"> in {countdown}s</span>}
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="justify-center">
          <p className="text-xs text-gray-500 text-center">
            By verifying your email, you're creating a MallChat account, and you agree to MallChat's{" "}
            <a href="/terms" className="text-mall-primary hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="/privacy" className="text-mall-primary hover:underline">Privacy Policy</a>.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyOTP;
