import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Gift, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { clearSessionPoints } from "@/services/sessionPointsService";
import { supabase } from "@/integrations/supabase/client";
import { useGamification } from "@/contexts/GamificationContext";

interface RedeemPrizeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPoints: number;
}

export const RedeemPrizeDialog = ({ open, onOpenChange, currentPoints }: RedeemPrizeDialogProps) => {
  const [email, setEmail] = useState("");
  const [allowContact, setAllowContact] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { earnedBadges } = useGamification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Invalid email", {
        description: "Please enter a valid email address",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Save redeem record to database
      const { error: dbError } = await supabase
        .from('prize_redeems')
        .insert({
          user_email: allowContact ? email : null,
          session_points: currentPoints,
          badges_count: earnedBadges.length,
          allow_contact: allowContact,
        });

      if (dbError) {
        console.error('Error saving redeem record:', dbError);
        throw dbError;
      }
      
      toast.success("Prize redeemed!", {
        description: `Your gift for ${currentPoints} points will be sent to ${email}`,
        duration: 5000,
      });
      
      // Reset session points
      clearSessionPoints();
      
      onOpenChange(false);
      setEmail("");
      setAllowContact(false);
      
      // Reload to reflect reset session
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error("Failed to redeem prize", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Redeem Your Prize
          </DialogTitle>
          <DialogDescription>
            Convert your {currentPoints} points into an exciting gift! Enter your email to receive it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox
              id="contact"
              checked={allowContact}
              onCheckedChange={(checked) => setAllowContact(checked === true)}
              disabled={isLoading}
            />
            <Label
              htmlFor="contact"
              className="text-sm font-normal leading-tight cursor-pointer"
            >
              I agree to be contacted for support, follow-up information, or special offers related to pension planning
            </Label>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4" />
                  Redeem Prize
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};