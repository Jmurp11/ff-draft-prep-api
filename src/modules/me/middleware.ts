import { Resolver } from "../../types/graphql-utils";

export default async (
    resolver: Resolver,
    parent: any,
    args: any,
    context: any,
    info: any
) => {
    if (!context.session || !context.session.userId) {
        throw Error('No Cookie');
    }

    const result = await resolver(parent, args, context, info);
    return result;
}