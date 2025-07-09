// types/api.d.ts

/**
 * Response from GET /api/v1/balances/historic
 */
export interface HistoricBalance {
    /** ISO date string, e.g. "2025-04-23T00:00:00.000Z" */
    date: string;
    /** Total USD value at this date */
    total: number;
  }
  
  /**
   * Array of historic balance entries
   */
  export type HistoricBalanceResponse = HistoricBalance[];
  
  
  /**
   * Individual token value within an address
   */
  export interface TokenValue {
    /** Token symbol, e.g. "ADA", "SPACEBUD" */
    symbol: string;
    /** Quantity of tokens held */
    qty: number;
    /** USD value for this token position */
    totalUsd: number;
    priceUsd: number;
  }
  
  /**
   * Balance details for a single address
   */
  export interface AddressBalance {
    /** Blockchain address string */
    address: string;
    /** Total USD value for this address */
    totalUsd: number;
    /** Breakdown of token values */
    values: TokenValue[];
  }
  
  /**
   * Response from GET /api/v1/balances
   */
  export interface CurrentBalanceResponse {
    /** List of address-specific balances */
    addresses: AddressBalance[];
    /** Aggregate USD value across all addresses */
    totalUsd: number;
  }
  