import { Connection } from 'typeorm';
import { createTypeormConn } from '../../utils/createTypeOrmConn';
import { User } from '../../entity/index';
import {
    user as userData,
    shared
} from '../../constants/test-constants';
import { TestClient } from '../../utils/TestClient';

let userId: string;
let conn: Connection;
const email = userData.email;
const password = userData.password;

beforeEach(async () => {
    conn = await createTypeormConn();
    const user = await User.create({
        email,
        password,
        description: userData.description,
        latitude: shared.longitude,
        longitude: shared.longitude,
        confirmed: true
    }).save();
    userId = user.id;
});

afterEach(async () => {
    conn.close();
});

describe('me', () => {
    it("return null if no cookie", async () => {
        const client = new TestClient(process.env.TEST_HOST as string);
        const response = await client.me();
        expect(response.data.me).toBeNull();
    });

    it("get current user", async () => {
        const client = new TestClient(process.env.TEST_HOST as string);
        await client.login(email, password);
        const response = await client.me();

        expect(response.data).toEqual({
            me: {
                id: userId,
                email
            }
        });
    });
});