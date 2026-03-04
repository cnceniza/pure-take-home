import { PropertyAgent, NoteType } from './types';
import { v4 as uuidv4 } from 'uuid';

class AgentStore {
    private agents: PropertyAgent[] = [];

    constructor() {
        // Seed with some initial data for testing
        this.seedData();
    }

    private seedData() {
        const agent1Id = uuidv4();
        const agent2Id = uuidv4();
        const now = new Date();

        const agent1: PropertyAgent = {
            id: agent1Id,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            mobileNumber: '1234567890',
            agentNotes: 'Senior agent with 10 years experience in residential properties.',
            createdAt: now,
            updatedAt: now,
            propertyCount: 2,
            noteCount: 3,
            properties: [
                {
                    id: uuidv4(),
                    agentId: agent1Id,
                    address: '123 Maple Ave',
                    city: 'Springfield',
                    state: 'IL',
                    zip: '62704',
                    tenantCount: 2,
                    tenants: [
                        { id: uuidv4(), propertyId: '', familyId: '', firstName: 'Alice', lastName: 'Johnson' },
                        { id: uuidv4(), propertyId: '', familyId: '', firstName: 'Bob', lastName: 'Johnson' }
                    ]
                },
                {
                    id: uuidv4(),
                    agentId: agent1Id,
                    address: '456 Oak Lane',
                    city: 'Springfield',
                    state: 'IL',
                    zip: '62704',
                    tenantCount: 1,
                    tenants: [
                        { id: uuidv4(), propertyId: '', familyId: '', firstName: 'Charlie', lastName: 'Brown' }
                    ]
                }
            ],
            notes: [
                { id: uuidv4(), agentId: agent1Id, propertyId: null, type: NoteType.Maintenance, description: 'Fix leaking faucet in Unit A', dueDate: new Date(Date.now() + 86400000 * 2) },
                { id: uuidv4(), agentId: agent1Id, propertyId: null, type: NoteType.Inspection, description: 'Annual fire safety check', dueDate: new Date(Date.now() + 86400000 * 5) }
            ]
        };

        const agent2: PropertyAgent = {
            id: agent2Id,
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            mobileNumber: '0987654321',
            agentNotes: 'Specializes in luxury downtown condos.',
            createdAt: now,
            updatedAt: now,
            propertyCount: 1,
            noteCount: 1,
            properties: [
                {
                    id: uuidv4(),
                    agentId: agent2Id,
                    address: '789 Pine Rd',
                    city: 'Chicago',
                    state: 'IL',
                    zip: '60601',
                    tenantCount: 3,
                    tenants: [
                        { id: uuidv4(), propertyId: '', familyId: '', firstName: 'David', lastName: 'Miller' },
                        { id: uuidv4(), propertyId: '', familyId: '', firstName: 'Eve', lastName: 'Miller' },
                        { id: uuidv4(), propertyId: '', familyId: '', firstName: 'Frank', lastName: 'Miller' }
                    ]
                }
            ],
            notes: [
                { id: uuidv4(), agentId: agent2Id, propertyId: null, type: NoteType.PestControl, description: 'Quarterly pest control service', dueDate: new Date(Date.now() + 86400000 * 1) }
            ]
        };

        this.agents.push(agent1, agent2);
    }

    getAll(): PropertyAgent[] {
        return this.agents;
    }

    getById(id: string): PropertyAgent | undefined {
        return this.agents.find(agent => agent.id === id);
    }

    getByEmail(email: string): PropertyAgent | undefined {
        return this.agents.find(agent => agent.email === email);
    }

    create(data: Omit<PropertyAgent, 'id' | 'createdAt' | 'updatedAt' | 'propertyCount' | 'noteCount' | 'properties' | 'notes'>): PropertyAgent {
        const now = new Date();
        const newAgent: PropertyAgent = {
            id: uuidv4(),
            ...data,
            createdAt: now,
            updatedAt: now,
            properties: [],
            notes: [],
            propertyCount: 0,
            noteCount: 0
        };
        this.agents.push(newAgent);
        return newAgent;
    }

    update(id: string, data: Partial<Omit<PropertyAgent, 'id' | 'createdAt' | 'updatedAt' | 'propertyCount' | 'noteCount' | 'properties' | 'notes'>>): PropertyAgent | undefined {
        const index = this.agents.findIndex(agent => agent.id === id);
        if (index === -1) return undefined;

        const updatedAgent: PropertyAgent = {
            ...this.agents[index]!,
            ...data,
            updatedAt: new Date()
        };
        this.agents[index] = updatedAgent;
        return updatedAgent;
    }

    delete(id: string): boolean {
        const initialLength = this.agents.length;
        this.agents = this.agents.filter(agent => agent.id !== id);
        return this.agents.length < initialLength;
    }

    // Support for pagination stretch goal
    getPaginated(page: number, limit: number): { data: PropertyAgent[], total: number } {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const data = this.agents.slice(startIndex, endIndex);
        return {
            data,
            total: this.agents.length
        };
    }
}

export const agentStore = new AgentStore();
