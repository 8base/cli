export function rootGraphqlSchema(): string {
    return `
    type Query {
        company: String
    }

    type Mutation {
        company: String
    }
    `;
}