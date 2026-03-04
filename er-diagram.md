# Entity Relationship Diagram - PURE Home River

This diagram illustrates the data structure and relationships within the Property Agent Management Application.

```mermaid
erDiagram
    PropertyAgent ||--o{ Property : manages
    PropertyAgent ||--o{ NoteReminder : creates
    Property ||--o{ Tenant : houses
    Property ||--o{ NoteReminder : "references (optional)"
    Family ||--o{ Tenant : includes

    PropertyAgent {
        string id PK
        string firstName
        string lastName
        string email
        string mobileNumber
        string agentNotes
        datetime createdAt
        datetime updatedAt
    }

    Property {
        string id PK
        string agentId FK
        string address
        string city
        string state
        string zip
    }

    Tenant {
        string id PK
        string propertyId FK
        string familyId FK
        string firstName
        string lastName
    }

    Family {
        string id PK
        string familyName
    }

    NoteReminder {
        string id PK
        string agentId FK
        string propertyId FK "nullable"
        string type
        string description
        datetime dueDate
    }
```

### Key Relationships:
- **Agents to Properties**: A single agent manages multiple properties (One-to-Many).
- **Properties to Occupants**: Each property hosts one or more tenants, but all tenants in a property belong to the same family (One-to-Many).
- **Agents to Notes**: Agents create reminders for themselves, which can be general ("Across Portfolio") or linked to a specific property (One-to-Many).
- **Families to Tenants**: A family can have multiple members listed as tenants in a property.
