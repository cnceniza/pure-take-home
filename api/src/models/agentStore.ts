import { PropertyAgent } from './types';
import { v4 as uuidv4 } from 'uuid';

class AgentStore {
    private agents: PropertyAgent[] = [];

    constructor() {
        // Seed with some initial data for testing
        this.create({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            mobileNumber: '1234567890'
        });
        this.create({
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            mobileNumber: '0987654321'
        });
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

    create(data: Omit<PropertyAgent, 'id' | 'createdAt' | 'updatedAt'>): PropertyAgent {
        const now = new Date();
        const newAgent: PropertyAgent = {
            id: uuidv4(),
            ...data,
            createdAt: now,
            updatedAt: now
        };
        this.agents.push(newAgent);
        return newAgent;
    }

    update(id: string, data: Partial<Omit<PropertyAgent, 'id' | 'createdAt' | 'updatedAt'>>): PropertyAgent | undefined {
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
