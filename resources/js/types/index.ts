export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    role: 'student' | 'employee' | 'businessman' | 'admin';
}

export interface Account {
    id: number;
    user_id: number;
    name: string;
    type: string;
    financial_institution_id?: number | null;
    account_number?: string | null;
    balance: string;
    currency: string;
    status: string;
    notes?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Transaction {
    id: number;
    user_id: number;
    account_id: number;
    to_account_id?: number | null;
    type: 'income' | 'expense' | 'transfer';
    amount: string;
    currency: string;
    category_id?: number | null;
    description?: string | null;
    notes?: string | null;
    transaction_date: string;
    status: string;
    receipt_path?: string | null;
    is_recurring: boolean;
    recurring_frequency?: string | null;
    recurring_end_date?: string | null;
    created_at: string;
    updated_at: string;
    account?: Account;
    to_account?: Account;
    category?: Category;
    tags?: Tag[];
}

export interface Category {
    id: number;
    user_id?: number | null;
    name: string;
    type: 'income' | 'expense';
    icon?: string | null;
    color?: string | null;
    parent_id?: number | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    parent?: Category;
    children?: Category[];
}

export interface Tag {
    id: number;
    user_id: number;
    name: string;
    color?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Budget {
    id: number;
    user_id: number;
    name: string;
    period_type: 'monthly' | 'yearly';
    year: number;
    month?: number | null;
    total_amount: string;
    currency: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    categories?: BudgetCategory[];
}

export interface BudgetCategory {
    id: number;
    budget_id: number;
    category_id: number;
    allocated_amount: string;
    spent_amount: string;
    created_at: string;
    updated_at: string;
    category?: Category;
}

export interface FinancialGoal {
    id: number;
    user_id: number;
    name: string;
    description?: string | null;
    target_amount: string;
    current_amount: string;
    currency: string;
    target_date?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface Bank {
    id: number;
    name: string;
    code?: string | null;
    country: string;
    logo?: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface MobileBankingService {
    id: number;
    name: string;
    logo?: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface FinancialInstitution {
    id: number;
    name: string;
    type: 'bank' | 'mobile_banking';
    code?: string | null;
    country: string;
    logo?: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface DashboardSummary {
    total_income: number;
    total_expense: number;
    net_balance: number;
    savings_rate: number;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    ziggy: {
        url: string;
        port: number | null;
        host: string;
        defaults: Record<string, string>;
        routes: Record<string, { uri: string; methods: string[]; bindings?: Record<string, string>; parameters?: Record<string, string> }>;
    };
    flash: {
        success?: string;
        error?: string;
    };
};

export interface SharedProps extends PageProps {
    auth: {
        user: User;
    };
}

declare global {
    function route(name?: string, params?: any, absolute?: boolean): string;
}
