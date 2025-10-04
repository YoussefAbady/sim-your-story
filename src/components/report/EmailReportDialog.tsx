import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendEmail: (email: string, allowContact: boolean) => Promise<void>;
}

export const EmailReportDialog = ({ open, onOpenChange, onSendEmail }: EmailReportDialogProps) => {
  const [email, setEmail] = useState("");
  const [allowContact, setAllowContact] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onSendEmail(email, allowContact);
      toast({
        title: "Email sent!",
        description: "Your pension report has been sent to your email.",
      });
      onOpenChange(false);
      setEmail("");
      setAllowContact(false);
    } catch (error) {
      toast({
        title: "Failed to send email",
        description: "Please try again later or download the report instead.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Email Your Report</DialogTitle>
          <DialogDescription>
            Enter your email address to receive a copy of your pension forecast report.
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
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Send Report
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
