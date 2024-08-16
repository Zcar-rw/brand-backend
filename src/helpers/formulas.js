export default function calculateIncome(cost) {
    const profitMargin = cost * 0.13;
    const withHoldingTax = (cost - profitMargin) * 0.15;
    const driverIncome = cost - profitMargin - withHoldingTax;
    const VAT = profitMargin * 0.18;
    const localNetIncome = profitMargin - VAT;
  
    return {
      profitMargin,
      withHoldingTax,
      driverIncome,
      VAT,
      localNetIncome,
    };
}
  