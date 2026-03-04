export interface PropertyAgent {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Property {
    id: string;
    agentId: string;
    address: string;
    city: string;
    state: string;
    zip: string;
}

export interface Family {
    id: string;
    familyName: string;
}

export interface Tenant {
    id: string;
    propertyId: string;
    familyId: string;
    firstName: string;
    lastName: string;
}

export enum NoteType {
    Maintenance = 'Maintenance',
    PestControl = 'Pest Control',
    Inspection = 'Inspection',
    Other = 'Other'
}

export interface NoteReminder {
    id: string;
    agentId: string;
    propertyId: string | null;
    type: NoteType;
    description: string;
    dueDate: Date;
}

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
}
