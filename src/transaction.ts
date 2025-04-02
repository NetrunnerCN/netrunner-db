interface TransactionField {
  source: string;
  field: string;
}

export interface Transaction {
  name: string;
  oracle_file: string;
  locale_file: string;
  oracle_id: "id" | "code" | "";
  locale_id: "id" | "code" | "";
  link_id: string;
  oracle_fields: TransactionField[];
  locale_fields: TransactionField[];
}
