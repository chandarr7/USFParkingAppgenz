import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth2";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Payment } from "@shared/schema";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { CreditCard, Wallet } from 'lucide-react';
import Layout from '@/components/Layout';
import { DataTable } from '@/components/DataTable';

// Create a schema for payment CRUD operations
const paymentSchema = z.object({
  id: z.number().optional(),
  user_id: z.number(),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  payment_method: z.enum(["credit_card", "wallet"]),
  payment_status: z.enum(["succeeded", "pending", "failed"]),
  stripe_payment_intent_id: z.string().optional().nullable(),
  last_four: z.string().max(4).optional().nullable(),
  card_brand: z.string().optional().nullable()
});

type PaymentSchemaType = z.infer<typeof paymentSchema>;

const PaymentHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await apiRequest('GET', `/api/payments?userId=${user.id}`);
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch payment history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <Badge className="bg-green-500">Succeeded</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4 mr-2" />;
      case 'wallet':
        return <Wallet className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  const handleAddPayment = async (data: PaymentSchemaType) => {
    const response = await apiRequest('POST', '/api/payments', data);
    if (!response.ok) {
      throw new Error('Failed to add payment');
    }
    
    fetchPayments();
  };

  const handleUpdatePayment = async (id: number, data: PaymentSchemaType) => {
    const response = await apiRequest('PUT', `/api/payments/${id}`, data);
    if (!response.ok) {
      throw new Error('Failed to update payment');
    }
    
    fetchPayments();
  };

  const handleDeletePayment = async (id: number) => {
    const response = await apiRequest('DELETE', `/api/payments/${id}`);
    if (!response.ok) {
      throw new Error('Failed to delete payment');
    }
    
    fetchPayments();
  };

  const columns = [
    {
      id: 'date',
      header: 'Date',
      accessorKey: (payment: Payment) => (
        <>
          {new Date(payment.transaction_date).toLocaleDateString()}{' '}
          <span className="text-xs text-muted-foreground">
            ({formatDistanceToNow(new Date(payment.transaction_date), { addSuffix: true })})
          </span>
        </>
      ),
    },
    {
      id: 'amount',
      header: 'Amount',
      accessorKey: 'amount' as keyof Payment,
      cell: ({ row }: { row: Payment }) => (
        <span className="font-medium">${row.amount.toFixed(2)}</span>
      ),
    },
    {
      id: 'paymentMethod',
      header: 'Method',
      accessorKey: 'payment_method' as keyof Payment,
      cell: ({ row }: { row: Payment }) => (
        <div className="flex items-center">
          {getPaymentMethodIcon(row.payment_method)}
          {row.payment_method === 'credit_card' 
            ? `Card ${row.card_brand ? row.card_brand : ''} ${row.last_four ? '•••• ' + row.last_four : ''}` 
            : 'USF Wallet'}
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'payment_status' as keyof Payment,
      cell: ({ row }: { row: Payment }) => getStatusBadge(row.payment_status),
    },
    {
      id: 'details',
      header: 'Details',
      accessorKey: 'stripe_payment_intent_id' as keyof Payment,
      cell: ({ row }: { row: Payment }) => (
        row.stripe_payment_intent_id ? (
          <span className="text-xs text-muted-foreground">
            ID: {row.stripe_payment_intent_id.substring(0, 10)}...
          </span>
        ) : (
          '-'
        )
      ),
    },
  ];

  if (!user) {
    return (
      <Layout>
        <div className="container py-10">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Payment History</CardTitle>
              <CardDescription>Please log in to view your payment history</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Payment History</CardTitle>
            <CardDescription>View, add, edit, and delete your payment records</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <DataTable
                data={payments}
                columns={columns}
                title="Payment"
                schema={paymentSchema}
                onAdd={handleAddPayment}
                onUpdate={handleUpdatePayment}
                onDelete={handleDeletePayment}
                onRefresh={fetchPayments}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PaymentHistory;