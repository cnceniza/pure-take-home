import { PropertyAgent, NoteType, NoteReminder, Family } from './types';
import { v4 as uuidv4 } from 'uuid';

class AgentStore {
    private agents: PropertyAgent[] = [];
    private families: Family[] = [];

    constructor() {
        // Seed with some initial data for testing
        this.seedData();
    }

    private seedData() {
        const agent1Id = uuidv4();
        const agent2Id = uuidv4();
        const now = new Date();
        const prop1Id = uuidv4();
        const prop2Id = uuidv4();
        const agent2Prop1Id = uuidv4();

        // Families
        const johnsonFamily = { id: uuidv4(), familyName: 'Johnson' };
        const brownFamily = { id: uuidv4(), familyName: 'Brown' };
        const millerFamily = { id: uuidv4(), familyName: 'Miller' };
        this.families.push(johnsonFamily, brownFamily, millerFamily);

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
                    id: prop1Id,
                    agentId: agent1Id,
                    address: '123 Maple Ave',
                    city: 'Springfield',
                    state: 'IL',
                    zip: '62704',
                    tenantCount: 2,
                    tenants: [
                        { id: uuidv4(), propertyId: prop1Id, familyId: johnsonFamily.id, firstName: 'Alice', lastName: 'Johnson' },
                        { id: uuidv4(), propertyId: prop1Id, familyId: johnsonFamily.id, firstName: 'Bob', lastName: 'Johnson' }
                    ]
                },
                {
                    id: prop2Id,
                    agentId: agent1Id,
                    address: '456 Oak Lane',
                    city: 'Springfield',
                    state: 'IL',
                    zip: '62704',
                    tenantCount: 1,
                    tenants: [
                        { id: uuidv4(), propertyId: prop2Id, familyId: brownFamily.id, firstName: 'Charlie', lastName: 'Brown' }
                    ]
                }
            ],
            notes: [
                { id: uuidv4(), agentId: agent1Id, propertyId: prop1Id, type: NoteType.Maintenance, description: 'Fix leaking faucet in Unit A', dueDate: new Date(now.getTime() + 86400000 * 2) },
                { id: uuidv4(), agentId: agent1Id, propertyId: null, type: NoteType.Inspection, description: 'Annual fire safety check', dueDate: new Date(now.getTime() + 86400000 * 5) }
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
                    id: agent2Prop1Id,
                    agentId: agent2Id,
                    address: '789 Pine Rd',
                    city: 'Chicago',
                    state: 'IL',
                    zip: '60601',
                    tenantCount: 3,
                    tenants: [
                        { id: uuidv4(), propertyId: agent2Prop1Id, familyId: millerFamily.id, firstName: 'David', lastName: 'Miller' },
                        { id: uuidv4(), propertyId: agent2Prop1Id, familyId: millerFamily.id, firstName: 'Eve', lastName: 'Miller' },
                        { id: uuidv4(), propertyId: agent2Prop1Id, familyId: millerFamily.id, firstName: 'Frank', lastName: 'Miller' }
                    ]
                }
            ],
            notes: [
                { id: uuidv4(), agentId: agent2Id, propertyId: agent2Prop1Id, type: NoteType.PestControl, description: 'Quarterly pest control service', dueDate: new Date(now.getTime() + 86400000 * 1) }
            ]
        };

        this.agents.push(agent1, agent2);
    }

    private enrichAgent(agent: PropertyAgent): PropertyAgent {
        if (!agent.properties) return agent;

        const enrichedProperties = agent.properties.map(prop => ({
            ...prop,
            tenants: prop.tenants?.map(tenant => ({
                ...tenant,
                familyName: this.families.find(f => f.id === tenant.familyId)?.familyName
            }))
        }));

        return {
            ...agent,
            properties: enrichedProperties
        };
    }

    getAll(): PropertyAgent[] {
        return this.agents.map(agent => this.enrichAgent(agent));
    }

    getById(id: string): PropertyAgent | undefined {
        const agent = this.agents.find(agent => agent.id === id);
        return agent ? this.enrichAgent(agent) : undefined;
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

    // Note management
    getNotes(agentId: string): NoteReminder[] {
        const agent = this.getById(agentId);
        return agent?.notes || [];
    }

    addNote(agentId: string, data: Omit<NoteReminder, 'id'>): NoteReminder | undefined {
        const agent = this.getById(agentId);
        if (!agent) return undefined;

        if (!agent.notes) {
            agent.notes = [];
        }

        const newNote: NoteReminder = {
            id: uuidv4(),
            ...data
        };

        agent.notes.push(newNote);
        agent.noteCount = agent.notes.length;
        return newNote;
    }

    updateNote(agentId: string, noteId: string, data: Partial<Omit<NoteReminder, 'id' | 'agentId'>>): NoteReminder | undefined {
        const agent = this.getById(agentId);
        if (!agent || !agent.notes) return undefined;

        const noteIndex = agent.notes.findIndex(note => note.id === noteId);
        if (noteIndex === -1) return undefined;

        const updatedNote = {
            ...agent.notes[noteIndex]!,
            ...data
        };

        agent.notes[noteIndex] = updatedNote;
        return updatedNote;
    }

    deleteNote(agentId: string, noteId: string): boolean {
        const agent = this.getById(agentId);
        if (!agent || !agent.notes) return false;

        const initialLength = agent.notes.length;
        agent.notes = agent.notes.filter(note => note.id !== noteId);
        agent.noteCount = agent.notes.length;

        return agent.notes.length < initialLength;
    }
}

export const agentStore = new AgentStore();
