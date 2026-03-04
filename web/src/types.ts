export const NoteType = {
    Maintenance: 'Maintenance',
    PestControl: 'Pest Control',
    Inspection: 'Inspection',
    Other: 'Other'
}

export interface Tenant {
    id: string;
    propertyId: string;
    familyId: string;
    firstName: string;
    lastName: string;
    familyName?: string;
}

export interface Property {
    id: string;
    agentId: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    tenants?: Tenant[];
    tenantCount?: number;
}

export interface NoteReminder {
    id: string;
    agentId: string;
    propertyId: string | null;
    type: string;
    description: string;
    dueDate: string | Date;
}

export interface PropertyAgent {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    agentNotes?: string;
    properties?: Property[];
    notes?: NoteReminder[];
    propertyCount?: number;
    noteCount?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
}
