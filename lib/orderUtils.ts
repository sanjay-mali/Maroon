// Utils for handling order data in Appwrite

/**
 * Parse JSON order data from Appwrite
 * @param orderData Order data from Appwrite
 * @returns Parsed object
 */
export function parseOrderData(orderData: string | null | undefined) {
  if (!orderData) {
    return null;
  }

  if (typeof orderData === 'string') {
    try {
      return JSON.parse(orderData);
    } catch (error) {
      console.error("Error parsing order data:", error);
      return null;
    }
  }

  return orderData; // Already an object
}

/**
 * Parse items from order JSON string
 * @param itemsJson JSON string containing order items
 * @returns Array of order items
 */
export function parseOrderItems(itemsJson: string | null | undefined) {
  if (!itemsJson) {
    return [];
  }
  
  try {
    const items = JSON.parse(itemsJson);
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error("Error parsing order items:", error);
    return [];
  }
}

/**
 * Parse order shipping address from JSON
 * @param addressJson JSON string containing shipping address
 * @returns Shipping address object
 */
export function parseShippingAddress(addressJson: string | null | undefined) {
  if (!addressJson) {
    return null;
  }
  
  try {
    return JSON.parse(addressJson);
  } catch (error) {
    console.error("Error parsing shipping address:", error);
    return null;
  }
}

/**
 * Parse order payment details from JSON
 * @param paymentJson JSON string containing payment details
 * @returns Payment details object
 */
export function parsePaymentDetails(paymentJson: string | null | undefined) {
  if (!paymentJson) {
    return null;
  }
  
  try {
    return JSON.parse(paymentJson);
  } catch (error) {
    console.error("Error parsing payment details:", error);
    return null;
  }
}

/**
 * Parse order amount data from JSON
 * @param amountJson JSON string containing order amounts
 * @returns Amount details object
 */
export function parseAmountData(amountJson: string | null | undefined) {
  if (!amountJson) {
    return null;
  }
  
  try {
    return JSON.parse(amountJson);
  } catch (error) {
    console.error("Error parsing amount data:", error);
    return null;
  }
}
