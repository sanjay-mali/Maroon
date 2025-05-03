import { loadScript } from "./utils";

interface CreateOrderParams {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

interface PaymentOptions {
  name: string;
  description?: string;
  image?: string;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

// Create a Razorpay order on the server
export const createRazorpayOrder = async (params: CreateOrderParams) => {
  try {
    const response = await fetch('/api/payment/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create order');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

// Verify payment on the server
export const verifyRazorpayPayment = async (paymentData: any) => {
  try {
    const response = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Payment verification failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

// Initialize Razorpay checkout
export const initializeRazorpayCheckout = async (options: PaymentOptions): Promise<any> => {
  // Make sure Razorpay script is loaded
  await loadScript('https://checkout.razorpay.com/v1/checkout.js');
  
  return new Promise((resolve, reject) => {
    const razorpayOptions = {
      key: options.keyId,
      amount: options.amount,
      currency: options.currency,
      name: options.name,
      description: options.description || '',
      image: options.image || '',
      order_id: options.orderId,
      handler: function(response: any) {
        // This handler receives payment success callback
        resolve(response);
      },
      prefill: options.prefill || {},
      notes: {},
      theme: options.theme || { color: '#800000' }, // Maroon theme color
      modal: {
        ondismiss: function() {
          reject(new Error('Payment cancelled by user'));
        },
      },
    };

    try {
      // Initialize Razorpay checkout
      const paymentObject = new (window as any).Razorpay(razorpayOptions);
      paymentObject.open();
    } catch (error) {
      reject(error);
    }
  });
};