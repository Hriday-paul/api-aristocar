declare module 'validate-vat' {
  interface VATValidationResult {
    isValid: boolean;
    countryCode?: string;
    vatNumber?: string;
    businessName?: string;
    address?: string;
  }

  export function validateVATNumber(
    vatNumber: string,
    countryCode?: string,
  ): Promise<VATValidationResult>;
}
