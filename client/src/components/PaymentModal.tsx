import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StripePaymentForm from "./StripePaymentForm";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: number;
}

const PaymentModal = ({
  isOpen,
  onClose,
  onConfirm,
  amount,
}: PaymentModalProps) => {
  const [activeTab, setActiveTab] = useState<string>("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleWalletPayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing for USF Wallet
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Payment Successful",
      description: `$${amount.toFixed(2)} has been charged to your USF Wallet`,
      variant: "default",
    });
    
    setIsProcessing(false);
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="credit-card" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="credit-card">Credit Card</TabsTrigger>
            <TabsTrigger value="wallet">USF Wallet</TabsTrigger>
          </TabsList>

          <TabsContent value="credit-card" className="pt-4">
            {/* Real Stripe Credit Card Processing */}
            <StripePaymentForm 
              amount={amount} 
              onComplete={onConfirm}
            />
          </TabsContent>

          <TabsContent value="wallet" className="pt-4">
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center space-x-4 mb-4">
                  <Wallet className="w-8 h-8 text-[#006747]" />
                  <div>
                    <h3 className="font-medium">USF Wallet</h3>
                    <p className="text-sm text-neutral-600">Pay using your campus account</p>
                  </div>
                </div>

                <div className="bg-neutral-50 p-4 rounded-md">
                  <div className="flex justify-between">
                    <span className="text-sm">Current Balance:</span>
                    <span className="font-semibold">$125.00</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm">After Payment:</span>
                    <span className="font-semibold">${(125 - amount).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button
                    type="button"
                    className="bg-[#006747] hover:bg-[#00543a]"
                    onClick={handleWalletPayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center">
                        Processing <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-50 border-t-transparent"></span>
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Pay ${amount.toFixed(2)} <Check className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;